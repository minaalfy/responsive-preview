# Description

> A simple tool to preview your responsive applications, websites in a fancy design inspired by [chrome dev tools](https://developers.google.com/web/tools/chrome-devtools/device-mode/).

# Demo
 > [Demo App](/build)

# Documentation
 > [Documentation](https://responsive-previewer.firebaseapp.com/docs)

# Usage

> Just add the CSS file and JS file

```html
  <link rel="stylesheet" href="/previewer.css">
  <script src="/previewer.js"></script>
```

Then add the previewer widget to the page body like this abd change `./app.html` to your page path
```html
  <div class="responsive-preview" data-prop-app="./app.html"></div>
```

 - Go to your app folder.
 - Just create another html file and copy the following code in it.
 - Refer to the path for the page needed to be tested in the "data-prop-app".
 - Navigate to this new file in the browser to start preview your app ;)

```html
    <!DOCTYPE html>
    <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Responsive Preview for AppName</title>
          <link rel="stylesheet" href="/previewer.css">
        </head>
      <body>

        <div class="responsive-preview" data-prop-app="./app.html"></div>

        <script src="/previewer.js"></script>
      </body>
    </html>
```
# CDN

!> Coming Soon
  
# Features

  - 13 deiffernt devices using [Devices.css](https://marvelapp.github.io/devices.css/)
  - Portrait and landscape device views
  - Auto scale device to fit screen size and allow custom zoom levels
  - Custon scrollbars for windows
  - Show/Hide device frame


# Dependencies
  
  - [Devices.css](https://marvelapp.github.io/devices.css/)
  - [Preact](https://preactjs.com/)
  - [preact-habitat](https://github.com/zouhir/preact-habitat)
  - [preact-custom-scrollbars](https://github.com/lucafalasco/preact-custom-scrollbars)

# Contents

  > Developed as Preact widget and contains `<Toolbar />` component and `<Device />` component

| File | Descrition |
| ------ | ------ |
| src/index.css | CSS for the page body and header |
| src/index.js | wrap our Previewer component as a preact widget |
| src/component/toolbar.js | Preact component for the toolbar with all actions |
| src/component/device.js | Preact component for the device with all actions |
| src/component/previewer.js | Preact component for to wrap Toolbar and Component and pass data between it |
| src/component/devices.js | Array of devices object you can remove or add new devices from here |
| src/component/iframeHeight.js | a function to calculate iframe content height |
| tests | Unit and snapshot testing using jest |

# Todos

 - Support different themes 
 - Write more tests