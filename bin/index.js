#!/usr/bin/env node
import path from 'path'
import fs from 'fs'

import evaluate from '../lib/evaluate.js'
import setupInteractiveCli from './interpreter.js'

let interactive = true

for (const arg of process.argv) {
  if (path.extname(arg) === '.zucchinipleasemom') {
    interactive = false
    evaluate(fs.readFileSync(path.normalize(arg)))
  }
}

if (interactive) setupInteractiveCli()
