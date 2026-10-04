import React, { useState } from 'react';
import { COURSE_TRACKS } from '../../data/mockData';
import { SyntaxMatcher } from './SyntaxMatcher';
import { useTheme } from '../../context/ThemeContext';
import { EditableText } from '../admin/EditableText';
import { EditableButton } from '../admin/EditableButton';
import { Code2, BookOpen, Layers, CheckCircle2, ChevronDown, ChevronUp, Play, Sparkles } from 'lucide-react';

export const PythonHub: React.FC = () => {
  const { isMidnight } = useTheme();
  const track = COURSE_TRACKS.find((t) => t.id === 'python')!;
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('py-1');
  const [activeCodeTab, setActiveCodeTab] = useState<'recursion' | 'trees' | 'comprehension'>('comprehension');
  const [simulationOutput, setSimulationOutput] = useState<string>('');

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  const codeSnippets = {
    comprehension: {
      title: 'Dict & Set Comprehensions with Walrus Operator',
      code: `# Python 3.12 Idiom: Combining Walrus & Dict Comprehension
raw_metrics = ["cpu:42", "mem:78", "disk:90", "gpu:invalid", "net:12"]

parsed = {
    metric: int(val)
    for item in raw_metrics
    if (parts := item.split(":")) and parts[1].isdigit()
    and (metric := parts[0]) and (val := parts[1])
}

print(parsed)`,
      output: `{'cpu': 42, 'mem': 78, 'disk': 90, 'net': 12}`
    },
    recursion: {
      title: 'Recursive Binary Search with O(log n) Verification',
      code: `def binary_search(arr: list[int], target: int, low: int, high: int) -> int:
    if low > high:
        return -1 # Base case: not found
    
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] > target:
        return binary_search(arr, target, low, mid - 1)
    else:
        return binary_search(arr, target, mid + 1, high)

nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
idx = binary_search(nums, 23, 0, len(nums) - 1)
print(f"Target found at index: {idx}")`,
      output: `Target found at index: 5`
    },
    trees: {
      title: 'Object-Oriented Tree Traversal with Dunder Magic',
      code: `class Node:
    def __init__(self, val: int):
        self.val = val
        self.left = None
        self.right = None

    def __repr__(self) -> str:
        return f"Node({self.val})"

def inorder(root: Node | None) -> list[int]:
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []

root = Node(20)
root.left = Node(10)
root.right = Node(30)
print("Inorder Traversal:", inorder(root))`,
      output: `Inorder Traversal: [10, 20, 30]`
    }
  };

  const handleRunCode = () => {
    setSimulationOutput(codeSnippets[activeCodeTab].output);
  };

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md relative overflow-hidden transition-colors ${
        isMidnight 
          ? 'border-[#14233c] bg-black shadow-cyan-950/20' 
          : 'border-slate-800 bg-[#0d121f]/90'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className={`flex items-center gap-2 text-xs font-mono ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
              <Code2 className="w-4 h-4" />
              <EditableText
                contentKey="pythonHub.kicker"
                fallback="Track 01 · Python 3.12 & Algorithmic Complexity"
                label="Python Hub Kicker"
                as="span"
              />
            </div>

            <EditableText
              contentKey="pythonHub.title"
              fallback="Python Programming & Algorithm Hub"
              label="Python Hub Main Header"
              as="h1"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            />

            <EditableText
              contentKey="pythonHub.description"
              fallback="From clean syntax paradigms and dynamic memory representations to object-oriented dunder protocols and recursive tree algorithms."
              label="Python Hub Description"
              as="p"
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl"
            />

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                <span>Idiomatic Comprehensions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                <span>Object-Oriented Design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                <span>Big-O Mathematical Bounds</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <img
              src={track.imagePath}
              alt="Python Code Visualization"
              referrerPolicy="no-referrer"
              className={`w-full h-auto rounded-xl object-cover border shadow-lg aspect-[4/3] ${
                isMidnight ? 'border-[#14233c]' : 'border-slate-800'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Interactive Element: Syntax Matcher Mini-Game */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className={`w-5 h-5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
            <EditableText
              contentKey="pythonHub.matcherTitle"
              fallback="Interactive Concept & Syntax Matcher"
              label="Syntax Matcher Game Header"
              as="span"
            />
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live Drag/Click Challenge</span>
        </div>
        <EditableText
          contentKey="pythonHub.matcherDesc"
          fallback="Pair modern Python syntax constructs, dunder methods, and data structures with their algorithmic definitions."
          label="Syntax Matcher Game Instructions"
          as="p"
          className="text-xs text-slate-400"
        />
        <SyntaxMatcher />
      </section>

      {/* Code Sandbox / Algorithm Playground */}
      <section className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-colors ${
        isMidnight ? 'border-[#14233c] bg-black' : 'border-slate-800 bg-[#0d121f]/90'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className={`text-xs font-mono uppercase tracking-wider ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
              Interactive Snippet Explorer
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Core Python Patterns in Action</h3>
          </div>

          <div className={`flex items-center gap-1.5 rounded-lg border p-0.5 text-xs ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => {
                setActiveCodeTab('comprehension');
                setSimulationOutput('');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'comprehension'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] font-semibold'
                    : 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Comprehensions
            </button>
            <button
              onClick={() => {
                setActiveCodeTab('recursion');
                setSimulationOutput('');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'recursion'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] font-semibold'
                    : 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Binary Search
            </button>
            <button
              onClick={() => {
                setActiveCodeTab('trees');
                setSimulationOutput('');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'trees'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] font-semibold'
                    : 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Binary Tree OOP
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className={`rounded-xl border overflow-hidden ${
          isMidnight ? 'border-[#14233c] bg-black' : 'border-slate-800 bg-[#080c16]'
        }`}>
          <div className={`px-4 py-2 border-b flex items-center justify-between text-xs text-slate-400 font-mono ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-[#0f172a] border-slate-800'
          }`}>
            <span>{codeSnippets[activeCodeTab].title}</span>
            <EditableButton
              contentKey="pythonHub.runCta"
              fallback="Run Simulation"
              label="Python Run Demo CTA Button"
              onClick={handleRunCode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-colors ${
                isMidnight 
                  ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
              icon={<Play className="w-3 h-3 fill-current mr-1" />}
              iconPosition="left"
            />
          </div>

          <pre className={`p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed whitespace-pre ${
            isMidnight ? 'text-[#00e5ff]' : 'text-emerald-300'
          }`}>
            <code>{codeSnippets[activeCodeTab].code}</code>
          </pre>

          {simulationOutput && (
            <div className={`border-t p-4 text-xs font-mono space-y-1 ${
              isMidnight ? 'border-[#14233c] bg-[#020408] text-cyan-200' : 'border-slate-800 bg-[#060911] text-slate-200'
            }`}>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Standard Output:</span>
              <div className={`font-semibold ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
                {simulationOutput}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Curriculum Syllabus Modules Accordion */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Curriculum Modules & Syllabi</h2>
        <div className="space-y-3">
          {track.modules.map((m) => {
            const isExpanded = expandedModuleId === m.id;
            return (
              <div
                key={m.id}
                className="rounded-xl border border-slate-800 bg-[#0d121f]/70 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleModule(m.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-emerald-400">{m.level}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono">{m.estimatedHours} Hours</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{m.title}</h3>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 space-y-3 text-xs sm:text-sm text-slate-300">
                    <p className="leading-relaxed">{m.description}</p>
                    <div className="space-y-1 pt-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                        Core Competencies:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {m.topics.map((t, tIdx) => (
                          <li key={tIdx} className="flex items-center gap-2 text-slate-300 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
