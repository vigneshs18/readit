// Modules
const fs = require('fs')
const { shell } = require('electron')

// dom nodes
let items = document.getElementById('items')

// get readerJS contents
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// listen for done message from render window
window.addEventListener('message', e => {

    // check for correct message
    if(e.data.action === 'delete-reader-item') {

        // delete item at given index
        this.delete(e.data.itemIndex)

        // close the reader window
        e.source.close()
    }    
})

// delete item
exports.delete = itemIndex => {
    //console.log(itemIndex)
    // remove item from dom
    items.removeChild(items.childNodes[itemIndex])

    // remove from storage
    this.storage.splice(itemIndex, 1)

    // persist
    this.save()

    // get new selected item index
    if(itemIndex === 0){
        return
    } else {
        let newSelectedItemIndex = itemIndex - 1

        // set item at new index as selected
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
    

    
}

// get selected item index
exports.getSelectedItem = () => {

    // get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]
    console.log(currentItem)
    // get item index
    let itemIndex = 0
    let child = currentItem.previousSibling
    // console.log(child)
    // console.log(child.previousSibling)
    // console.log(itemIndex)
    while( (child.previousSibling) != null ){
        child = child.previousSibling
        itemIndex++
        // console.log(child)
        // console.log(child.previousSibling)
        // console.log(itemIndex)
    }
    console.log(itemIndex)
    // return selected item and index
    return { node: currentItem, index: itemIndex }
}


// persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// set item as selected
exports.select = e => {

    // remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected')

    // add to clicked item
    e.currentTarget.classList.add('selected')
}

// move to newly selected item
exports.changeSelection = direction => {
    
    // get selected item
    let currentItem = this.getSelectedItem()

    // handle up/down
    if(direction === 'ArrowUp' && currentItem.node.previousSibling){
        currentItem.node.classList.remove('selected')
        currentItem.node.previousSibling.classList.add('selected')
    } else if (direction === 'ArrowDown' && currentItem.node.nextSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.nextSibling.classList.add('selected')
    }
}

// Open item in native browser
exports.openNative = () => {

    // Only if we have item
    if(!this.storage.length) return

    // get selected item
    let selectedItem = this.getSelectedItem()

    // open in system browser
    shell.openExternal(selectedItem.node.dataset.url)

}

// Open selected item
exports.open = () => {

    // only if we have items (in case of menu open)
    if(!this.storage.length) return

    // get selected item

    let selectedItem = this.getSelectedItem()

    // get item's URL
    let contentURL = selectedItem.node.dataset.url
    
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

    // Inject JavaScript with specific item index (selectedItem.index)
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index))
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

