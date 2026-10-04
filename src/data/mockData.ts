import { CourseTrack, MatchPair, VirtualFile, QuizQuestion, ResourceItem } from '../types';

export const COURSE_TRACKS: CourseTrack[] = [
  {
    id: 'python',
    title: 'Python Programming & Algorithms',
    subtitle: 'From Fundamentals to Algorithmic Complexity',
    tagline: 'Modern, idiomatic Python syntax, data structures, and production patterns.',
    description: 'Master clean procedural coding, object-oriented paradigms, dynamic memory structures, and high-performance algorithms essential for both academic excellence and production systems.',
    accentColor: 'emerald',
    imagePath: '/src/assets/images/track_python_diagram_1791091445514.jpg',
    learningOutcomes: [
      'Write idiomatic Python 3.12 utilizing list/dict comprehensions and generator pipelines',
      'Implement fundamental and composite data structures: Stacks, Queues, Linked Lists, Trees',
      'Analyze computational efficiency using Big-O time and space complexity models',
      'Design modular object-oriented systems with inheritance, polymorphism, and dunder methods',
      'Debug and test algorithmic edge cases using automated assertions and unit testing'
    ],
    modules: [
      {
        id: 'py-1',
        title: 'Core Syntax, Typing & Control Flow',
        level: 'Foundation',
        estimatedHours: 12,
        description: 'Deep dive into Python variable scoping (LEGB), type hints, match-case structures, and robust exception handling.',
        topics: ['LEGB Scoping Rules', 'Type Annotations (typing module)', 'Pattern Matching (match/case)', 'Custom Exceptions & Context Managers']
      },
      {
        id: 'py-2',
        title: 'Data Structures & Memory Models',
        level: 'Intermediate',
        estimatedHours: 18,
        description: 'Explore Python memory references, mutability vs immutability, collections (deque, Counter, defaultdict), and custom linked lists.',
        topics: ['Reference vs Value Semantics', 'Collections Module & Slicing', 'Linked Lists & Doubly-Linked Nodes', 'Binary Search Trees (BST)']
      },
      {
        id: 'py-3',
        title: 'Object-Oriented Programming & Dunder Magic',
        level: 'Intermediate',
        estimatedHours: 16,
        description: 'Craft robust OOP architectures with encapsulation, dunder protocols (__repr__, __eq__, __iter__), and property decorators.',
        topics: ['Class & Instance Namespaces', 'The Data Model & Special Methods', 'Inheritance & Abstract Base Classes', 'Decorators & Closures']
      },
      {
        id: 'py-4',
        title: 'Algorithm Design & Computational Complexity',
        level: 'Advanced',
        estimatedHours: 24,
        description: 'Rigorous algorithmic analysis: Divide-and-conquer, sorting algorithms (Merge, Quick, Heap), recursive trees, and dynamic programming.',
        topics: ['Big-O / Big-Theta Mathematical Bounds', 'Recursive Recurrence Relations', 'Graph Traversal (BFS / DFS)', 'Dynamic Programming Memoization']
      }
    ]
  },
  {
    id: 'linux',
    title: 'Linux & Systems Administration',
    subtitle: 'Master the Terminal, Kernel Interfaces, and Automation',
    tagline: 'POSIX standard commands, bash scripting, file permissions, and process management.',
    description: 'Understand the operating system from the ground up. Master command-line navigation, file system permissions, Unix pipes, process scheduling, and bash automation.',
    accentColor: 'cyan',
    imagePath: '/src/assets/images/track_linux_terminal_1791091456660.jpg',
    learningOutcomes: [
      'Navigate the POSIX filesystem hierarchy (/etc, /var, /dev, /proc) with fluid speed',
      'Manipulate Unix streams (stdin, stdout, stderr) using pipes, redirects, and filters',
      'Calculate and enforce standard octal and symbolic permissions (chmod, chown, umask)',
      'Monitor and manage processes, signals (SIGTERM, SIGKILL), and system memory metrics',
      'Automate repetitive administration workflows using robust shell scripting patterns'
    ],
    modules: [
      {
        id: 'lx-1',
        title: 'Filesystem Hierarchy & Navigation',
        level: 'Foundation',
        estimatedHours: 10,
        description: 'Understanding root, absolute vs relative paths, inode fundamentals, hard vs symbolic links, and core file manipulation.',
        topics: ['FHS Architecture', 'Inodes & Directory Entries', 'Path Resolution Algorithms', 'Link Mechanics (ln & ln -s)']
      },
      {
        id: 'lx-2',
        title: 'Permissions & User Management',
        level: 'Foundation',
        estimatedHours: 14,
        description: 'Master user/group/other access modes, octal bit calculation, SUID/SGID bits, sticky bits, and access control lists.',
        topics: ['Read/Write/Execute Bitmasks', 'Octal Permissions (e.g. 755, 644)', 'Special Bits (SUID, SGID, Sticky)', 'User & Group Database (/etc/passwd)']
      },
      {
        id: 'lx-3',
        title: 'Pipes, Filters & Stream Processing',
        level: 'Intermediate',
        estimatedHours: 18,
        description: 'Harness the Unix philosophy: Combining single-purpose utilities using pipes, sed, awk, grep, and output redirection.',
        topics: ['File Descriptors (0, 1, 2)', 'Grep & Regular Expression Filtering', 'Sed Stream Editing & Replacements', 'Awk Column Extraction & Summation']
      },
      {
        id: 'lx-4',
        title: 'Processes, Daemons & Bash Scripting',
        level: 'Advanced',
        estimatedHours: 20,
        description: 'Process lifecycle, fork/exec mechanics, background jobs, systemd service units, and production bash scripting conventions.',
        topics: ['Process States & PID Management', 'POSIX Signal Handling (kill, trap)', 'Cron Schedulers & Systemd Services', 'Defensive Bash Scripting (set -euo pipefail)']
      }
    ]
  },
  {
    id: 'theory',
    title: 'A-Level Computer Science Theory',
    subtitle: 'Comprehensive Specification Coverage & Exam Mastery',
    tagline: 'Boolean logic, processor architectures, networking layers, and data representation.',
    description: 'Rigorous theoretical foundations mapped directly to UK and international exam boards (OCR, AQA, Cambridge 9618). Built to secure top marks on theoretical papers.',
    accentColor: 'violet',
    imagePath: '/src/assets/images/track_alevel_theory_1791091466518.jpg',
    learningOutcomes: [
      'Simplify complex logic circuits using Boolean identities, De Morgan’s Laws, and Karnaugh maps',
      'Trace data movement through the Fetch-Decode-Execute cycle and internal processor registers',
      'Analyze data representations: Two’s complement integers, fixed point, and normalized floating point',
      'Deconstruct the 4-layer TCP/IP and 7-layer OSI networking models and protocol interactions',
      'Articulate computational laws, legal frameworks (GDPR/CMA), and ethics in modern computing'
    ],
    modules: [
      {
        id: 'th-1',
        title: 'Boolean Algebra & Logic Simplification',
        level: 'Exam Spec',
        estimatedHours: 16,
        description: 'Logic gates (AND, OR, NOT, XOR, NAND, NOR), truth tables, Boolean algebraic rules, and 2-to-4 variable Karnaugh mapping.',
        topics: ['De Morgan’s Laws', 'Karnaugh Maps (K-Maps)', 'Half-Adders & Full-Adders', 'Flip-Flops & Sequential Circuits']
      },
      {
        id: 'th-2',
        title: 'Processor Architecture & The F-D-E Cycle',
        level: 'Exam Spec',
        estimatedHours: 20,
        description: 'Von Neumann vs Harvard architectures, internal registers (PC, MAR, MDR, ACC, CIR), buses, and CISC vs RISC processors.',
        topics: ['Fetch-Decode-Execute Micro-operations', 'Control, Data & Address Buses', 'Pipelining & Branch Prediction', 'Assembly Language Mnemonics (LDR, STR, ADD)']
      },
      {
        id: 'th-3',
        title: 'Data Representation & Arithmetic',
        level: 'Exam Spec',
        estimatedHours: 18,
        description: 'Binary, Hexadecimal, Two’s complement negative numbers, character encoding (ASCII, UTF-8), and IEEE floating point math.',
        topics: ['Two’s Complement Sign Extension', 'Mantissa & Exponent Normalization', 'Underflow & Overflow Errors', 'Vector vs Bitmap Graphics Representation']
      },
      {
        id: 'th-4',
        title: 'Networking Architectures & Protocols',
        level: 'Exam Spec',
        estimatedHours: 22,
        description: 'Packet switching, routing algorithms, TCP/IP stack vs OSI model, DNS/DHCP operation, and network security topologies.',
        topics: ['OSI 7-Layer vs TCP/IP 4-Layer', 'Packet Structure & Checksum Verification', 'Routing Algorithms (Dijkstra / Bellman-Ford)', 'Client-Server vs Peer-to-Peer Models']
      }
    ]
  }
];

