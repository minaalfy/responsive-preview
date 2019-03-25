#!/usr/bin/env node
const minimist = require('minimist');
const { version } = require('../package.json')

const init = () => {
  const args = minimist(process.argv.slice(2))
  let cmd = args._[0] || 'help';
  if (args.version || args.v) {
    cmd = 'version'
  }
  if (args.help || args.h) {
    cmd = 'help'
  }
  if (args.page || args.p) {
    cmd = 'page'
  }
  switch (cmd) {
    case 'page':
      require('./generate')(args)
      break
    case 'version':
      console.log(version);
      break
    case 'help':
      require('./help')(args)
      break
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
};

init();