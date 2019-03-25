const menus = {
    main: `
    responsive-preview-creator [command] <options>
  
      page .............. generate previewer for the given page
      version ............ show package version
      help ............... show help menu for a command`,
  
    page: `
    responsive-preview-creator app <options>
  
      --page, -p ..... the page to be previewed`,
  }
  
  module.exports = (args) => {
    const subCmd = args._[0] === 'help'
      ? args._[1]
      : args._[0]
  
    console.log(menus[subCmd] || menus.main)
  }