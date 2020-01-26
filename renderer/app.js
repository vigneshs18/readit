const { ipcRenderer } = require('electron')
const items = require('./items')

// Dom Nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url')

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
