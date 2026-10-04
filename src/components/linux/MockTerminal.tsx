/**
 * @file MockTerminal.tsx
 * @description In-browser POSIX-compliant simulated Linux CLI with virtual filesystem.
 * 
 * DEVELOPER ARCHITECTURE & LOGIC NOTES:
 * -------------------------------------
 * 1. Virtual Filesystem State:
 *    - `fsState` is a deeply nested tree object mirroring a standard Linux directory tree (/home/student, /etc, /var/log).
 *    - Path resolution: `resolvePath(currentPath, targetPath)` handles absolute paths (starts with /), relative
 *      paths ('projects', './script.py'), parent traversal ('..'), and home expansion ('~').
 * 2. Command Pipeline & Execution:
 *    - Commands are parsed into tokens (command + arguments) handling basic quotation.
 *    - State mutations (e.g., `mkdir`, `touch`, `chmod`) clone the filesystem immutably and update the target node.
 *    - `python3` command inspects targeted script and evaluates predefined Python behaviors (e.g., runs `script.py` and `fibonacci.py`).
 * 3. Shell UX Features:
 *    - Up/Down arrow key command history buffer navigation.
 *    - Tab key auto-completion against current directory files and valid binaries.
 *    - Terminal output streaming simulation with standard bash prompt: student@shaheenacademy:~$
 */

import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_FILESYSTEM } from '../../data/mockData';
import { VirtualFile, TerminalHistoryItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Copy, Check, CornerDownLeft } from 'lucide-react';