// -------------------------------------------------------------
// Interactive Syntax Matcher Data
// -------------------------------------------------------------
export const SYNTAX_MATCH_PAIRS: MatchPair[] = [
  // Beginner Set
  {
    id: 'sm-1',
    concept: '[x**2 for x in nums if x % 2 == 0]',
    description: 'List Comprehension filtering evens and squaring each element',
    category: 'Syntax',
    difficulty: 'Beginner'
  },
  {
    id: 'sm-2',
    concept: 'lambda a, b: a if a > b else b',
    description: 'Anonymous inline function returning the maximum of two values',
    category: 'Syntax',
    difficulty: 'Beginner'
  },
  {
    id: 'sm-3',
    concept: 'dict(zip(keys, values))',
    description: 'Pairs two iterable sequences into a key-value dictionary',
    category: 'Data Structures',
    difficulty: 'Beginner'
  },
  {
    id: 'sm-4',
    concept: 'stack.append(val); stack.pop()',
    description: 'LIFO (Last-In, First-Out) operations using Python list methods',
    category: 'Data Structures',
    difficulty: 'Beginner'
  },
  {
    id: 'sm-5',
    concept: 'def __init__(self, name):',
    description: 'Constructor initializer called automatically on class instantiation',
    category: 'OOP',
    difficulty: 'Beginner'
  },
  {
    id: 'sm-6',
    concept: 'def search(arr, target): mid = (l + r) // 2',
    description: 'Binary Search dividing the sorted search space in O(log n) time',
    category: 'Algorithms',
    difficulty: 'Beginner'
  },

  // Intermediate Set
  {
    id: 'sm-7',
    concept: 'def count(): \n  while True: yield n',
    description: 'Generator Function producing infinite stream values via lazy evaluation',
    category: 'Syntax',
    difficulty: 'Intermediate'
  },
  {
    id: 'sm-8',
    concept: 'collections.deque(maxlen=10)',
    description: 'Double-ended queue with O(1) pops and appends from either terminus',
    category: 'Data Structures',
    difficulty: 'Intermediate'
  },
  {
    id: 'sm-9',
    concept: 'def __str__(self): return f"{self.val}"',
    description: 'Dunder method defining the human-readable string representation',
    category: 'OOP',
    difficulty: 'Intermediate'
  },
  {
    id: 'sm-10',
    concept: '@functools.lru_cache(maxsize=128)',
    description: 'Memoization decorator caching pure function outputs to optimize recursion',
    category: 'Algorithms',
    difficulty: 'Intermediate'
  },
  {
    id: 'sm-11',
    concept: 'with open("log.txt") as f:',
    description: 'Context Manager ensuring deterministic resource cleanup even on error',
    category: 'Syntax',
    difficulty: 'Intermediate'
  },
  {
    id: 'sm-12',
    concept: 'def merge(left, right): ...',
    description: 'Divide-and-Conquer merging step executing in stable O(n log n) time',
    category: 'Algorithms',
    difficulty: 'Intermediate'
  }
];

