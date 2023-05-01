
    import { createOrderHtml, html, updateDraggingHtml, moveToColumn } from './view.js'
    import { createOrderData, state, updateDragging } from './data.js';

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
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}

let dragId = null
/**
 * An event that fires when the dragging of order starts. The state object literal will update the dragging.source to the Id of order being dragged
 * @param {Event} event 
 */
const handleDragStart = (event) => {
    const {target} = event
    dragId = target.dataset.id

    state.dragging.source = dragId


}
/**
 * An event that fires when the dragging of the order stops. The order will be moved to the column chosen by user and the property values in the state.dragging object will be reset to null and the dragging hover effects will be removed.
 * @param {Event} event 
 */
const handleDragEnd = (event) => {
    moveToColumn(dragId, state.dragging.over)

    dragId= null
    state.dragging.source = null
    state.dragging.over = null

    updateDraggingHtml({over:null})

}

/**
 * A handler that fires when users click on the help button. Overlay will appear explaining information about web app and the cancel button will remove the overlay
 * @param {event} event 
 */
const handleHelpToggle = (event) => {
    const { target } = event
    
let helpOverlay = html.help.overlay
helpOverlay.style.display = 'block'

    if (target === html.help.cancel) {
        helpOverlay.style.display = 'none';
      }
   
} /**
 * A handler that fires when the "add order" button is clicked. The "add-order" form overlay will appear for user to enter data. If cancel button is clicked, overlay will be removed with no changes made
 * @param {Event} event 
 */
const handleAddToggle = (event) => { // clicking add order button
    const { target } = event
    
    let addOverlay = html.add.overlay
    
    if (target === html.other.add) {
       addOverlay.style.display = 'block' 
       console.log("clicked add")
    } else if (target === html.add.cancel) {
        addOverlay.style.display = 'none'
        console.log("clicked cancel")
        html.other.add.focus()
    }
    
}
/**
 * A handler that fires when the "add button" in the "add order" form is clicked. Once submitted, overlay will be removed and order will be placed in the "ordered" column. Form will be reset after
 * @param {Event} event 
 */

const handleAddSubmit = (event) => { // clicking add button to add order
    event.preventDefault()
    const { target } = event
    let addOverlay = html.add.overlay
    addOverlay.style.display = 'none'

    const formData = new FormData(event.target)
    const inputData = Object.fromEntries(formData)

    const orderObject = createOrderData(event.target)

    orderObject.title = inputData.title
    orderObject.table = inputData.table

    orderObject.column = 'ordered'
    state.orders[orderObject.id] = orderObject
   

    const fullOrderHtml = createOrderHtml(orderObject) 

    const orderedColumn = document.querySelector('[data-column="ordered"]')


        if (target === html.add.form) {
    orderedColumn.appendChild(fullOrderHtml)
   
        }

        //reset form
       html.add.form.reset()
       html.other.add.focus()
   
        
}

let editId = null
/**
 * This event fires when user clicks on an order. The "edit" form overlay will appear allowing  user to change the input. If cancel button is clicked, overlay will be removed with no changes made. The form will already be populated with data according to the order that was clicked
 * @param {Event} event 
 */
const handleEditToggle = (event) => { // click actual order and cancel on edit overlay

    
    const { target } = event

    const editOverlay = html.edit.overlay
editOverlay.style.display = 'block'

if (target === html.edit.cancel) { //cancel edit
     editOverlay.style.display = 'none'
     html.edit.form.reset()
     html.other.add.focus()
 }

editId = target.dataset.id

// pre-populates edit form with user input according to the order that was clicked on
html.edit.title.value = state.orders[editId].title 
html.edit.table.value = state.orders[editId].table

}
/**
 * An event that fires when user click on "update" button in edit overlay. Data will be changed according to user's input
 * @param {Event} event 
 */


const handleEditSubmit = (event) => { // submit the edited form

    html.edit.overlay.style.display = 'none'
    event.preventDefault()
 

    const formData = new FormData(event.target)
    const inputData = Object.fromEntries(formData)
   
    const editedObject = state.orders[editId]

    // updates state object literal with new data
   editedObject.title =inputData.title
    editedObject.table = inputData.table
    editedObject.column = inputData.column

    const editedHtml = createOrderHtml(editedObject)

    const NewDataColumn = (document.querySelector(`[data-id="${editId}"]`)).closest('[data-column]') // where the edited data will be placed
    const previousHtmlData = (document.querySelector(`[data-id="${editId}"]`))

    // removes previous data and add newly edited data
    NewDataColumn.replaceChild(editedHtml, previousHtmlData)
  


    // moves to specified column
    moveToColumn(editId, editedObject.column)
 

    // reset form and focus on "Add order" button
    html.edit.form.reset()
    html.other.add.focus()


}
/**
 * An event that fires when a user clicks on "delete" button in the "edit" overlay form. Once clicked, overlay will be removed and order will no be display anymore
 * @param {Event} event 
 */

const handleDelete = (event) => { //delete order
    const { target } = event

     html.edit.overlay.style.display = "none"

     let removediv = document.querySelector(`[data-id="${editId}"]`)

     
     removediv.remove()
     delete state.orders[editId] 


     //reset form
     html.edit.form.reset()
    
}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle) 
html.edit.form.addEventListener('submit', handleEditSubmit) 
html.edit.delete.addEventListener('click', handleDelete) 

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}