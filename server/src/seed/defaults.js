function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 0, 0);
  return d;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function extractLocation(schedule) {
  const match = schedule.match(/·\s*(.+)$/);
  return match?.[1]?.trim() || "TBD";
}

const CS_PROFS = [
  { name: "Dr. James Miller",    email: "j.miller" },
  { name: "Prof. Lisa Park",     email: "l.park" },
  { name: "Dr. Kevin Zhang",     email: "k.zhang" },
  { name: "Prof. Sarah O'Brien", email: "s.obrien" },
  { name: "Dr. Marcus Reid",     email: "m.reid" },
  { name: "Prof. Aisha Patel",   email: "a.patel" },
];

const MATH_PROFS = [
  { name: "Dr. Elena Vasquez",   email: "e.vasquez" },
  { name: "Prof. David Okafor",  email: "d.okafor" },
  { name: "Dr. Priya Sharma",    email: "p.sharma" },
  { name: "Prof. Alex Turner",   email: "a.turner" },
  { name: "Dr. Jessica Wu",      email: "j.wu" },
  { name: "Prof. Omar Hassan",   email: "o.hassan" },
];

const HIST_PROFS = [
  { name: "Prof. Thomas Nguyen", email: "t.nguyen" },
  { name: "Dr. Maria Santos",    email: "m.santos" },
  { name: "Prof. Robert Kim",    email: "r.kim" },
  { name: "Dr. Amara Williams",  email: "a.williams" },
  { name: "Prof. Charles Moore", email: "c.moore" },
  { name: "Dr. Fatima Al-Rashid", email: "f.alrashid" },
];

const PHYS_PROFS = [
  { name: "Dr. Raymond Chen",    email: "r.chen" },
  { name: "Prof. Naomi Fischer", email: "n.fischer" },
  { name: "Dr. Carlos Rivera",   email: "c.rivera" },
  { name: "Prof. Hannah Lee",    email: "h.lee" },
  { name: "Dr. Benjamin Scott",  email: "b.scott" },
  { name: "Prof. Yuki Tanaka",   email: "y.tanaka" },
];

const EE_PROFS = [
  { name: "Dr. Samuel Park",     email: "s.park" },
  { name: "Prof. Nina Kovacs",   email: "n.kovacs" },
  { name: "Dr. Wei Chen",        email: "w.chen" },
  { name: "Prof. Laura Diaz",    email: "l.diaz" },
];

const PSYCH_PROFS = [
  { name: "Prof. Rachel Green",  email: "r.green" },
  { name: "Dr. Michael Torres",  email: "m.torres" },
  { name: "Prof. Keiko Yamada",  email: "k.yamada" },
  { name: "Dr. James Osei",      email: "j.osei" },
];

const ECON_PROFS = [
  { name: "Dr. Patricia Lam",    email: "p.lam" },
  { name: "Prof. Ahmed Khalil",  email: "a.khalil" },
  { name: "Dr. Claudia Rossi",   email: "c.rossi" },
  { name: "Prof. Henry Brooks",  email: "h.brooks" },
];

const SOCIOL_PROFS = [
  { name: "Dr. Sandra Washington", email: "s.washington" },
  { name: "Prof. Dmitri Volkov",   email: "d.volkov" },
  { name: "Dr. Nadia Hassan",      email: "n.hassan" },
  { name: "Prof. Jerome Bailey",   email: "j.bailey" },
];

const CS_SCHEDULES = [
  "MWF 9:00–9:50 AM · Engineering Hall 100",
  "MWF 10:00–10:50 AM · Boelter Hall 3400",
  "MWF 11:00–11:50 AM · Engineering Hall 200",
  "TuTh 9:00–10:15 AM · Engineering Hall 300",
  "TuTh 2:00–3:15 PM · Boelter Hall 2444",
];

const MATH_SCHEDULES = [
  "MWF 8:00–8:50 AM · Math Sciences 100",
  "TuTh 11:00 AM–12:15 PM · Math Building 105",
  "MWF 1:00–1:50 PM · Math Sciences 200",
  "TuTh 2:00–3:15 PM · Math Building 110",
  "MWF 3:00–3:50 PM · Math Sciences 120",
];

const HIST_SCHEDULES = [
  "TuTh 9:30–10:45 AM · Humanities Hall 100",
  "MWF 10:00–10:50 AM · Humanities Hall 220",
  "TuTh 11:00 AM–12:15 PM · Bunche Hall 3153",
  "MWF 2:00–2:50 PM · Humanities Hall 150",
  "TuTh 3:30–4:45 PM · Royce Hall 156",
];

const PHYS_SCHEDULES = [
  "MWF 8:00–8:50 AM · Physics Building 1001",
  "MWF 9:00–9:50 AM · Science Center 140",
  "TuTh 9:30–10:45 AM · Knudsen Hall 1200",
  "MWF 1:00–1:50 PM · Physics Building 1002",
  "TuTh 2:00–3:15 PM · Science Center 120",
];

const EE_SCHEDULES = [
  "MWF 9:00–9:50 AM · Engineering IV 68-111",
  "TuTh 10:00–11:15 AM · Engineering IV 69-130",
  "MWF 1:00–1:50 PM · Boelter Hall 4413",
  "TuTh 2:00–3:15 PM · Engineering IV 68-112",
];