// -------------------------------------------------------------
// Mock Virtual Filesystem for Linux Terminal
// -------------------------------------------------------------
export const INITIAL_FILESYSTEM: VirtualFile = {
  name: '/',
  type: 'directory',
  permissions: 'rwxr-xr-x',
  owner: 'root',
  size: '4096',
  updatedAt: 'Oct 03 10:00',
  children: {
    'home': {
      name: 'home',
      type: 'directory',
      permissions: 'rwxr-xr-x',
      owner: 'root',
      size: '4096',
      updatedAt: 'Oct 03 10:05',
      children: {
        'student': {
          name: 'student',
          type: 'directory',
          permissions: 'rwxr-xr-x',
          owner: 'student',
          size: '4096',
          updatedAt: 'Oct 03 12:45',
          children: {
            'script.py': {
              name: 'script.py',
              type: 'file',
              permissions: 'rwxr-xr-x',
              owner: 'student',
              size: '342',
              updatedAt: 'Oct 03 14:10',
              content: `# Automated sysadmin check script
import os, sys

def check_system():
    print("[*] Shaheen Academy System Daemon v2.4")
    print("[+] Status: All microservices nominal")
    print("[+] Memory check: 78% available")
    print("[+] Active users: student")

if __name__ == "__main__":
    check_system()`
            },
            'notes.txt': {
              name: 'notes.txt',
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'student',
              size: '420',
              updatedAt: 'Oct 03 11:30',
              content: `A-Level Revision Checklist:
1. De Morgan's Law: NOT (A AND B) == (NOT A) OR (NOT B)
2. Von Neumann Bottleneck: Bus throughput limitations between CPU and Memory
3. Two's Complement: Flip all bits and add 1
4. TCP/IP Stack: Application -> Transport -> Internet -> Network Access`
            },
            'fibonacci.py': {
              name: 'fibonacci.py',
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'student',
              size: '280',
              updatedAt: 'Oct 03 09:15',
              content: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fib(8)))`
            },
            'projects': {
              name: 'projects',
              type: 'directory',
              permissions: 'rwxr-xr-x',
              owner: 'student',
              size: '4096',
              updatedAt: 'Oct 03 10:20',
              children: {
                'web_server.py': {
                  name: 'web_server.py',
                  type: 'file',
                  permissions: 'rw-r--r--',
                  owner: 'student',
                  size: '512',
                  updatedAt: 'Oct 03 10:22',
                  content: `from http.server import HTTPServer, BaseHTTPRequestHandler
print("Listening on http://localhost:8080...")`
                }
              }
            }
          }
        }
      }
    },
    'etc': {
      name: 'etc',
      type: 'directory',
      permissions: 'rwxr-xr-x',
      owner: 'root',
      size: '4096',
      updatedAt: 'Oct 01 08:00',
      children: {
        'hostname': {
          name: 'hostname',
          type: 'file',
          permissions: 'rw-r--r--',
          owner: 'root',
          size: '12',
          updatedAt: 'Oct 01 08:00',
          content: 'shaheenacademy'
        },
        'os-release': {
          name: 'os-release',
          type: 'file',
          permissions: 'rw-r--r--',
          owner: 'root',
          size: '154',
          updatedAt: 'Oct 01 08:00',
          content: `NAME="ShaheenOS Educational Linux"
VERSION="24.04 LTS"
ID=shaheenos
PRETTY_NAME="ShaheenOS 24.04 (Noble Shaheen)"`
        }
      }
    },
    'var': {
      name: 'var',
      type: 'directory',
      permissions: 'rwxr-xr-x',
      owner: 'root',
      size: '4096',
      updatedAt: 'Oct 01 08:00',
      children: {
        'log': {
          name: 'log',
          type: 'directory',
          permissions: 'rwxr-xr-x',
          owner: 'root',
          size: '4096',
          updatedAt: 'Oct 03 14:00',
          children: {
            'syslog': {
              name: 'syslog',
              type: 'file',
              permissions: 'rw-r-----',
              owner: 'root',
              size: '890',
              updatedAt: 'Oct 03 14:00',
              content: `Oct 03 12:00:01 shaheenacademy systemd[1]: Started Daily apt upgrade.
Oct 03 12:15:33 shaheenacademy sshd[4401]: Accepted publickey for student from 192.168.1.100 port 52210
Oct 03 12:45:00 shaheenacademy kernel: [    0.000000] Linux version 6.8.0-shaheen (gcc version 13.2.0)`
            }
          }
        }
      }
    }
  }
};

// -------------------------------------------------------------
// A-Level CS Theory Quiz Data
// -------------------------------------------------------------
export const ALEVEL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    topic: 'Boolean Algebra',
    examBoard: 'OCR',
    question: 'According to De Morgan\'s Second Law, which expression is mathematically equivalent to ¬(A ∨ B)?',
    options: [
      '¬A ∧ ¬B',
      '¬A ∨ ¬B',
      'A ∧ B',
      '¬(A ∧ B)'
    ],
    correctIndex: 0,
    explanation: 'De Morgan’s Second Law states that the negation of a disjunction is equivalent to the conjunction of the negations: NOT (A OR B) ≡ (NOT A) AND (NOT B). Break the line, change the sign.',
    formulaOrRule: '¬(A ∨ B) ≡ ¬A ∧ ¬B'
  },
  {
    id: 'q-2',
    topic: 'Processors & Architecture',
    examBoard: 'AQA',
    question: 'During the Fetch stage of the Fetch-Decode-Execute (F-D-E) cycle, what is the precise role of the Memory Address Register (MAR)?',
    options: [
      'It stores the instruction being decoded by the control unit',
      'It holds the memory address of the next instruction or data word to be fetched from RAM',
      'It tracks the sequential number of instructions executed since boot',
      'It stores intermediate arithmetic results computed by the ALU'
    ],
    correctIndex: 1,
    explanation: 'The MAR holds the RAM address of the instruction or data to be fetched. The address from the Program Counter (PC) is copied into the MAR, which is then placed onto the Address Bus.',
    formulaOrRule: 'Micro-step: MAR ← [PC]'
  },
  {
    id: 'q-3',
    topic: 'Data Representation',
    examBoard: 'OCR',
    question: 'What is the denary (base 10) value of the 8-bit Two\'s Complement binary integer 11110101?',
    options: [
      '-11',
      '-245',
      '-13',
      '245'
    ],
    correctIndex: 0,
    explanation: 'In 8-bit two\'s complement, the most significant bit (MSB) has a weight of -128. Calculation: -128 + 64 + 32 + 16 + 0 + 4 + 0 + 1 = -128 + 117 = -11. Alternatively: Invert all bits (00001010 = 10) and add 1 gives 11, so -11.',
    formulaOrRule: '-128 + 64 + 32 + 16 + 4 + 1 = -11'
  },
  {
    id: 'q-4',
    topic: 'Networking Architectures',
    examBoard: 'Cambridge 9618',
    question: 'At which layer of the 4-layer TCP/IP model does the Transmission Control Protocol (TCP) operate to guarantee packet delivery and flow control?',
    options: [
      'Application Layer',
      'Internet / Network Layer',
      'Transport Layer',
      'Link / Network Access Layer'
    ],
    correctIndex: 2,
    explanation: 'TCP operates at the Transport Layer (Layer 3 in TCP/IP 4-layer stack, Layer 4 in OSI). It provides end-to-end reliability, sequence numbers, acknowledgements, and three-way handshake connection management.',
    formulaOrRule: 'TCP/IP: Application → Transport → Internet → Network Access'
  },
  {
    id: 'q-5',
    topic: 'Processors & Architecture',
    examBoard: 'Universal',
    question: 'Which architectural bottleneck describes the idle CPU cycles caused by the difference in throughput between the high-speed processor core and comparatively slower main memory (RAM)?',
    options: [
      'The Turing Limit',
      'The Von Neumann Bottleneck',
      'The Amdahl Ceiling',
      'The Harvard Cache Stall'
    ],
    correctIndex: 1,
    explanation: 'The Von Neumann Bottleneck refers to the throughput limitation between the CPU and memory caused by sharing a single physical system bus for both data and instructions.',
    formulaOrRule: 'Shared Address/Data Bus constraint in Von Neumann systems'
  },
  {
    id: 'q-6',
    topic: 'Boolean Algebra',
    examBoard: 'AQA',
    question: 'Simplify the Boolean algebraic expression: A ∧ (A ∨ B)',
    options: [
      'A ∨ B',
      'A',
      'B',
      '1 (True)'
    ],
    correctIndex: 1,
    explanation: 'Using the Absorption Law: A ∧ (A ∨ B) = (A ∧ A) ∨ (A ∧ B) = A ∨ (A ∧ B) = A ∧ (1 ∨ B) = A ∧ 1 = A.',
    formulaOrRule: 'Absorption Law: A ∧ (A ∨ B) ≡ A'
  },
  {
    id: 'q-7',
    topic: 'Data Representation',
    examBoard: 'OCR',
    question: 'A floating-point representation uses a 5-bit two\'s complement mantissa and a 3-bit two\'s complement exponent. What happens if a calculation produces a value too close to zero to be accurately stored?',
    options: [
      'Arithmetic Overflow',
      'Arithmetic Underflow',
      'Parity Failure',
      'Mantissa Normalization Error'
    ],
    correctIndex: 1,
    explanation: 'Arithmetic Underflow occurs when an absolute numeric value is smaller than the minimum representable positive non-zero quantity permitted by the exponent and mantissa precision bits.',
    formulaOrRule: 'Value < Minimum positive representable float'
  },
  {
    id: 'q-8',
    topic: 'Networking Architectures',
    examBoard: 'Cambridge 9618',
    question: 'In packet switching networks, what information is placed inside the IP packet header to prevent a lost packet from circulating endlessly through routing loops?',
    options: [
      'Checksum (CRC-32)',
      'Time to Live (TTL) / Hop Limit',
      'Window Size Offset',
      'MAC Address Broadcast Flag'
    ],
    correctIndex: 1,
    explanation: 'The Time to Live (TTL) field in IPv4 (or Hop Limit in IPv6) is decremented by 1 at every router hop. When the TTL reaches 0, the packet is discarded and an ICMP Time Exceeded message is returned.',
    formulaOrRule: 'TTL decrement: TTL = TTL - 1 until TTL == 0'
  }
];

// -------------------------------------------------------------
// Resource Library Items
// -------------------------------------------------------------
export const RESOURCE_ITEMS: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Python 3.12 Comprehensive Quick Reference',
    track: 'python',
    type: 'Cheat Sheet',
    description: 'Two-page dense reference covering Python built-ins, comprehensions, slicing patterns, dunder methods, and time complexity bounds.',
    fileFormat: 'PDF / Markdown',
    fileSize: '420 KB',
    contentPreview: `# Python 3.12 Core Syntax Reference
- Comprehensions: [expr for item in iter if cond]
- Dict unpacking: merged = {**dict_a, **dict_b}
- Walrus Operator: while (line := file.readline()): ...
- Collections: deque(O(1) popleft), Counter, defaultdict(list)
- Dunders: __init__, __str__, __repr__, __len__, __getitem__, __enter__, __exit__`,
    downloadPayload: `SHAHEEN ACADEMY PYTHON 3.12 QUICK REFERENCE
=======================================
1. LIST & DICT SLICING:
   arr[start:stop:step]
   arr[::-1] # Reverse list in O(n)
   arr[2:8:2] # Every second item between index 2 and 7

2. TIME COMPLEXITIES (CPython):
   - list.append(): O(1) amortized
   - list.pop(0): O(n) -> Use collections.deque for O(1)
   - dict lookup: O(1) average, O(n) worst-case collision
   - set.intersection(): O(min(len(s), len(t)))

3. OBJECT ORIENTED DUNDERS:
   class Matrix:
       def __init__(self, data): self.data = data
       def __repr__(self): return f"Matrix({self.data})"
       def __add__(self, other): return Matrix([...])`,
    tags: ['Python', 'Cheat Sheet', 'Algorithms', 'Syntax'],
    dateAdded: '2026-09-15'
  },
  {
    id: 'res-2',
    title: 'Linux CLI & SysAdmin Survival Guide',
    track: 'linux',
    type: 'Cheat Sheet',
    description: 'Essential terminal commands: Octal permissions reference, regex grep patterns, systemctl commands, and pipe pipelines.',
    fileFormat: 'PDF / Bash',
    fileSize: '380 KB',
    contentPreview: `# Linux CLI Quick Reference
- Permissions: chmod 755 (rwxr-xr-x), chmod 644 (rw-r--r--)
- Pipes: cmd1 | grep pattern | awk '{print $2}' | sort | uniq -c
- Process: ps aux | grep python, kill -9 <PID>, htop
- Network: ss -tulpn, curl -Iv https://example.com, ping -c 4`,
    downloadPayload: `SHAHEEN ACADEMY LINUX CLI CHEAT SHEET
=================================
1. PERMISSIONS BITMASK:
   r=4, w=2, x=1
   7 = rwx (Read, Write, Execute)
   6 = rw- (Read, Write)
   5 = r-x (Read, Execute)
   4 = r-- (Read Only)
   Example: chmod 755 app.sh (Owner: rwx, Group: r-x, Other: r-x)

2. PIPELINES & REDIRECTS:
   cmd > file.txt      # Overwrite stdout
   cmd >> file.txt     # Append stdout
   cmd 2>&1            # Redirect stderr to stdout
   cmd1 | cmd2         # Connect stdout of cmd1 to stdin of cmd2

3. PROCESS MANAGEMENT:
   kill -15 <PID>      # SIGTERM (Graceful shutdown)
   kill -9 <PID>       # SIGKILL (Forced kill)`,
    tags: ['Linux', 'CLI', 'Bash', 'SysAdmin'],
    dateAdded: '2026-09-20'
  },
  {
    id: 'res-3',
    title: 'A-Level Computer Science Logic & Architecture Formula Card',
    track: 'theory',
    type: 'Cheat Sheet',
    description: 'High-density revision card featuring Boolean theorems, Karnaugh map adjacency rules, register transfer notation, and network layer comparisons.',
    fileFormat: 'PDF / LaTeX',
    fileSize: '512 KB',
    contentPreview: `# A-Level CS Theory Revision Formulas
- De Morgan: !(A . B) = !A + !B ; !(A + B) = !A . !B
- Absorption: A . (A + B) = A ; A + (A . B) = A
- Register Transfers: MAR <- [PC], PC <- [PC] + 1, MDR <- [[MAR]], CIR <- [MDR]
- TCP/IP Stack: Application -> Transport -> Internet -> Link`,
    downloadPayload: `SHAHEEN ACADEMY A-LEVEL CS THEORY FORMULA SHEET
===========================================
1. BOOLEAN IDENTITIES:
   - Annulment: A . 0 = 0 | A + 1 = 1
   - Identity:  A . 1 = A | A + 0 = A
   - Idempotent: A . A = A | A + A = A
   - Complement: A . !A = 0 | A + !A = 1
   - Involution: !(!A) = A
   - De Morgan: !(A + B) = !A . !B | !(A . B) = !A + !B

2. FETCH-DECODE-EXECUTE REGISTER TRANSFERS:
   1. MAR <- [PC]
   2. PC <- [PC] + 1
   3. MDR <- [[MAR]]
   4. CIR <- [MDR]
   5. [CIR] decoded by Control Unit
   6. Executed (ALU / Memory write / Branch)`,
    tags: ['A-Level', 'Theory', 'Boolean Algebra', 'Architecture'],
    dateAdded: '2026-09-28'
  },
  {
    id: 'res-4',
    title: 'OCR Paper 1 Style Mock Exam & Marking Scheme',
    track: 'theory',
    type: 'Past Paper',
    description: 'Authentic 75-mark practice examination covering Computer Systems (Components, Data Representation, Networks, Legal/Ethics) with mark allocation breakdown.',
    fileFormat: 'PDF',
    fileSize: '1.2 MB',
    contentPreview: `# Mock Exam: Computer Systems (Paper 1 Practice)
Section A: Short Answer & Calculations (25 marks)
- Q1: Convert -43 to 8-bit Two's Complement. [2]
- Q2: Compare CISC and RISC architecture on code density and pipeline efficiency. [6]
Section B: Extended Theory & Algorithms (50 marks)`,
    downloadPayload: `SHAHEEN ACADEMY OCR A-LEVEL CS PRACTICE PAPER
=========================================
Total Marks: 75 | Time Allowed: 2 Hours 30 Mins

QUESTION 1 (Data Representation - 4 marks)
(a) Convert the denary integer -54 into an 8-bit Two's Complement binary number. [2]
    MARK SCHEME:
    - Positive 54 = 00110110 (1 mark)
    - Invert and add 1 = 11001010 (1 mark)

QUESTION 2 (Processors - 6 marks)
(a) Explain why pipelining may stall when executing conditional branching instructions. [3]
    MARK SCHEME:
    - Instructions in pipeline are prefetched sequentially.
    - If branch condition is met, target address changes non-sequentially.
    - Prefetched instructions must be flushed/discarded, causing delay cycles.`,
    tags: ['Exam Paper', 'OCR', 'Practice Exam', 'Mark Scheme'],
    dateAdded: '2026-10-01'
  },
  {
    id: 'res-5',
    title: 'Binary Search Tree & Traversal Implementation',
    track: 'python',
    type: 'Code Snippet',
    description: 'Clean, type-annotated Python implementation of a Binary Search Tree with In-Order, Pre-Order, and Post-Order traversal algorithms.',
    fileFormat: 'Python (.py)',
    fileSize: '12 KB',
    contentPreview: `class TreeNode:
    def __init__(self, val: int):
        self.val = val
        self.left: TreeNode | None = None
        self.right: TreeNode | None = None

class BST:
    def insert(self, val: int) -> None: ...
    def inorder(self) -> list[int]: ...`,
    downloadPayload: `from __future__ import annotations
from dataclasses import dataclass
from typing import Optional, Generator

@dataclass
class TreeNode:
    val: int
    left: Optional[TreeNode] = None
    right: Optional[TreeNode] = None

class BinarySearchTree:
    def __init__(self) -> None:
        self.root: Optional[TreeNode] = None

    def insert(self, val: int) -> None:
        if not self.root:
            self.root = TreeNode(val)
            return
        
        curr = self.root
        while True:
            if val < curr.val:
                if curr.left is None:
                    curr.left = TreeNode(val)
                    break
                curr = curr.left
            else:
                if curr.right is None:
                    curr.right = TreeNode(val)
                    break
                curr = curr.right

    def inorder(self, node: Optional[TreeNode] = None) -> Generator[int, None, None]:
        if node is None:
            node = self.root
        if node.left:
            yield from self.inorder(node.left)
        yield node.val
        if node.right:
            yield from self.inorder(node.right)

# Test run
if __name__ == "__main__":
    tree = BinarySearchTree()
    for num in [50, 30, 70, 20, 40, 60, 80]:
        tree.insert(num)
    print("In-order BST (Sorted):", list(tree.inorder()))`,
    tags: ['Python', 'Code Snippet', 'Trees', 'Data Structures'],
    dateAdded: '2026-10-02'
  },
  {
    id: 'res-6',
    title: 'Automated Log Parser & Threat Analyzer Pipeline',
    track: 'linux',
    type: 'Code Snippet',
    description: 'Production bash script parsing web server access logs to identify suspicious 404 scans and brute-force attempts using awk and sort.',
    fileFormat: 'Bash (.sh)',
    fileSize: '8 KB',
    contentPreview: `#!/usr/bin/env bash
set -euo pipefail
# Analyze access.log for top 10 offending IPs
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10`,
    downloadPayload: `#!/usr/bin/env bash
# ==============================================================================
# Shaheen Academy SysAdmin Toolkit: Web Server Log Analyzer
# Analyzes standard Nginx/Apache access log for suspicious high-frequency hits.
# ==============================================================================
set -euo pipefail

LOG_FILE="\${1:-/var/log/nginx/access.log}"

if [[ ! -f "$LOG_FILE" ]]; then
    echo "[!] Error: Log file '$LOG_FILE' not found." >&2
    exit 1
fi

echo "=========================================================="
echo " TOP 10 VISITING IP ADDRESSES"
echo "=========================================================="
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -nr | head -n 10

echo ""
echo "=========================================================="
echo " TOP 404 NOT FOUND REQUEST TARGETS (POTENTIAL SCANS)"
echo "=========================================================="
awk '($9 ~ /404/) {print $7}' "$LOG_FILE" | sort | uniq -c | sort -nr | head -n 10`,
    tags: ['Linux', 'Bash', 'Security', 'Code Snippet'],
    dateAdded: '2026-10-03'
  }
];
