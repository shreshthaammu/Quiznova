const subjects = {
  WAD: [
      {
    question: "Scope in JavaScript defines the accessibility and visibility of ______",
    options: ["variables", "functions", "objects", "all the above"],
    answer: "all the above"
  },
  {
    question: "Variables declared outside of any function:",
    options: ["Global scope", "Local scope", "block scope", "none of the above"],
    answer: "Global scope"
  },
  {
    question: "__________ prevents unpredictable behavior",
    options: ["let", "var", "const", "TDZ"],
    answer: "TDZ"
  },
  {
    question: "JavaScript loads the entire function into memory ______",
    options: ["after execution", "before execution", "before compilation", "none"],
    answer: "before execution"
  },
  {
    question: "______ variables are only accessible within the specific block",
    options: ["global", "block", "functional", "all the above"],
    answer: "block"
  },
  {
    question: "Variables can be declared after it has been used ______ hoisting",
    options: ["Functional", "global", "variable", "none of the above"],
    answer: "variable"
  },
  {
    question: "The value of this is determined at the ______",
    options: ["initialisation", "declaration time", "compile time", "runtime"],
    answer: "runtime"
  },
  {
    question: "______ function do NOT have their own this",
    options: ["Bind", "arrow", "apply", "call"],
    answer: "arrow"
  },
  {
    question: "In synchronous programming JavaScript waits for ___ task to complete",
    options: ["2", "all", "sequence", "1"],
    answer: "1"
  },
  {
    question: "A callback function can execute after another function has ______",
    options: ["started", "finished", "initialized", "parallelly"],
    answer: "finished"
  },
  {
    question: "_____ happens when the code grammar is wrong",
    options: ["Syntax error", "type error", "reference error", "all the above"],
    answer: "Syntax error"
  },
  {
    question: "JavaScript is a ______ and synchronous language",
    options: ["single threaded", "multi threaded", "both a and b", "none"],
    answer: "single threaded"
  },
  {
    question: "Synchronous callbacks execute immediately during the ___ execution",
    options: ["inner function's", "outer function's", "API", "all"],
    answer: "outer function's"
  },
  {
    question: "To manage callback hell, we should avoid ______",
    options: ["deep nesting", "write cleaner code", "tasks", "both a and b"],
    answer: "both a and b"
  },
  {
    question: "JavaScript handles asynchronous tasks in the background using ______",
    options: ["callbacks hell", "function", "callbacks", "none"],
    answer: "callbacks"
  },
  {
    question: "Syntax for setTimeout(function, _____);",
    options: ["milliseconds", "seconds", "minutes", "none"],
    answer: "milliseconds"
  },
  {
    question: "Promises provide a structured way to handle ______",
    options: ["sync code", "java code", "async code", "all"],
    answer: "async code"
  },
  {
    question: "In React, components must return:",
    options: ["String", "Number", "JSX", "JSON"],
    answer: "JSX"
  },
  {
    question: "JSX is used to write HTML inside ______ in React",
    options: ["JavaScript", "XML", "HTML5", "all"],
    answer: "JavaScript"
  },
  {
    question: "What is the main advantage of Virtual DOM in React?",
    options: [
      "Faster page reload",
      "Direct manipulation of real DOM",
      "Efficient and faster UI updates",
      "More memory usage"
    ],
    answer: "Efficient and faster UI updates"
  },
  {
    question: "Which tool is used to inspect React components in the browser?",
    options: ["Chrome Console", "React Developer Tools", "Node.js", "Redux DevTools"],
    answer: "React Developer Tools"
  },
  {
    question: "JavaScript can run code in ___ ways:",
    options: ["Less than 1", "Equal to 1", "Greater than 1", "two"],
    answer: "two"
  },
  {
    question: "A ______ is a function passed as an argument to another function",
    options: ["callback function", "return function", "function", "all the above"],
    answer: "callback function"
  },
  {
    question: "Callbacks are commonly used for async operations like ______",
    options: ["timers", "API calls", "file loading", "all"],
    answer: "all"
  },
  {
    question: "Use Promise objects to chain ___ operations using .then() and .catch()",
    options: ["async", "sync", "loop", "conditional"],
    answer: "async"
  },
  {
    question: "React is mainly used for building:",
    options: ["Server APIs", "node.js", "Web APIs", "user interfaces"],
    answer: "user interfaces"
  },
  {
    question: "_____ is used to write HTML inside JavaScript in React",
    options: ["XML", "JavaScript", "HTML5", "JSX"],
    answer: "JSX"
  },
  {
    question: "____ scope is determined at the time of writing the code, not when it runs",
    options: ["lexical", "functions", "global", "block"],
    answer: "lexical"
  },
  {
    question: "___ is JavaScript’s default behavior of moving declarations to the top",
    options: ["Hoisting", "variables", "functions", "none of the above"],
    answer: "Hoisting"
  },
  {
    question: "_____ keyword refers to the object that is currently executing",
    options: ["let", "var", "const", "this"],
    answer: "this"
  }

  ],

  CAEG: [
     {
    question: "Engineering drawing is also called as:",
    options: [
      "Language of Engineering",
      "Language of Machines",
      "Artistic Drawing",
      "Freehand Sketch"
    ],
    answer: "Language of Engineering"
  },
  {
    question: "The main purpose of engineering drawing is:",
    options: [
      "Decoration",
      "Communication of ideas",
      "Artistic expression",
      "Entertainment"
    ],
    answer: "Communication of ideas"
  },
  {
    question: "Which CAD command is used to set drawing units before starting?",
    options: ["UNITS", "LIMITS", "ZOOM", "SCALE"],
    answer: "UNITS"
  },
  {
    question: "The command used to define drawing area limits is:",
    options: ["GRID", "LIMITS", "ZOOM", "LINE"],
    answer: "LIMITS"
  },
  {
    question: "In CAD, the command used to draw a straight line is:",
    options: ["LINE", "CIRCLE", "ARC", "RECTANGLE"],
    answer: "LINE"
  },
  {
    question: "Which of the following is NOT a conic section?",
    options: ["Ellipse", "Parabola", "Hyperbola", "Spiral"],
    answer: "Spiral"
  },
  {
    question: "Ellipse can be defined as:",
    options: [
      "Sum of distances from two fixed points is constant",
      "Difference of distances from two fixed points is constant",
      "Ratio of distances from a fixed point and line is constant",
      "Product of distances from two points is constant"
    ],
    answer: "Sum of distances from two fixed points is constant"
  },
  {
    question: "Which curve has only one focus and one directrix?",
    options: ["Ellipse", "Parabola", "Hyperbola", "Circle"],
    answer: "Parabola"
  },
  {
    question: "In orthographic projection, the projectors are always _______ to the plane.",
    options: ["Parallel", "Inclined", "Perpendicular", "Tangent"],
    answer: "Perpendicular"
  },
  {
    question: "The line of intersection between HP and VP is called:",
    options: ["Reference plane", "Axis line", "XY line", "Base line"],
    answer: "XY line"
  },
  {
    question: "Computer-Aided Drafting (CAD) mainly helps in:",
    options: [
      "Hand-drawing sketches",
      "Accurate, fast and editable drawings",
      "Freehand paintings",
      "Printing only"
    ],
    answer: "Accurate, fast and editable drawings"
  },
  {
    question: "To draw a circle in CAD, we use:",
    options: [
      "CIRCLE command",
      "ARC command",
      "POLYLINE command",
      "DONUT command"
    ],
    answer: "CIRCLE command"
  },
  {
    question: "The command used to erase an object in CAD is:",
    options: ["DELETE", "REMOVE", "ERASE", "CLEAR"],
    answer: "ERASE"
  },
  {
    question: "The eccentricity of an ellipse is:",
    options: ["Less than 1", "Equal to 1", "Greater than 1", "Zero"],
    answer: "Less than 1"
  },
  {
    question: "A hyperbola is defined as:",
    options: [
      "Sum of distances constant",
      "Difference of distances constant",
      "Product of distances constant",
      "Ratio of distances constant"
    ],
    answer: "Difference of distances constant"
  },
  {
    question: "The circle from which an involute is generated is called:",
    options: ["Pitch circle", "Addendum circle", "Base circle", "Reference circle"],
    answer: "Base circle"
  },
  {
    question: "The involute profile is commonly used in:",
    options: ["Threads", "Cams", "Gears", "Bearings"],
    answer: "Gears"
  },
  {
    question: "The projection view obtained on the Vertical Plane is called:",
    options: ["Side view", "Front view", "Top view", "Sectional view"],
    answer: "Front view"
  },
  {
    question: "In First Angle Projection, Top View is placed ______ Front View.",
    options: ["Above", "Below", "Right side", "Left side"],
    answer: "Below"
  },
  {
    question: "Engineering drawing is a ______ language of engineers.",
    options: ["Universal", "Spoken", "Programming", "Written"],
    answer: "Universal"
  },
  {
    question: "Which CAD command is used to create a copy of an object?",
    options: ["MIRROR", "OFFSET", "ARRAY", "COPY"],
    answer: "COPY"
  },
  {
    question: "The command used to move an object is:",
    options: ["COPY", "ERASE", "MOVE", "SCALE"],
    answer: "MOVE"
  },
  {
    question: "The fixed line used to define conic sections is called:",
    options: ["Axis", "Directrix", "Latus rectum", "Tangent"],
    answer: "Directrix"
  },
  {
    question: "An involute is defined as:",
    options: [
      "Point on string unwound from curve",
      "Point moving with constant velocity",
      "Point rotating about axis",
      "Rolling circle curve"
    ],
    answer: "Point on string unwound from curve"
  },
  {
    question: "The principal planes used in orthographic projection are:",
    options: ["VP and PP", "HP and VP", "PP and HP", "PP and SP"],
    answer: "HP and VP"
  },
  {
    question: "The position of a point is determined with respect to:",
    options: ["One plane", "Two planes", "Three planes", "Four planes"],
    answer: "Two planes"
  }
  ]
};

export default subjects;