const PSYCH_SCHEDULES = [
  "TuTh 9:30–10:45 AM · Franz Hall 1260",
  "MWF 10:00–10:50 AM · Royce Hall 362",
  "TuTh 2:00–3:15 PM · Franz Hall 2258A",
  "MWF 3:00–3:50 PM · Humanities Hall 136",
];

const ECON_SCHEDULES = [
  "MWF 9:00–9:50 AM · Bunche Hall 2150",
  "TuTh 11:00 AM–12:15 PM · Dodd Hall 161",
  "MWF 1:00–1:50 PM · Bunche Hall 3157",
  "TuTh 3:30–4:45 PM · Dodd Hall 175",
];

const SOCIOL_SCHEDULES = [
  "TuTh 9:30–10:45 AM · Haines Hall 220",
  "MWF 11:00–11:50 AM · Bunche Hall 3157",
  "TuTh 2:00–3:15 PM · Haines Hall 110",
  "MWF 2:00–2:50 PM · Royce Hall 156",
];

const csProf     = pick(CS_PROFS);
const mathProf   = pick(MATH_PROFS);
const histProf   = pick(HIST_PROFS);
const physProf   = pick(PHYS_PROFS);
const eeProf     = pick(EE_PROFS);
const cs2Prof    = pick(CS_PROFS.filter(p => p.email !== csProf.email));
const math2Prof  = pick(MATH_PROFS.filter(p => p.email !== mathProf.email));
const psychProf  = pick(PSYCH_PROFS);
const econProf   = pick(ECON_PROFS);
const sociolProf = pick(SOCIOL_PROFS);

const csSched    = pick(CS_SCHEDULES);
const mathSched  = pick(MATH_SCHEDULES);
const histSched  = pick(HIST_SCHEDULES);
const physSched  = pick(PHYS_SCHEDULES);
const eeSched    = pick(EE_SCHEDULES);
const cs2Sched   = pick(CS_SCHEDULES.filter(s => s !== csSched));
const math2Sched = pick(MATH_SCHEDULES.filter(s => s !== mathSched));
const psychSched = pick(PSYCH_SCHEDULES);
const econSched  = pick(ECON_SCHEDULES);
const sociolSched = pick(SOCIOL_SCHEDULES);

const DEFAULT_GRADING_SCHEME = { homework: 20, quiz: 20, exam: 50, project: 10, reading: 0 };

