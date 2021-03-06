const { ipcRenderer } = require('electron')
const items = require('./items')

// Dom Nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search')

// Open new item modal
window.newItem = () => {
    showModal.click()
}

// Ref items.open globally
window.openItem = items.open

// Ref items.delete globally
window.deleteItem = () => {
    let selectedItem = items.getSelectedItem()
    console.log('selectedItemIndex: ', selectedItem.index)
    items.delete(selectedItem.index)
}

// open item in native window
window.openItemNative = items.openNative

// Focus to search items
window.searchItems = () => {
    search.focus()
}

// filter items with "search"
search.addEventListener('keyup', e => {
    
    // loop items
    Array.from( document.getElementsByClassName('read-item') ).forEach( item => {

        // hide items that dont match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

// navigating item selection with up/down arrows
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

// disable and enable modal buttons
const toggleModalButtons = () => {

    // check state of buttons
    if(addItem.disabled === true){
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'
    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}

// show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

// close modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

// handle new item
addItem.addEventListener('click', e => {

    // check a url exists
    if (itemUrl.value) {
        
        // sending a new item url to main process
        ipcRenderer.send('new-item', itemUrl.value)

        // disable buttons
        toggleModalButtons()

    }
})

// listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    
    // add new items to "items" node
    items.addItem(newItem, true)

    // enable buttons
    toggleModalButtons()

    // hide modal and clear value
    modal.style.display = 'none'
    itemUrl.value = ''
})

// listening for keyboard submit
itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Enter') addItem.click()
})
