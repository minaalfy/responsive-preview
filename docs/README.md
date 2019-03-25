# Description

> A simple tool to preview your responsive applications, websites in a fancy design inspired by [chrome dev tools](https://developers.google.com/web/tools/chrome-devtools/device-mode/).


# Demo
 > [Demo App](https://responsive-previewer.firebaseapp.com/)

![Demo](screenshot.gif)


# Features

  - 13 deiffernt devices using [Devices.css](https://marvelapp.github.io/devices.css/)
  - Portrait and landscape device views
  - Auto scale device to fit screen size and allow custom zoom levels
  - Custon scrollbars for windows
  - Show/Hide device frame


# Usage
Just install it glopally `npm i -g responsive-preview`
Then navigate to the app, page you want to preview then run
`responsive-preview -p filename.html` where `filename.html` is the filename of the page you want to preview.

## Output
  `responsive-preview.html` the generated html file which you should deploy to show it to your clients ;)
  `responsive-preview` Folder contains 2 files `responsive-preview.css` and `responsive-preview.js`


# Todos

 - Support different themes.
 - Support command options to customize the output html.
 - Write more tests.