export const MockTerminal: React.FC = () => {
  const { isMidnight } = useTheme();
  const [fs, setFs] = useState<VirtualFile>(INITIAL_FILESYSTEM);
  const [currentPath, setCurrentPath] = useState<string>('/home/student');
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    {
      id: 'init-1',
      command: 'welcome',
      output: [
        'Shaheen Academy POSIX Educational Terminal v24.04-LTS',
        'Type "help" to see available shell commands, or click sample command shortcuts below.',
        'Virtual filesystem mounted at / (read/write simulated).'
      ],
      timestamp: '10:00:00',
      cwd: '/home/student'
    }
  ]);
  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal whenever history updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  /**
   * Helper: Traverse the virtual filesystem tree to locate a directory node
   */
  const getNodeAtPath = (root: VirtualFile, pathStr: string): VirtualFile | null => {
    const clean = pathStr === '/' ? [] : pathStr.split('/').filter(Boolean);
    let curr: VirtualFile = root;
    for (const segment of clean) {
      if (curr.type !== 'directory' || !curr.children || !curr.children[segment]) {
        return null;
      }
      curr = curr.children[segment];
    }
    return curr;
  };

  /**
   * Path resolution algorithm:
   * Handles absolute ("/var/log"), relative ("projects", "./script.py"), parent (".."), and home ("~")
   */
  const resolvePath = (cwd: string, target: string): string => {
    if (!target || target === '.') return cwd;
    if (target === '~') return '/home/student';
    if (target.startsWith('~/')) {
      target = '/home/student/' + target.slice(2);
    }

    let absoluteSegments: string[];
    if (target.startsWith('/')) {
      absoluteSegments = target.split('/').filter(Boolean);
    } else {
      absoluteSegments = [...cwd.split('/').filter(Boolean), ...target.split('/').filter(Boolean)];
    }

    const resolved: string[] = [];
    for (const seg of absoluteSegments) {
      if (seg === '.') continue;
      if (seg === '..') {
        resolved.pop();
      } else {
        resolved.push(seg);
      }
    }
    return '/' + resolved.join('/');
  };

  /**
   * Main command execution router
   */
  const executeCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Append to bash command history buffer
    setCmdHistoryList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1).map((a) => a.replace(/^"|"$/g, ''));

    let output: string | string[] = '';
    let isError = false;

    switch (command) {
      case 'help':
        output = [
          'Shaheen Academy Shell Commands Reference:',
          '  ls [-l, -la]       List directory contents and permissions',
          '  pwd                Print current working directory',
          '  cd <path>          Change directory (supports .., ~, /)',
          '  cat <file>         Concatenate and display file content',
          '  chmod <mode> <f>   Change file permissions (e.g. chmod 755 script.py)',
          '  grep <pat> <file>  Search for pattern in file',
          '  mkdir <dir>        Create new directory',
          '  touch <file>       Create empty file',
          '  python3 <file>     Execute Python script',
          '  tree               Display directory tree visualization',
          '  echo <text>        Print text or redirect to file',
          '  whoami             Print current logged-in user',
          '  uname -a           Print kernel architecture details',
          '  date               Print current system date and time',
          '  clear              Clear terminal display history',
          '  history            Show command history list'
        ];
        break;

      case 'pwd':
        output = currentPath;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'whoami':
        output = 'student';
        break;

      case 'uname':
        output = 'Linux shaheenacademy 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
        break;

      case 'date':
        output = new Date().toUTCString();
        break;

      case 'history':
        output = cmdHistoryList.map((cmd, idx) => `  ${idx + 1}  ${cmd}`);
        break;

      case 'cd': {
        const target = args[0] || '~';
        const targetResolved = resolvePath(currentPath, target);
        const node = getNodeAtPath(fs, targetResolved);

        if (!node) {
          output = `bash: cd: ${target}: No such file or directory`;
          isError = true;
        } else if (node.type !== 'directory') {
          output = `bash: cd: ${target}: Not a directory`;
          isError = true;
        } else {
          setCurrentPath(targetResolved);
        }
        break;
      }

      case 'ls': {
        const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const targetArg = args.find((a) => !a.startsWith('-')) || '.';
        const targetResolved = resolvePath(currentPath, targetArg);
        const node = getNodeAtPath(fs, targetResolved);

        if (!node) {
          output = `ls: cannot access '${targetArg}': No such file or directory`;
          isError = true;
        } else if (node.type === 'file') {
          output = isLong ? `${node.permissions} 1 ${node.owner} ${node.owner} ${node.size} ${node.updatedAt} ${node.name}` : node.name;
        } else {
          const children = node.children || {};
          const keys = Object.keys(children);

          if (isLong) {
            const lines = [`total ${keys.length * 4}`];
            if (showHidden) {
              lines.push(`drwxr-xr-x 2 ${node.owner} ${node.owner} 4096 Oct 03 10:00 .`);
              lines.push(`drwxr-xr-x 3 root root 4096 Oct 03 10:00 ..`);
            }
            for (const key of keys) {
              const item = children[key];
              const prefix = item.type === 'directory' ? 'd' : '-';
              lines.push(
                `${prefix}${item.permissions} 1 ${item.owner} ${item.owner} ${item.size.padStart(6, ' ')} ${item.updatedAt} ${item.name}`
              );
            }
            output = lines;
          } else {
            output = keys.join('   ');
          }
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          output = 'cat: missing file operand';
          isError = true;
          break;
        }
        const targetResolved = resolvePath(currentPath, args[0]);
        const node = getNodeAtPath(fs, targetResolved);

        if (!node) {
          output = `cat: ${args[0]}: No such file or directory`;
          isError = true;
        } else if (node.type === 'directory') {
          output = `cat: ${args[0]}: Is a directory`;
          isError = true;
        } else {
          output = (node.content ?? '').split('\n');
        }
        break;
      }

      case 'chmod': {
        if (args.length < 2) {
          output = 'chmod: missing operand (Usage: chmod <octal_mode> <file>)';
          isError = true;
          break;
        }
        const mode = args[0];
        const fileName = args[1];
        const targetResolved = resolvePath(currentPath, fileName);
        const node = getNodeAtPath(fs, targetResolved);

        if (!node) {
          output = `chmod: cannot access '${fileName}': No such file or directory`;
          isError = true;
        } else {
          // Convert octal mode like 755 to symbolic representation
          const octalToSymbolic = (octal: string): string => {
            const map: Record<string, string> = {
              '7': 'rwx', '6': 'rw-', '5': 'r-x', '4': 'r--',
              '3': '-wx', '2': '-w-', '1': '--x', '0': '---'
            };
            if (octal.length !== 3) return 'rwxr-xr-x';
            return (map[octal[0]] || 'rwx') + (map[octal[1]] || 'r-x') + (map[octal[2]] || 'r-x');
          };

          const newPerms = octalToSymbolic(mode);
          node.permissions = newPerms;
          setFs({ ...fs });
          output = `mode of '${fileName}' changed from 0644 to 0${mode} (${newPerms})`;
        }
        break;
      }

      case 'grep': {
        if (args.length < 2) {
          output = 'grep: missing pattern or file operand (Usage: grep <pattern> <file>)';
          isError = true;
          break;
        }
        const pattern = args[0];
        const targetFile = args[1];
        const targetResolved = resolvePath(currentPath, targetFile);
        const node = getNodeAtPath(fs, targetResolved);

        if (!node) {
          output = `grep: ${targetFile}: No such file or directory`;
          isError = true;
        } else if (node.type === 'directory') {
          output = `grep: ${targetFile}: Is a directory`;
          isError = true;
        } else {
          const lines = (node.content || '').split('\n');
          const matches = lines.filter((l) => l.toLowerCase().includes(pattern.toLowerCase()));
          output = matches.length > 0 ? matches : `(no matches for pattern "${pattern}")`;
        }
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          output = 'mkdir: missing operand';
          isError = true;
          break;
        }
        const dirName = args[0];
        const targetResolved = resolvePath(currentPath, dirName);
        const parentPath = targetResolved.substring(0, targetResolved.lastIndexOf('/')) || '/';
        const parentNode = getNodeAtPath(fs, parentPath);

        if (!parentNode || parentNode.type !== 'directory') {
          output = `mkdir: cannot create directory '${dirName}': No such file or directory`;
          isError = true;
        } else {
          parentNode.children = parentNode.children || {};
          const baseName = targetResolved.substring(targetResolved.lastIndexOf('/') + 1);
          parentNode.children[baseName] = {
            name: baseName,
            type: 'directory',
            permissions: 'rwxr-xr-x',
            owner: 'student',
            size: '4096',
            updatedAt: 'Oct 03 15:00',
            children: {}
          };
          setFs({ ...fs });
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          output = 'touch: missing file operand';
          isError = true;
          break;
        }
        const fileName = args[0];
        const targetResolved = resolvePath(currentPath, fileName);
        const parentPath = targetResolved.substring(0, targetResolved.lastIndexOf('/')) || '/';
        const parentNode = getNodeAtPath(fs, parentPath);

        if (!parentNode || parentNode.type !== 'directory') {
          output = `touch: cannot touch '${fileName}': No such file or directory`;
          isError = true;
        } else {
          parentNode.children = parentNode.children || {};
          const baseName = targetResolved.substring(targetResolved.lastIndexOf('/') + 1);
          if (!parentNode.children[baseName]) {
            parentNode.children[baseName] = {
              name: baseName,
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'student',
              size: '0',
              updatedAt: 'Oct 03 15:00',
              content: ''
            };
          }
          setFs({ ...fs });
        }
        break;
      }

      case 'tree': {
        const currNode = getNodeAtPath(fs, currentPath);
        if (!currNode || currNode.type !== 'directory') {
          output = '.';
          break;
        }
        const lines: string[] = ['.'];
        const traverse = (node: VirtualFile, prefix = '') => {
          const keys = Object.keys(node.children || {});
          keys.forEach((k, idx) => {
            const isLast = idx === keys.length - 1;
            const item = node.children![k];
            lines.push(`${prefix}${isLast ? '└── ' : '├── '}${item.name}`);
            if (item.type === 'directory') {
              traverse(item, prefix + (isLast ? '    ' : '│   '));
            }
          });
        };
        traverse(currNode);
        output = lines;
        break;
      }

      case 'python3':
      case 'python': {
        if (!args[0]) {
          output = 'Python 3.12.3 (main, Apr 10 2026, 08:34:02) [GCC 13.2.0] on linux\nType "help", "copyright", "credits" or "license" for more information.';
          break;
        }
        const targetResolved = resolvePath(currentPath, args[0]);
        const node = getNodeAtPath(fs, targetResolved);

        if (!node) {
          output = `python3: can't open file '${args[0]}': [Errno 2] No such file or directory`;
          isError = true;
        } else if (node.type === 'directory') {
          output = `python3: ${args[0]}: Is a directory`;
          isError = true;
        } else {
          // Script simulation logic
          if (node.name === 'script.py') {
            output = [
              '[*] Shaheen Academy System Daemon v2.4',
              '[+] Status: All microservices nominal',
              '[+] Memory check: 78% available',
              '[+] Active users: student'
            ];
          } else if (node.name === 'fibonacci.py') {
            output = '[0, 1, 1, 2, 3, 5, 8, 13]';
          } else {
            output = `[Executed ${node.name} successfully (Process exited with code 0)]`;
          }
        }
        break;
      }

      case 'echo': {
        const rawArgStr = args.join(' ');
        if (rawArgStr.includes('>')) {
          const [text, fName] = rawArgStr.split('>').map((s) => s.trim());
          const targetResolved = resolvePath(currentPath, fName);
          const parentPath = targetResolved.substring(0, targetResolved.lastIndexOf('/')) || '/';
          const parentNode = getNodeAtPath(fs, parentPath);

          if (parentNode && parentNode.type === 'directory') {
            parentNode.children = parentNode.children || {};
            const baseName = targetResolved.substring(targetResolved.lastIndexOf('/') + 1);
            parentNode.children[baseName] = {
              name: baseName,
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'student',
              size: String(text.length),
              updatedAt: 'Oct 03 15:00',
              content: text
            };
            setFs({ ...fs });
            output = '';
          } else {
            output = `bash: ${fName}: No such file or directory`;
            isError = true;
          }
        } else {
          output = rawArgStr;
        }
        break;
      }

      default:
        output = `bash: ${command}: command not found. Type 'help' for valid commands.`;
        isError = true;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        command: trimmed,
        output,
        isError,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cwd: currentPath
      }
    ]);

    setInputVal('');
  };

  /**
   * Keyboard shortcuts: Up/Down arrow history & Tab autocomplete
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistoryList.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistoryList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistoryList[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistoryList.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistoryList.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistoryList[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currNode = getNodeAtPath(fs, currentPath);
      if (!currNode || currNode.type !== 'directory' || !currNode.children) return;

      const keys = Object.keys(currNode.children);
      const partial = inputVal.trim().split(' ').pop() || '';
      const match = keys.find((k) => k.startsWith(partial));

      if (match) {
        const tokens = inputVal.split(' ');
        tokens[tokens.length - 1] = match;
        setInputVal(tokens.join(' '));
      }
    }
  };

  // Helper for formatted path in prompt (~/projects instead of /home/student/projects)
  const displayPromptPath = currentPath.startsWith('/home/student')
    ? currentPath.replace('/home/student', '~')
    : currentPath;

  const copyTerminalContent = () => {
    const text = history
      .map((h) => `student@shaheenacademy:${h.cwd}$ ${h.command}\n${Array.isArray(h.output) ? h.output.join('\n') : h.output}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 font-mono text-xs sm:text-sm border ${
        isMidnight 
          ? 'bg-black border-[#14233c] shadow-cyan-950/20' 
          : 'bg-[#070b14] border-slate-800'
      } ${
        isExpanded ? 'fixed inset-4 z-50 flex flex-col' : 'relative'
      }`}
    >
      {/* Terminal Titlebar */}
      <div className={`px-4 py-2.5 flex items-center justify-between select-none border-b ${
        isMidnight 
          ? 'bg-[#04060b] border-[#14233c]' 
          : 'bg-[#0f172a]/95 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-600/40"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-600/40"></span>
            <span className={`w-3 h-3 rounded-full inline-block border ${
              isMidnight 
                ? 'bg-[#00e5ff] border-cyan-400/50' 
                : 'bg-emerald-500/80 border-emerald-600/40'
            }`}></span>
          </div>
          <TerminalIcon className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
          <span className="text-xs font-semibold text-slate-300 font-mono tracking-wide">
            student@shaheenacademy: {displayPromptPath}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={copyTerminalContent}
            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Copy Terminal Log"
            aria-label="Copy Terminal Log"
          >
            {isCopied ? <Check className={`w-3.5 h-3.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title={isExpanded ? 'Minimize Window' : 'Maximize Window'}
            aria-label="Toggle Fullscreen"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div
        className={`p-4 overflow-y-auto space-y-3 ${
          isMidnight ? 'bg-black' : 'bg-[#080d1a]'
        } ${
          isExpanded ? 'flex-1' : 'min-h-[340px] max-h-[460px]'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-semibold ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
                student@shaheenacademy
              </span>
              <span className="text-slate-500">:</span>
              <span className="text-cyan-400 font-semibold">{item.cwd.replace('/home/student', '~')}</span>
              <span className="text-slate-400">$</span>
              <span className="text-slate-100 font-medium">{item.command}</span>
            </div>

            {item.output && (
              <div
                className={`pl-2 sm:pl-4 whitespace-pre-wrap leading-relaxed ${
                  item.isError ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                {Array.isArray(item.output) ? (
                  item.output.map((line, lIdx) => <div key={lIdx}>{line}</div>)
                ) : (
                  <div>{item.output}</div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Active Command Input Line */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className={`font-semibold ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
            student@shaheenacademy
          </span>
          <span className="text-slate-500">:</span>
          <span className="text-cyan-400 font-semibold">{displayPromptPath}</span>
          <span className="text-slate-400">$</span>
          <div className="flex-1 min-w-[140px] relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent outline-none border-none p-0 focus:ring-0 font-mono text-xs sm:text-sm ${
                isMidnight ? 'text-[#00e5ff] caret-[#00e5ff]' : 'text-emerald-300 caret-emerald-400'
              }`}
              spellCheck={false}
              autoComplete="off"
              autoFocus
              aria-label="Mock terminal command input"
            />
          </div>
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Quick Interactive Command Shortcuts */}
      <div className={`border-t px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs text-slate-400 select-none ${
        isMidnight ? 'bg-[#020408] border-[#14233c]' : 'bg-[#0b101d] border-slate-800/80'
      }`}>
        <span className="text-[11px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3" />
          <span>Quick Run:</span>
        </span>
        {[
          'ls -la',
          'cat script.py',
          'python3 script.py',
          'chmod 755 script.py',
          'tree',
          'cat notes.txt',
          'help'
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors shrink-0 border ${
              isMidnight
                ? 'bg-black hover:bg-slate-900 text-slate-300 hover:text-[#00e5ff] border-[#14233c] hover:border-cyan-400/50'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
