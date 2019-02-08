# momzucchinijs
`momzucchinijs` is an interpreter for the esoteric stack-based programming language `mom please get me so me zucchini from sho p`, is written in fairly modern JavaScript.

The interpreter is small but fairly feature-complete. It can interpret `mom please get me so me zuchini from sho p` programs written interactively with the REPL-like CLI or in files with the `.zucchinipleasemom` extension.

Several design decisions allow its small size. Specifically, it skips several steps of the traditional interpretation cycle.

There is no tokenisation or parsing step (in the traditional sense), and no AST is generated. Instead, source code text is directly pattern-matched to instructions function. Each instruction specified in the language is implemented as a pattern and an instruction function to be executed when that pattern is matched. The source code is scanned for instructions matching the known instruction patterns, and for each match found, the corresponding instruction function defined alongside that instruction pattern is executed. Concretely, this uses a mapping of RegEx instruction patterns to functions taking the state as input and mutating it (implementing these functions as pure functions which take the state as input and simply return a new state is a planned improvement to the interpreter). When each match has its instruction function run, any arguments included in the instruction are passed to the instruction function.

## But what is `mom please get me so me zucchini from sho p`
It is an esoteric stack-based programming language with functional elements.
It was created by the author and [is documented on the Esolangs wiki](https://esolangs.org/wiki/Mom_please_get_me_so_me_zucchini_from_sho_p).

## Running programs
You can run programs by either using the CLI interactive REPL with
```bash
node index.js
```
or writing your program in a file with the `.zucchinipleasemom` extension and then running the interpreter on that file with
```bash
node index.js -f path/to/program.zucchinipleasemom
```

## Writing programs
`mom please get me so me zucchini from sho p` is a stack-based esoteric programming language with functional elements.

Comprehensive documentation is not available because it has not been written yet. However, you can get an indication of how `mom please get me so me zucchini from sho p` works from reading the source code of this interpreter. A list of instructions is declared in `lib/instructions.js`. The core of the interpreter is defined in `lib/evaluate.js`.

Example programs are given in the `examples` directory.
