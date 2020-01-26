// modules
const { BrowserWindow } = require('electron')

// offscreen browser window
let offscreenWindow

// exported readItem function
module.exports = (url, callback) => {

    // create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: false
        }
    })

    // load item url
    offscreenWindow.loadURL(url)

    // wait for content to finish loading
    offscreenWindow.webContents.on('did-finish-load', e => {

        // get page title
        let title = offscreenWindow.getTitle()

        // get screenshot thumbnail
        offscreenWindow.webContents.capturePage( image => {
            
            // get image as dataURl
            let screenshot = image.toDataURL()

            // execute callback with new item object
            // Old Syntax
            // callback({title: title, screenshot: screenshot, url: url}) 
            //  New Syntax
            callback({title, screenshot, url})

            // Clean up and garbage collection
            offscreenWindow.close()
            offscreenWindow = null
        })
        
    })

}