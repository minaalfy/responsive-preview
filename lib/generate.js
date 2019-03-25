const fs = require('fs');
const ora = require('ora');
const createHTML = require('create-html');
const nodePath = require('path');
const chalk = require('chalk');


const createFile = (filename, extension) => {
  const filePath = `${process.cwd()}/${filename}.${extension}`
  shell.touch(filePath);
  return filePath;
};

module.exports = (args) => {
  const spinner = ora().start();
  const path = args.page ? args.page : args.p;

  const cssFilename = 'previewer.css';
  const cssSrc = require.resolve('../build/' + cssFilename);
  const jsFilename = 'previewer.js';
  const jsSrc = require.resolve('../build/' + jsFilename);
  const destDir = process.cwd() + '/responsive-preview';

  function copyFile(src, dest) {
    let readStream = fs.createReadStream(src);
    readStream.once('error', (err) => {
      console.log(err);
    });
    readStream.pipe(fs.createWriteStream(dest));
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    const html = createHTML({
      title: 'Responsive Preview',
      script: 'responsive-preview/previewer.js',
      css: 'responsive-preview/previewer.css',
      body: `<div class="responsive-preview" data-prop-app="${path}"></div>`
    });
    fs.writeFile('responsive-preview.html', html, function (err) {
      if (err) console.log(err);
      fs.access(destDir, (err) => {
        if (err)
          fs.mkdirSync(destDir);
    
        copyFile(cssSrc, nodePath.join(destDir, cssFilename));
        copyFile(jsSrc, nodePath.join(destDir, jsFilename));
        spinner.stop();
        console.log(
          chalk.white.bgGreen.bold(`Responsive preview generated for ${path} `)
        );
        console.log(
          chalk.white.bgBlueBright.bold('now you can serve responsive-preview.html to see it working')
        );
      });
    })
  });
}