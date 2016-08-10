"use strict";

// dependencies
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const CWD = process.cwd();

// configuration; assumes you already created these during bower installation
const bowerJsonIgnore = require(path.join(CWD, 'bower.json')).dependenciesIgnore;
const bowerRcDirectory = JSON.parse(fs.readFileSync(path.join(CWD, '.bowerrc'))).directory;
// arguments
const DRY = '--dry' == (process.argv[2] || '').toLowerCase();
if (DRY) console.log('dry run will now describe operations without performing any.');

// utilities
fs.unlinkSyncEmptyDirectoriesRecursively = (path) => {
  if (fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory())
        fs.unlinkSyncEmptyDirectoriesRecursively(curPath); // recurse
    });
    let files = fs.readdirSync(path);
    if (0 === files.length)
      fs.rmdirSync(path);
  }
};

// walk file system
var matched = 0, removed = 0;
for (let dep in bowerJsonIgnore) {
  if (bowerJsonIgnore.hasOwnProperty(dep)) {
    let globs = bowerJsonIgnore[dep];
    let options = { cwd: path.join(bowerRcDirectory, dep), dot: true };
    if (DRY) console.log('\n'+ path.relative(process.cwd(), options.cwd) +'/:');
    for (let i=0; i<globs.length; i++) {
      let pattern = globs[i];
      if (DRY) console.log('  remove '+ pattern);
      let files = glob.sync(pattern, options);
      for (let ii=0; ii<files.length; ii++) {
        let file = files[ii];
        let absPath = path.join(options.cwd, file);
        if (!fs.lstatSync(absPath).isDirectory()) { // postpone directory removal
          matched++;
          if (DRY) {
            console.log('    - '+ file);
          }
          else {
            console.log('- '+ path.relative(path.join(CWD, bowerRcDirectory), absPath));
            fs.unlinkSync(absPath);
            removed++;
          }
        }
      }
    }
    // when done, clean up any empty directories
    fs.unlinkSyncEmptyDirectoriesRecursively(options.cwd);
  }
}

console.log((DRY ? matched + ' files matched, ' : '') + removed +' files removed. done.');
