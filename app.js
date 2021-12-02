let todoForm, todoList, inputBox;
let todoItems = [];
window.addEventListener('DOMContentLoaded', initializeApp());

function setReferences(){
      todoForm = document.querySelector('form');
      todoList = document.querySelector('.list');
      todoBox = document.querySelector('#item');
      btn = document.querySelector('#btn');
}

function getLocalStorageItems(){
      console.log("pulling items from local storage");
      const itemsFromLocalStorage = JSON.parse(localStorage.items);
      if(itemsFromLocalStorage.length){
            todoItems = itemsFromLocalStorage;
            todoList.dispatchEvent(new CustomEvent('itemsModified'))
      }else{
            zeroItemsMessage();
      }
}


function initializeApp(){
      setReferences();
      console.log("inside the app...");
      doEventBindings();
      getLocalStorageItems();
}


function handleItemSubmission(e){
      e.preventDefault();
      console.log("handle item submission...", e);
      const { item } = e.currentTarget;
      console.log(item.value, " -- here is the item content");
      if(!item.value.trim()) return;

      const todoItem = {
            name: item.value.toLowerCase(),
            id:`vo${todoItems.length + 1}`,
            complete:false
      }
      todoItems.push(todoItem);
      console.log("there are now ", todoItems.length + " todos in the state");
      console.log(todoItems);
      todoForm.reset();
      todoList.dispatchEvent(new CustomEvent('itemsModified')); 
}

function zeroItemsMessage(){
      let html = `
      <h3 id="text">Your todo list is empty</h3>
      `;
      todoList.innerHTML = html;
}

function renderItems(){
      if(todoItems.length===0){
            return zeroItemsMessage();
      }
      const html = todoItems.map(item => {
            return `
            <div class="item" style=${item.complete === true ? `"background-color:#40E0D0;color:white"`:``}>
            <div id="mark">${item.complete === true ? `<div>&#9989;</div>`:``}</div>
            <div>
            <div id=${item.id} style=${item.complete === true ? `"text-decoration : line-through;"`:`"text-decoration : none;"`}>${item.name}</div>
            </div>
            <div>
            <button id="delete" name="remove-item"> &#10060; </button>
            <button id ="complete" name="complete-item">&#10004;</button>
            </div>
            </div>
            `
      }).join('');
      todoList.innerHTML = html;
}


function removeItem(itemId){
      todoItems = todoItems.filter(item => item.id != itemId);
      todoList.dispatchEvent(new CustomEvent('itemsModified'));
}

function markForCompletion(itemId){
      const item = todoItems.find(item => item.id === itemId);
      item.complete = !item.complete;
      todoList.dispatchEvent(new CustomEvent('itemsModified'))
      console.log(item)
}

function handleCompletionOrRemoval(e){
      if(e.target.matches('button')){
            const itemId = e.target.parentElement.previousElementSibling.firstElementChild.id;
            switch(e.target.name){
                  case "remove-item":
                        removeItem(itemId);
                        break;
                  case "complete-item":
                        markForCompletion(itemId)
                        break;
                  default:
                        break;           
            }
      }
}

function clear(){ 
      todoItems.splice(0, todoItems.length);
      console.log("cleared")
      todoList.innerHTML = "";
      return zeroItemsMessage();
}

function updateLocalStorage(){
      console.log("call local storage");
      localStorage.items = JSON.stringify(todoItems);
      console.log(localStorage.items);

}


function doEventBindings(){
      console.log("inside the do event bindings function...");
      todoForm.addEventListener('submit', handleItemSubmission);
      todoList.addEventListener('itemsModified', renderItems);
      todoList.addEventListener('click', handleCompletionOrRemoval);
      btn.addEventListener('click', clear);
      todoList.addEventListener('itemsModified', updateLocalStorage);
}




