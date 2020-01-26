// Modules
const fs = require('fs')

// dom nodes
let items = document.getElementById('items')

// get readerJS contents
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// set item as selected
exports.select = e => {

    // remove currently selected item class
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

    // add to clicked item
    e.currentTarget.classList.add('selected')
}

// move to newly selected item
exports.changeSelection = direction => {
    
    // get selected item
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // handle up/down
    if(direction === 'ArrowUp' && currentItem.previousSibling){
        currentItem.classList.remove('selected')
        currentItem.previousSibling.classList.add('selected')
    } else if (direction === 'ArrowDown' && currentItem.nextSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextSibling.classList.add('selected')
    }
}

// Open selected item
exports.open = () => {

    // only if we have items (in case of menu open)
    if(!this.storage.length) return

    // get selected item

    let selectedItem = document.getElementsByClassName('read-item selected')[0]

    // get item's URL
    let contentURL = selectedItem.dataset.url
    
    // open item in proxy BrowserWindow
    let readerWin = window.open(contentURL, '', `
        x=60,
        y=20,
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=700,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `)

    // Inject JavaScript
    readerWin.eval(readerJS)
}

// add new item
exports.addItem = (item, isNew = false) => {

    // create a dom node
    let itemNode = document.createElement('div')

    //Assign 'read-item' css class
    itemNode.setAttribute('class', 'read-item')

    // set item url as data attribute
    itemNode.setAttribute('data-url', item.url)

    // Add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new nodes to "items"
    items.appendChild(itemNode)

    // attach click handler to select
    itemNode.addEventListener('click', this.select)

    // attach open doubleclick handler
    itemNode.addEventListener('dblclick', this.open)

    // if this is the first item, select it
    if(document.getElementsByClassName('read-item').length === 1){
        itemNode.classList.add('selected')
    }

    // add item to storage and persist
    if(isNew) {
        this.storage.push(item)
        this.save()
    }
    
}

// add items from storage when app loads
this.storage.forEach(item => {
    this.addItem(item)
})

