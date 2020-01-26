// dom nodes
let items = document.getElementById('items')

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// add new item
exports.addItem = (item, isNew = false) => {

    // create a dom node
    let itemNode = document.createElement('div')

    //Assign 'read-item' css class
    itemNode.setAttribute('class', 'read-item')

    // Add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new nodes to "items"
    items.appendChild(itemNode)

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

