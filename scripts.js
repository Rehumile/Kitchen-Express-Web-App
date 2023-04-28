
    import { createOrderHtml, html, updateDraggingHtml, moveToColumn } from './view.js'
    import { createOrderData, state } from './data.js';

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDraggingHtml({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {}
const handleDragEnd = (event) => {}
const handleHelpToggle = (event) => {
    const { target } = event
    
let helpOverlay = html.help.overlay
helpOverlay.style.display = 'block'

    if (target === html.help.cancel) {
        helpOverlay.style.display = 'none';
      }
   
}
const handleAddToggle = (event) => { // clicking add order button
    const { target } = event
    
    let addOverlay = html.add.overlay
    
    if (target === html.other.add) {
       addOverlay.style.display = 'block' 
       console.log("clicked add")
    } else if (target === html.add.cancel) {
        addOverlay.style.display = 'none'
        console.log("clicked cancel")
    }
    
}


const handleAddSubmit = (event) => { // clicking add button to add order
    event.preventDefault()
    const { target } = event
    let addOverlay = html.add.overlay
    addOverlay.style.display = 'none'
        
    const data = {
        title: html.add.title.value,
        table: html.add.table.value,
        column: html.columns.ordered
    
    }
    // below is too add data to createOrderData function then
    //generate html with creatOrderHTMl function
    const fullOrder = createOrderHtml(createOrderData(data)) 
    const orderedColumn = document.querySelector('[data-column="ordered"]')

    if (target === html.add.form)
    orderedColumn.append(fullOrder) //show html order


        const OrderObject = createOrderData(data) // object order'

        // Object.keys(OrderObject).length
        // console.log(Object.keys(OrderObject).length)
        // let orderID = document.querySelector('.order').dataset.id
        // const stateOrderObjectLength = Object.keys(state.orders).length
        // state.orders[orderID] = OrderObject //trying to add order to state object
        // console.log(state.orders, stateOrderObjectLength)
       
       //reset form
       html.add.form.reset()

        
}


const handleEditToggle = (event) => { // click actual order and cancel on edit overlay
    const { target } = event
    const editOverlay = html.edit.overlay
editOverlay.style.display = 'block'


    // let editTitle = html.edit.title.value
//     let editTable = html.edit.table

//    editTable = html.add.title.value
//    editTable = html.add.table.value
// html.edit.title.value = target.dataset.title 
// html.edit.table.value = target.dataset.table

// console.log(html.edit.title.value, html.edit.table.value )

const editTitle = document.querySelector('[data-order-title]').innerHTML
const editTable = document.querySelector('[data-order-table]').innerHTML

html.edit.title.value = editTitle
html.edit.table.value = editTable



  if (target === html.edit.cancel) { //cancel edit
     editOverlay.style.display = 'none'
     console.log("clicked edit cancel")
 }
    
    
}
const handleEditSubmit = (event) => { // submit the edited form
    event.preventDefault()
    const {target} = event
    

   
    const editedData = {
        title: html.edit.title.value,
        table:html.edit.table.value,
        column: html.columns.ordered
    
    }

    const editedFullOrder = createOrderHtml(createOrderData(editedData))
    const orderedColumn = html.edit.column.value

    // if (target === html.edit.form)
    // orderedColumn.append(editedFullOrder)
        console.log(orderedColumn)
        console.log(editedFullOrder)

console.log(handleAddSubmit())

}
const handleDelete = (event) => { //delete order

    console.log(state)
    
    // inputEditFormValue = html.add.title.value 
    // selectEditTableValue = html.add.table.value

    // const editedData = {
    //     title: inputEditFormValue,
    //     table: selectEditTableValue,
    //     column: html.columns.ordered
    
    // }

    // const editedFullOrder = createOrderHtml(createOrderData(editedData))

    // console.log(editedFullOrder)
    // document.getElementById(id)
}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle) // clicking the atual order
html.edit.cancel.addEventListener('click', handleEditToggle) //cancel button
html.edit.form.addEventListener('submit', handleEditSubmit) // submit button
html.edit.delete.addEventListener('click', handleDelete) //delete 

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}