const STEM_COURSES = [
  {
    code: "CS101",
    title: "Intro to Computer Science",
    color: "#6366f1",
    term: "Spring 2026",
    instructor: csProf.name,
    instructorEmail: `${csProf.email}@university.edu`,
    schedule: csSched,
    location: extractLocation(csSched),
    description:
      "Introduction to programming and problem solving in C++. Topics include data types, control flow, functions, arrays, strings, pointers, structs, and classes. Students complete weekly homework and two exams. No prior programming experience required.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "CS180",
    title: "Data Structures and Algorithms",
    color: "#8b5cf6",
    term: "Spring 2026",
    instructor: cs2Prof.name,
    instructorEmail: `${cs2Prof.email}@university.edu`,
    schedule: cs2Sched,
    location: extractLocation(cs2Sched),
    description:
      "Fundamental data structures including arrays, linked lists, stacks, queues, trees, heaps, and hash tables. Algorithm design and analysis using Big-O notation. Sorting, searching, graph traversal, and dynamic programming. Prerequisites: introductory programming.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "MATH201",
    title: "Discrete Structures",
    color: "#22c55e",
    term: "Spring 2026",
    instructor: mathProf.name,
    instructorEmail: `${mathProf.email}@university.edu`,
    schedule: mathSched,
    location: extractLocation(mathSched),
    description:
      "Introduction to discrete mathematics for computer scientists. Topics include propositional logic, proof techniques, set theory, functions, combinatorics, graph theory, and algorithms. Weekly problem sets and two exams.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "MATH31A",
    title: "Differential Calculus",
    color: "#14b8a6",
    term: "Spring 2026",
    instructor: math2Prof.name,
    instructorEmail: `${math2Prof.email}@university.edu`,
    schedule: math2Sched,
    location: extractLocation(math2Sched),
    description:
      "Limits, derivatives, and their applications. Covers the definition of a derivative, differentiation rules, chain rule, implicit differentiation, related rates, curve sketching, and optimization. Designed for students in STEM fields.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "PHYS150",
    title: "Physics: Mechanics",
    color: "#ef4444",
    term: "Spring 2026",
    instructor: physProf.name,
    instructorEmail: `${physProf.email}@university.edu`,
    schedule: physSched,
    location: extractLocation(physSched),
    description:
      "Introductory physics with calculus, covering classical mechanics. Topics include kinematics, Newton's laws, work and energy, momentum, rotational motion, and gravitation. Weekly homework sets and laboratory sections.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "EE115",
    title: "Digital Logic Design",
    color: "#f97316",
    term: "Spring 2026",
    instructor: eeProf.name,
    instructorEmail: `${eeProf.email}@university.edu`,
    schedule: eeSched,
    location: extractLocation(eeSched),
    description:
      "Boolean algebra, combinational and sequential circuit design, logic minimization, flip-flops, registers, counters, and finite state machines. Laboratory sections use FPGAs to implement and test digital designs.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
];

const GE_COURSES = [
  {
    code: "HIST110",
    title: "World History",
    color: "#f59e0b",
    term: "Spring 2026",
    instructor: histProf.name,
    instructorEmail: `${histProf.email}@university.edu`,
    schedule: histSched,
    location: extractLocation(histSched),
    description:
      "Survey of world history from ancient civilizations to the modern era. Covers major empires, social transformations, industrialization, colonialism, and 20th-century global events. Students write analytical essays and complete reading responses.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "PSYCH100",
    title: "Introduction to Psychology",
    color: "#ec4899",
    term: "Spring 2026",
    instructor: psychProf.name,
    instructorEmail: `${psychProf.email}@university.edu`,
    schedule: psychSched,
    location: extractLocation(psychSched),
    description:
      "Survey of psychological science. Topics include biological bases of behavior, sensation and perception, learning, memory, cognition, development, personality, social behavior, psychological disorders, and treatment approaches.",
    gradingScheme: { homework: 10, quiz: 20, exam: 55, project: 5, reading: 10 },
  },
  {
    code: "ECON101",
    title: "Principles of Microeconomics",
    color: "#0ea5e9",
    term: "Spring 2026",
    instructor: econProf.name,
    instructorEmail: `${econProf.email}@university.edu`,
    schedule: econSched,
    location: extractLocation(econSched),
    description:
      "Introduction to microeconomic theory. Supply and demand, consumer behavior, production and costs, market structures (perfect competition, monopoly, oligopoly), factor markets, market failures, and welfare economics.",
    gradingScheme: DEFAULT_GRADING_SCHEME,
  },
  {
    code: "SOCIOL1",
    title: "Introduction to Sociology",
    color: "#84cc16",
    term: "Spring 2026",
    instructor: sociolProf.name,
    instructorEmail: `${sociolProf.email}@university.edu`,
    schedule: sociolSched,
    location: extractLocation(sociolSched),
    description:
      "Foundations of sociological thinking. Culture, socialization, social structure, stratification, race and ethnicity, gender, family, religion, deviance, and social change. Emphasizes applying sociological imagination to everyday life.",
    gradingScheme: { homework: 10, quiz: 15, exam: 45, project: 15, reading: 15 },
  },
];

const ASSIGNMENTS_BY_COURSE = {
  CS101: [
    {
      seedKey: "cs31-hw1",
      title: "HW1: Setting Up Your C++ Environment",
      description:
        "Install g++, VS Code, and the course starter files. Write a Hello World program, compile from the terminal, and submit a screenshot plus your .cpp file.",
      type: "homework",
      dueDate: daysFromNow(-28),
      maxScore: 20,
    },
    {
      seedKey: "cs31-hw2",
      title: "HW2: Variables, Types, and Operators",
      description:
        "Practice declaring variables of different types (int, double, string, bool). Write programs that perform arithmetic, string concatenation, and type casting.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 20,
    },
    {
      seedKey: "cs31-hw3",
      title: "HW3: Conditionals and Input Validation",
      description:
        "Write a program that reads user input and uses if/else chains and switch statements to validate and classify it. Handle edge cases like negative numbers and empty strings.",
      type: "homework",
      dueDate: daysFromNow(-14),
      maxScore: 20,
    },
    {
      seedKey: "cs31-quiz1",
      title: "Quiz 1: C++ Fundamentals",
      description:
        "In-class quiz covering variables, data types, operators, conditionals, and basic loops. Closed book. Bring your student ID.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 50,
    },
    {
      seedKey: "cs31-hw4",
      title: "HW4: Functions and Scope",
      description:
        "Decompose a complex task into multiple functions. Practice pass-by-value vs pass-by-reference, return types, and variable scope rules.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 20,
    },
    {
      seedKey: "cs31-hw5",
      title: "HW5: Arrays and Strings",
      description:
        "Implement functions that manipulate arrays and C++ strings: sorting, searching, reversing, and counting character frequencies.",
      type: "homework",
      dueDate: daysFromNow(7),
      maxScore: 20,
    },
    {
      seedKey: "cs31-midterm",
      title: "Midterm Exam",
      description:
        "Covers all material through Week 5: variables, control flow, functions, arrays, and strings. Closed book, 80 minutes. Bring a #2 pencil.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "cs31-project1",
      title: "Project: Number Guessing Game",
      description:
        "Build a complete C++ guessing game. The computer picks a random number; the user guesses until they get it right. Track guess count, validate input, and add a play-again loop.",
      type: "project",
      dueDate: daysFromNow(14),
      maxScore: 50,
    },
    {
      seedKey: "cs31-hw6",
      title: "HW6: Pointers and Dynamic Memory",
      description:
        "Declare, dereference, and pass pointers. Allocate arrays with new/delete. Write a function that dynamically resizes an array.",
      type: "homework",
      dueDate: daysFromNow(18),
      maxScore: 20,
    },
    {
      seedKey: "cs31-quiz2",
      title: "Quiz 2: Pointers and Memory",
      description:
        "In-class quiz on pointer arithmetic, dynamic allocation, and memory management. Watch out for off-by-one errors!",
      type: "quiz",
      dueDate: daysFromNow(21),
      maxScore: 50,
    },
    {
      seedKey: "cs31-hw7",
      title: "HW7: Classes and Objects",
      description:
        "Design and implement a BankAccount class with member variables, constructors, getters/setters, and methods for deposit, withdraw, and balance inquiry.",
      type: "homework",
      dueDate: daysFromNow(28),
      maxScore: 20,
    },
    {
      seedKey: "cs31-final",
      title: "Final Exam",
      description:
        "Comprehensive final covering the entire course. Extra emphasis on pointers, classes, and inheritance. Closed book, 3 hours. Bring student ID.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  CS180: [
    {
      seedKey: "cs180-hw1",
      title: "HW1: Arrays and Linked Lists",
      description:
        "Implement a singly linked list from scratch with insert, delete, and search operations. Analyze time complexity for each operation. Compare to array-based alternatives.",
      type: "homework",
      dueDate: daysFromNow(-28),
      maxScore: 30,
    },
    {
      seedKey: "cs180-hw2",
      title: "HW2: Stacks, Queues, and Deques",
      description:
        "Implement a stack using a linked list and a queue using two stacks. Solve bracket-matching and expression evaluation problems.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 30,
    },
    {
      seedKey: "cs180-hw3",
      title: "HW3: Binary Trees and BSTs",
      description:
        "Implement a binary search tree with insert, delete, and all three traversal orders. Write iterative and recursive versions. Analyze height and balance.",
      type: "homework",
      dueDate: daysFromNow(-14),
      maxScore: 30,
    },
    {
      seedKey: "cs180-quiz1",
      title: "Quiz 1: Linear Structures and Trees",
      description:
        "In-class quiz on linked lists, stacks, queues, and binary trees. 45 minutes, closed book.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 50,
    },
    {
      seedKey: "cs180-midterm",
      title: "Midterm Exam",
      description:
        "Covers arrays, linked lists, stacks, queues, trees, and introductory Big-O analysis. Closed book, 90 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "cs180-project1",
      title: "Project: Implement a HashMap",
      description:
        "Build a hash map using separate chaining. Implement put, get, remove, and resize. Test with large datasets and measure load factor impact on performance.",
      type: "project",
      dueDate: daysFromNow(14),
      maxScore: 60,
    },
    {
      seedKey: "cs180-hw4",
      title: "HW4: Graphs and BFS/DFS",
      description:
        "Represent a graph with adjacency lists and adjacency matrices. Implement breadth-first search and depth-first search. Find connected components.",
      type: "homework",
      dueDate: daysFromNow(21),
      maxScore: 30,
    },
    {
      seedKey: "cs180-quiz2",
      title: "Quiz 2: Heaps and Sorting",
      description:
        "Quiz on heapsort, mergesort, quicksort, and priority queues. Analyze average and worst-case time complexity.",
      type: "quiz",
      dueDate: daysFromNow(25),
      maxScore: 50,
    },
    {
      seedKey: "cs180-final",
      title: "Final Exam",
      description:
        "Comprehensive final. Extra emphasis on graphs, sorting, and dynamic programming. Closed book, 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  MATH201: [
    {
      seedKey: "math61-hw1",
      title: "Problem Set 1: Logic and Propositions",
      description:
        "Truth tables, logical equivalence, De Morgan's laws, and translating English sentences into propositional logic. 12 problems.",
      type: "homework",
      dueDate: daysFromNow(-28),
      maxScore: 50,
    },
    {
      seedKey: "math61-hw2",
      title: "Problem Set 2: Proof Techniques",
      description:
        "Practice direct proofs, proof by contrapositive, and proof by contradiction. Write clean, rigorous mathematical arguments.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 50,
    },
    {
      seedKey: "math61-hw3",
      title: "Problem Set 3: Sets and Functions",
      description:
        "Set notation, Venn diagrams, power sets, Cartesian products, injections, surjections, and bijections.",
      type: "homework",
      dueDate: daysFromNow(-14),
      maxScore: 50,
    },
    {
      seedKey: "math61-quiz1",
      title: "Quiz 1: Logic and Proofs",
      description:
        "In-class quiz covering propositional logic, predicates, and proof techniques. 30 minutes.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 40,
    },
    {
      seedKey: "math61-hw4",
      title: "Problem Set 4: Combinatorics",
      description:
        "Permutations, combinations, binomial theorem, and inclusion-exclusion principle. Word problems and counting arguments.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 50,
    },
    {
      seedKey: "math61-hw5",
      title: "Problem Set 5: Probability and Pigeonhole",
      description:
        "Basic discrete probability, expected value, and pigeonhole principle applications.",
      type: "homework",
      dueDate: daysFromNow(7),
      maxScore: 50,
    },
    {
      seedKey: "math61-midterm",
      title: "Midterm Exam",
      description:
        "Covers logic, set theory, functions, and combinatorics. Open one sheet of notes. 90 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "math61-hw6",
      title: "Problem Set 6: Graph Theory",
      description:
        "Graph representations, paths, cycles, trees, bipartite graphs, and Euler circuits. Prove properties of graphs.",
      type: "homework",
      dueDate: daysFromNow(14),
      maxScore: 50,
    },
    {
      seedKey: "math61-quiz2",
      title: "Quiz 2: Graphs and Trees",
      description:
        "In-class quiz on graph definitions, connectivity, trees, and spanning trees. 30 minutes.",
      type: "quiz",
      dueDate: daysFromNow(18),
      maxScore: 40,
    },
    {
      seedKey: "math61-hw7",
      title: "Problem Set 7: Number Theory",
      description:
        "Divisibility, GCD, modular arithmetic, Euclidean algorithm, and RSA encryption basics.",
      type: "homework",
      dueDate: daysFromNow(21),
      maxScore: 50,
    },
    {
      seedKey: "math61-hw8",
      title: "Problem Set 8: Algorithms and Complexity",
      description:
        "Big-O notation, sorting algorithms, recurrence relations, and basic complexity analysis.",
      type: "homework",
      dueDate: daysFromNow(28),
      maxScore: 50,
    },
    {
      seedKey: "math61-final",
      title: "Final Exam",
      description:
        "Cumulative final. Focus on graph theory, number theory, and algorithms. Open two sheets of notes. 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  MATH31A: [
    {
      seedKey: "math31a-hw1",
      title: "Problem Set 1: Limits",
      description:
        "Evaluate limits using algebraic simplification, substitution, and the squeeze theorem. Find one-sided limits and determine continuity.",
      type: "homework",
      dueDate: daysFromNow(-28),
      maxScore: 40,
    },
    {
      seedKey: "math31a-hw2",
      title: "Problem Set 2: Definition of the Derivative",
      description:
        "Use the limit definition of the derivative to differentiate basic functions. Interpret derivatives geometrically as slope of tangent lines.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 40,
    },
    {
      seedKey: "math31a-hw3",
      title: "Problem Set 3: Differentiation Rules",
      description:
        "Apply power rule, product rule, quotient rule, and chain rule. Differentiate polynomial, exponential, logarithmic, and trigonometric functions.",
      type: "homework",
      dueDate: daysFromNow(-14),
      maxScore: 40,
    },
    {
      seedKey: "math31a-quiz1",
      title: "Quiz 1: Limits and Basic Derivatives",
      description:
        "Quiz on limit laws, continuity, and basic differentiation. Closed book, calculator not permitted. 40 minutes.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 40,
    },
    {
      seedKey: "math31a-hw4",
      title: "Problem Set 4: Implicit Differentiation and Related Rates",
      description:
        "Differentiate implicitly defined functions. Set up and solve related-rates problems involving geometric shapes and motion.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 40,
    },
    {
      seedKey: "math31a-midterm",
      title: "Midterm Exam",
      description:
        "Covers limits, continuity, and all differentiation techniques through related rates. Open one note card (3x5). 90 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "math31a-hw5",
      title: "Problem Set 5: Curve Sketching and Optimization",
      description:
        "Use first and second derivatives to identify critical points, inflection points, and concavity. Sketch curves and solve applied optimization problems.",
      type: "homework",
      dueDate: daysFromNow(18),
      maxScore: 40,
    },
    {
      seedKey: "math31a-quiz2",
      title: "Quiz 2: Applications of Derivatives",
      description:
        "Quiz on L'Hopital's rule, mean value theorem, and optimization. 40 minutes.",
      type: "quiz",
      dueDate: daysFromNow(24),
      maxScore: 40,
    },
    {
      seedKey: "math31a-final",
      title: "Final Exam",
      description:
        "Comprehensive final on all course material. Extra emphasis on optimization and curve analysis. Open one sheet of notes (both sides). 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  PHYS150: [
    {
      seedKey: "phys1a-hw1",
      title: "HW1: Kinematics in One Dimension",
      description:
        "Position, velocity, acceleration. Solve 10 problems involving constant-acceleration motion using kinematics equations. Show all work.",
      type: "homework",
      dueDate: daysFromNow(-28),
      maxScore: 30,
    },
    {
      seedKey: "phys1a-lab1",
      title: "Lab 1: Free Fall and Acceleration",
      description:
        "Use a motion sensor to measure free-fall acceleration. Plot position vs time, calculate g, and compare to 9.8 m/s. Write a formal lab report.",
      type: "project",
      dueDate: daysFromNow(-21),
      maxScore: 40,
    },
    {
      seedKey: "phys1a-hw2",
      title: "HW2: Vectors and 2D Motion",
      description:
        "Vector addition, dot product, projectile motion. Solve 12 problems including projectile launch angle optimization.",
      type: "homework",
      dueDate: daysFromNow(-14),
      maxScore: 30,
    },
    {
      seedKey: "phys1a-quiz1",
      title: "Quiz 1: Kinematics and Newton's Laws",
      description:
        "In-class quiz on 1D/2D kinematics and Newton's three laws. Closed book, calculator allowed. 40 minutes.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 50,
    },
    {
      seedKey: "phys1a-hw3",
      title: "HW3: Work, Energy, and Power",
      description:
        "Work-energy theorem, conservative forces, potential energy, power. 10 problems including inclined planes and spring systems.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 30,
    },
    {
      seedKey: "phys1a-lab2",
      title: "Lab 2: Conservation of Energy",
      description:
        "Use a track and cart system to verify conservation of mechanical energy. Measure and compare KE + PE at multiple points. Full lab report required.",
      type: "project",
      dueDate: daysFromNow(7),
      maxScore: 40,
    },
    {
      seedKey: "phys1a-midterm",
      title: "Midterm Exam",
      description:
        "Covers kinematics, Newton's laws, work, and energy. Two formula sheets provided. Calculator allowed. 80 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "phys1a-hw4",
      title: "HW4: Momentum and Collisions",
      description:
        "Linear momentum, impulse, elastic and inelastic collisions. 10 problems including 2D collision problems.",
      type: "homework",
      dueDate: daysFromNow(14),
      maxScore: 30,
    },
    {
      seedKey: "phys1a-quiz2",
      title: "Quiz 2: Rotational Motion",
      description:
        "Angular velocity, angular acceleration, torque, moment of inertia. Closed book, 40 minutes.",
      type: "quiz",
      dueDate: daysFromNow(18),
      maxScore: 50,
    },
    {
      seedKey: "phys1a-lab3",
      title: "Lab 3: Rotational Equilibrium",
      description:
        "Balance a meter stick with known and unknown masses. Calculate torques and verify rotational equilibrium condition. Formal lab report.",
      type: "project",
      dueDate: daysFromNow(21),
      maxScore: 40,
    },
    {
      seedKey: "phys1a-hw5",
      title: "HW5: Gravitation and Simple Harmonic Motion",
      description:
        "Newton's law of gravitation, orbital mechanics, Hooke's law, period of a pendulum and spring-mass system. 12 problems.",
      type: "homework",
      dueDate: daysFromNow(28),
      maxScore: 30,
    },
    {
      seedKey: "phys1a-final",
      title: "Final Exam",
      description:
        "Cumulative final covering all course material. Extra emphasis on energy, momentum, and rotational motion. Four formula sheets provided. 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  EE115: [
    {
      seedKey: "ee115-lab1",
      title: "Lab 1: Logic Gates on a Breadboard",
      description:
        "Wire AND, OR, NOT, NAND, and NOR gates using 74-series ICs. Verify truth tables with a multimeter. Write a brief report comparing gate behaviors.",
      type: "project",
      dueDate: daysFromNow(-21),
      maxScore: 30,
    },
    {
      seedKey: "ee115-hw1",
      title: "HW1: Boolean Algebra and Minimization",
      description:
        "Simplify Boolean expressions using algebraic identities and Karnaugh maps (up to 4 variables). Convert between SOP and POS forms.",
      type: "homework",
      dueDate: daysFromNow(-14),
      maxScore: 30,
    },
    {
      seedKey: "ee115-quiz1",
      title: "Quiz 1: Combinational Circuits",
      description:
        "Quiz on Boolean algebra, Karnaugh maps, multiplexers, and decoders. 40 minutes, closed book.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 50,
    },
    {
      seedKey: "ee115-hw2",
      title: "HW2: Sequential Circuits and Flip-Flops",
      description:
        "Design SR, D, JK, and T flip-flops from their characteristic equations. Trace state transitions and draw timing diagrams.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 30,
    },
    {
      seedKey: "ee115-lab2",
      title: "Lab 2: Flip-Flop Implementation on FPGA",
      description:
        "Implement a 4-bit register and a 4-bit ripple-carry counter in Verilog on the DE10-Lite FPGA board. Demonstrate correct operation to the TA.",
      type: "project",
      dueDate: daysFromNow(7),
      maxScore: 40,
    },
    {
      seedKey: "ee115-midterm",
      title: "Midterm Exam",
      description:
        "Covers Boolean algebra, combinational design, and sequential circuits through D flip-flops. One formula sheet provided. Calculator not needed. 80 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "ee115-hw3",
      title: "HW3: Finite State Machines",
      description:
        "Design Mealy and Moore machines from state diagrams. Encode states and derive next-state and output logic. Minimize state tables.",
      type: "homework",
      dueDate: daysFromNow(21),
      maxScore: 30,
    },
    {
      seedKey: "ee115-final",
      title: "Final Exam",
      description:
        "Comprehensive final. Extra emphasis on FSM design, pipelining basics, and FPGA architecture. Two formula sheets provided. 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  HIST110: [
    {
      seedKey: "hist21-reading1",
      title: "Reading Response 1: Ancient Mesopotamia",
      description:
        "Read Chapter 1-2 of the textbook plus the excerpt from Hammurabi's Code. Write a 1-page response on how law shaped early civilization.",
      type: "reading",
      dueDate: daysFromNow(-28),
      maxScore: 20,
    },
    {
      seedKey: "hist21-essay1",
      title: "Essay 1: Rise of Classical Civilizations",
      description:
        "2-page analytical essay comparing the political structures of ancient Greece and Rome. Use at least two primary sources provided on the course website.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 50,
    },
    {
      seedKey: "hist21-reading2",
      title: "Reading Response 2: Medieval Europe",
      description:
        "Read Chapter 6-7 on feudalism and the Crusades. Write a 1-page response discussing the social hierarchy of medieval Europe.",
      type: "reading",
      dueDate: daysFromNow(-14),
      maxScore: 20,
    },
    {
      seedKey: "hist21-quiz1",
      title: "Quiz 1: Ancient to Medieval History",
      description:
        "Covers lectures and readings on ancient civilizations through the fall of Rome and early medieval period. 20 multiple-choice questions.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 40,
    },
    {
      seedKey: "hist21-primary-source",
      title: "Primary Source Analysis: Magna Carta",
      description:
        "Close read the 1215 Magna Carta excerpt (provided on CCLE). Identify three provisions and explain their historical significance in 500 words.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 30,
    },
    {
      seedKey: "hist21-essay2",
      title: "Essay 2: The Renaissance and Reformation",
      description:
        "2-page essay arguing for which factor most transformed European society: the Renaissance, the printing press, or the Protestant Reformation.",
      type: "homework",
      dueDate: daysFromNow(7),
      maxScore: 50,
    },
    {
      seedKey: "hist21-midterm",
      title: "Midterm Exam",
      description:
        "In-class exam: 30 multiple-choice + one essay. Covers ancient civilizations through the early modern period. Open to lecture notes only.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "hist21-paper-outline",
      title: "Research Paper Outline",
      description:
        "Submit a 1-page outline for your final research paper. Include your thesis, three main arguments, and at least 5 sources (2 must be academic journals).",
      type: "project",
      dueDate: daysFromNow(14),
      maxScore: 20,
    },
    {
      seedKey: "hist21-quiz2",
      title: "Quiz 2: Early Modern to Industrial",
      description:
        "Covers the Age of Exploration, Scientific Revolution, and early Industrial Revolution. 20 multiple-choice + 2 short answers.",
      type: "quiz",
      dueDate: daysFromNow(18),
      maxScore: 40,
    },
    {
      seedKey: "hist21-essay3",
      title: "Essay 3: Industrial Revolution Impact",
      description:
        "3-page essay on how the Industrial Revolution changed labor, class structure, and urban life in Britain and beyond. Cite at least 4 sources.",
      type: "homework",
      dueDate: daysFromNow(21),
      maxScore: 60,
    },
    {
      seedKey: "hist21-paper-draft",
      title: "Research Paper Draft",
      description:
        "Submit your full 6-8 page research paper draft. You will receive written feedback before the final submission. Proper Chicago citations required.",
      type: "project",
      dueDate: daysFromNow(28),
      maxScore: 50,
    },
    {
      seedKey: "hist21-final",
      title: "Final Exam",
      description:
        "Comprehensive final: 40 multiple-choice + two essays (one given in advance as a study question). 3 hours. Open to one page of notes.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  PSYCH100: [
    {
      seedKey: "psych100-reading1",
      title: "Reading Response 1: Research Methods",
      description:
        "Read Chapter 1-2 on scientific method and research design. Write a 1-page response explaining the difference between correlation and causation with a real-world example.",
      type: "reading",
      dueDate: daysFromNow(-28),
      maxScore: 20,
    },
    {
      seedKey: "psych100-hw1",
      title: "Assignment 1: Neuroscience and Behavior",
      description:
        "Short-answer assignment on brain regions, neurotransmitters, and their roles in behavior. Identify structures involved in memory, emotion, and motor control.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 40,
    },
    {
      seedKey: "psych100-quiz1",
      title: "Quiz 1: Biological Bases and Sensation",
      description:
        "Quiz on neurons, the nervous system, sensory processes, and perception. 25 multiple-choice questions, 30 minutes.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 40,
    },
    {
      seedKey: "psych100-reading2",
      title: "Reading Response 2: Memory and Learning",
      description:
        "Read Chapters 7-8 on classical conditioning, operant conditioning, and memory systems. Describe one real-world application of each learning principle.",
      type: "reading",
      dueDate: daysFromNow(3),
      maxScore: 20,
    },
    {
      seedKey: "psych100-essay1",
      title: "Essay: Cognitive Biases in Everyday Life",
      description:
        "2-page essay identifying two cognitive biases (e.g., confirmation bias, availability heuristic) and analyzing how they affect decision-making. Use at least one peer-reviewed source.",
      type: "homework",
      dueDate: daysFromNow(7),
      maxScore: 50,
    },
    {
      seedKey: "psych100-midterm",
      title: "Midterm Exam",
      description:
        "Covers research methods, biological bases, sensation, perception, learning, and memory. 60 multiple-choice + 2 short answer questions. 90 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "psych100-reading3",
      title: "Reading Response 3: Social Psychology",
      description:
        "Read Chapter 13 on conformity, obedience, and group dynamics. Summarize the Milgram and Asch experiments and discuss their ethical implications.",
      type: "reading",
      dueDate: daysFromNow(18),
      maxScore: 20,
    },
    {
      seedKey: "psych100-quiz2",
      title: "Quiz 2: Personality and Disorders",
      description:
        "Quiz on major personality theories (trait, psychodynamic, humanistic, social-cognitive) and DSM-5 diagnostic categories. 30 minutes.",
      type: "quiz",
      dueDate: daysFromNow(24),
      maxScore: 40,
    },
    {
      seedKey: "psych100-final",
      title: "Final Exam",
      description:
        "Comprehensive final. Extra emphasis on social behavior, psychological disorders, and treatment approaches. 80 multiple-choice + 2 essays. 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  ECON101: [
    {
      seedKey: "econ101-hw1",
      title: "Problem Set 1: Supply, Demand, and Markets",
      description:
        "Graph supply and demand curves, find equilibria, and analyze the effects of price ceilings, price floors, and taxes. 8 problems.",
      type: "homework",
      dueDate: daysFromNow(-28),
      maxScore: 40,
    },
    {
      seedKey: "econ101-hw2",
      title: "Problem Set 2: Elasticity",
      description:
        "Calculate price elasticity, income elasticity, and cross-price elasticity. Determine elastic vs inelastic demand and implications for total revenue.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 40,
    },
    {
      seedKey: "econ101-quiz1",
      title: "Quiz 1: Consumer Theory",
      description:
        "Quiz on utility maximization, indifference curves, budget constraints, and consumer surplus. Closed book, 35 minutes.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 40,
    },
    {
      seedKey: "econ101-hw3",
      title: "Problem Set 3: Firm Behavior and Costs",
      description:
        "Short-run and long-run cost curves, marginal cost, average cost, profit maximization under perfect competition. 8 problems.",
      type: "homework",
      dueDate: daysFromNow(3),
      maxScore: 40,
    },
    {
      seedKey: "econ101-midterm",
      title: "Midterm Exam",
      description:
        "Covers supply and demand, elasticity, consumer theory, and firm behavior. Open one page of notes. 90 minutes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "econ101-essay1",
      title: "Policy Brief: Market Failure Case Study",
      description:
        "Choose a real-world market failure (negative externality, public good, information asymmetry). Write a 2-page policy brief explaining the failure and proposing a government intervention. Cite 3 sources.",
      type: "homework",
      dueDate: daysFromNow(14),
      maxScore: 50,
    },
    {
      seedKey: "econ101-hw4",
      title: "Problem Set 4: Market Structures",
      description:
        "Compare profit maximization under monopoly, oligopoly, and monopolistic competition. Analyze deadweight loss, pricing strategies, and game theory basics.",
      type: "homework",
      dueDate: daysFromNow(21),
      maxScore: 40,
    },
    {
      seedKey: "econ101-quiz2",
      title: "Quiz 2: Externalities and Public Goods",
      description:
        "Quiz on Pigouvian taxes, Coase theorem, public goods, and the free-rider problem. 35 minutes.",
      type: "quiz",
      dueDate: daysFromNow(25),
      maxScore: 40,
    },
    {
      seedKey: "econ101-final",
      title: "Final Exam",
      description:
        "Comprehensive final. Extra emphasis on market structures and market failures. Open one page of notes. 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],

  SOCIOL1: [
    {
      seedKey: "sociol1-reading1",
      title: "Reading Response 1: The Sociological Imagination",
      description:
        "Read C. Wright Mills excerpt and Chapter 1. Write a 1-page response explaining how the sociological imagination connects personal troubles to public issues using one example from your own life.",
      type: "reading",
      dueDate: daysFromNow(-28),
      maxScore: 20,
    },
    {
      seedKey: "sociol1-essay1",
      title: "Essay 1: Culture and Socialization",
      description:
        "2-page essay analyzing how culture and socialization shape individual identity. Discuss at least two socialization agents (family, media, peers, religion) and their relative influence.",
      type: "homework",
      dueDate: daysFromNow(-21),
      maxScore: 50,
    },
    {
      seedKey: "sociol1-quiz1",
      title: "Quiz 1: Social Structure and Institutions",
      description:
        "Quiz on statuses, roles, groups, organizations, and major social institutions. 25 multiple-choice questions, 30 minutes.",
      type: "quiz",
      dueDate: daysFromNow(-7),
      maxScore: 40,
    },
    {
      seedKey: "sociol1-reading2",
      title: "Reading Response 2: Stratification and Inequality",
      description:
        "Read Chapter 8-9 on social class, mobility, and global inequality. Respond to: Is the American Dream a myth or reality? Support with data from the readings.",
      type: "reading",
      dueDate: daysFromNow(3),
      maxScore: 20,
    },
    {
      seedKey: "sociol1-essay2",
      title: "Essay 2: Race, Ethnicity, and Gender",
      description:
        "3-page essay on how race and gender operate as systems of inequality in one specific social institution (education, criminal justice, healthcare, or labor market). Use at least 3 academic sources.",
      type: "homework",
      dueDate: daysFromNow(7),
      maxScore: 60,
    },
    {
      seedKey: "sociol1-midterm",
      title: "Midterm Exam",
      description:
        "In-class exam: 35 multiple-choice + one short essay. Covers sociological perspectives, culture, socialization, and social stratification. Open to one page of handwritten notes.",
      type: "exam",
      dueDate: daysFromNow(10),
      maxScore: 100,
    },
    {
      seedKey: "sociol1-paper-draft",
      title: "Research Paper Draft",
      description:
        "Submit a 5-6 page draft of your sociological research paper on a topic approved in Week 3. Must include a thesis, sociological framework, and at least 5 peer-reviewed sources in ASA format.",
      type: "project",
      dueDate: daysFromNow(18),
      maxScore: 60,
    },
    {
      seedKey: "sociol1-quiz2",
      title: "Quiz 2: Deviance and Social Change",
      description:
        "Quiz on deviance theories (strain theory, labeling theory, conflict theory) and mechanisms of social change. 30 minutes.",
      type: "quiz",
      dueDate: daysFromNow(24),
      maxScore: 40,
    },
    {
      seedKey: "sociol1-final",
      title: "Final Exam",
      description:
        "Comprehensive final: 40 multiple-choice + two essay questions. Extra emphasis on deviance, social movements, and globalization. 3 hours.",
      type: "exam",
      dueDate: daysFromNow(35),
      maxScore: 150,
    },
  ],
};

module.exports = { STEM_COURSES, GE_COURSES, ASSIGNMENTS_BY_COURSE };
