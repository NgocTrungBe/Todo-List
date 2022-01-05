// get elements
let addNewButtons = document.querySelectorAll('.addnew-btn');
let addNewItemBtn = document.querySelectorAll('.add-btn');
let addNewForms = document.querySelectorAll('.addnew-form');
let exitButtons = document.querySelectorAll('.exit-btn');
let todoList = document.querySelector('#todoList');
let doingList = document.querySelector('#doingList');
let completedList = document.querySelector('#completedList');
let allList = [todoList, doingList, completedList];
let boxs = document.querySelectorAll('.box');
let inputs = document.querySelectorAll('input');

//modal
let modals = document.querySelectorAll('.modal');
let deleteModal = document.querySelector('#deleteModal');
let modalContents = document.querySelectorAll('.modal__content');
let closeModalBtns = document.querySelectorAll('.close-modal-btn');
let editInput = document.querySelector('.edit');
let saveBtn = document.querySelector('#saveBtn');
let deleteBtn = document.querySelector('#deleteButton');
let exitDeleteBtn = document.querySelector('#exitDeleteBtn');
let notification = document.querySelector('.notification');

//
let dragCard;
let shadowCard = document.createElement("LI");
let shadowCardHeight = 0;
let draggingCardHeight = 0;
let editingCardId;
let deletingCardId;

// status variable
const TODO_STATUS = "todo";
const DOING_STATUS = "doing";
const COMPLETED_STATUS = "completed";

let todos = [{
        id: 'todo-0',
        title: 'no',
        status: TODO_STATUS
    },
    {
        id: 'todo-1',
        title: 'Mơ xinh đẹp',
        status: TODO_STATUS
    },
    {
        id: 'todo-2',
        title: 'Mơ đẹp gái',
        status: DOING_STATUS
    },
];



renderItem();
let listItems = document.querySelectorAll('.list .list__item');
let editBtns = document.querySelectorAll('.list__item #editBtn');
let deleteBtns = document.querySelectorAll('.list__item #deleteBtn');

listItems.forEach((item, indexOfItem) => {

    // item drag start
    item.addEventListener('dragstart', dragStart);

    item.addEventListener('dragend', dragEnd);


    editBtns[indexOfItem].addEventListener('click', (e) => editButtonHandle(item));

    deleteBtns[indexOfItem].addEventListener('click', () => deleteButtonHandle(item));

});


allList.forEach((list, index) => {
    boxs[index].addEventListener('dragover', (e) => dragOver(list, index, e));
    boxs[index].addEventListener('dragenter', dragEnter);
    boxs[index].addEventListener('drop', (e) => drop(list, index, e));

})

function dragStart() {
    dragCard = this;
    draggingCardHeight = this.clientHeight;
    setTimeout(() => {
        this.classList.add('dragging');
        this.style.display = 'none';

    }, 0);
}

function dragEnd() {
    setTimeout(() => {
        deleteShadow();
        this.classList.remove('dragging');
        this.style.display = 'block';
        dragCard = null;
        draggingCardHeight = 0;

    }, 0);
}

function dragOver(list, index, e) {
    e.preventDefault();
    setTimeout(() => {
        let cardAfterDraggingCard = getCardAfterDraggingCard(list, e.clientY);
        shadowCard.className = "shadow";
        shadowCard.style.height = draggingCardHeight + 'px';
        shadowCard.style.background = 'rgba(0,0,0,0.1)';
        shadowCard.style.borderRadius = '5px';
        if (cardAfterDraggingCard == null) {
            list.appendChild(shadowCard);
        } else {
            cardAfterDraggingCard.parentNode.insertBefore(shadowCard, cardAfterDraggingCard);
        }
    }, 0)
}

function dragEnter(e) {
    e.preventDefault();
}


function drop(list, index, e) {
    e.preventDefault();
    let draggingCard = document.querySelector('.list__item.dragging');
    let cardAfterDraggingCard = getCardAfterDraggingCard(list, e.clientY);
    if (cardAfterDraggingCard == null) {
        list.appendChild(draggingCard);
    } else {
        cardAfterDraggingCard.parentNode.insertBefore(draggingCard, cardAfterDraggingCard);
    }
    dragCard.classList.remove(dragCard.classList[1]);
    let itemNewStatus = getStatusByList(index);
    dragCard.classList.add(`${itemNewStatus}`);
    changeItemStatus(dragCard.id, itemNewStatus);
}




addNewButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        let addNewButtonIsActive = document.querySelector('.addnew-btn.active');
        let addNewFormIsOpen = document.querySelector('.addnew-form.open');
        if (addNewFormIsOpen != null && addNewFormIsOpen != null) {
            addNewButtonIsActive.classList.remove('active');
            addNewFormIsOpen.classList.remove('open');
        }
        this.classList.toggle('active');
        addNewForms[index].classList.toggle('open');


    });
    exitButtons[index].addEventListener('click', function() {
        addNewButtons[index].classList.remove('active');
        addNewForms[index].classList.remove('open');

    })
});
addNewItemBtn.forEach((button, index) => {
    button.addEventListener('click', function() {
        let title = inputs[index].value;
        addNewItem(index, title);
        inputs[index].value = "";
        addNewButtons[index].classList.remove('active');
        addNewForms[index].classList.remove('open');

    })
})
closeModalBtns.forEach((button, index) => {
    button.addEventListener('click', function(e) {
        closeModal();
    });

})


function editButtonHandle(item) {

    let itemRect = item.getBoundingClientRect();
    openModal(item.id, item.innerText, itemRect.x, itemRect.y + itemRect.height, 'editModal');
}

function deleteButtonHandle(item) {
    let itemRect = item.getBoundingClientRect();
    openModal(item.id, '', itemRect.x, itemRect.y + itemRect.height, 'deleteModal');

}

function getCardAfterDraggingCard(list, yDraggingCard) {
    let listCards = [...list.querySelectorAll('.list__item:not(.dragging)')];
    return listCards.reduce((closestCard, nextCard) => {
        let nextCardRect = nextCard.getBoundingClientRect();
        let offset = yDraggingCard - nextCardRect.top - nextCardRect.height / 2;

        if (offset < 0 && offset > closestCard.offset) {
            return { offset, element: nextCard }
        } else {

            return closestCard;
        }

    }, { offset: Number.NEGATIVE_INFINITY }).element;

}


function deleteShadow() {
    allList.forEach((list) => {
        let children = list.children;
        for (let i = 0; i < children.length; i++) {
            if ((children[i].className).includes('shadow')) {
                list.removeChild(children[i]);
                break;
            }
        }
    });
}

function openModal(itemID, itemTitle, positionX, positionY, caseModal) {
    if (positionX != undefined && positionY != undefined) {
        for (let i = 0; i < modals.length; i++) {
            if ((modals[i].id).includes(caseModal)) {
                if ((modals[i].id) === 'editModal') {
                    editInput.value = itemTitle;
                    editingCardId = itemID;
                }
                if ((modals[i].id) === 'deleteModal') {
                    deletingCardId = itemID;
                }
                modalContents[i].style.top = positionY + 'px';
                modalContents[i].style.left = positionX + 'px';
                modals[i].classList.add('open');
                break;
            }
        }
    }
}
saveBtn.addEventListener('click', editItemById);
deleteBtn.addEventListener('click', deleteItemById);
exitDeleteBtn.addEventListener('click', (e) => {
    closeModal();
});


function closeModal() {
    let modalIsOpen = document.querySelector('.modal.open');
    modalIsOpen.classList.remove('open');
    notification.classList.remove('success');
    notification.classList.remove('fail');
    editingCardId = null;
    deleteItemId = null;

}

function editItemById() {
    let isSuccess = false;
    let cardTitle = editInput.value;
    if (editingCardId != null && cardTitle != '') {
        for (let i = 0; i < todos.length; i++) {
            if ((todos[i].id).includes(editingCardId)) {
                todos[i].title = cardTitle;
                isSuccess = true;
                break;
            }
        }
    }
    if (isSuccess) {
        let editingCard = document.querySelector(`.list #${editingCardId}`);
        updateElement(editingCard, cardTitle);
        notification.classList.remove('fail');
        notification.classList.add('success');
        notification.innerText = 'Cập nhật thành công!';
        let timeout = setTimeout(function() {
            isSuccess = false;
            closeModal();
            clearTimeout(timeout);
        }, 1500);

    } else {
        isSuccess = false;
        notification.classList.add('fail');
        notification.innerText = 'Cập nhật thất bại!';
    }



}

function deleteItemById() {
    let isSuccess = false;
    if (deletingCardId != null) {
        for (let i = 0; i < todos.length; i++) {
            if ((todos[i].id).includes(deletingCardId)) {
                todos.splice(i, 1);
                isSuccess = true;
                break;
            }
        }
    }
    if (isSuccess) {

        let deletingCard = document.querySelector(`.list #${deletingCardId}`);
        deletingCard.parentNode.removeChild(deletingCard);
        let timeout = setTimeout(function() {
            modals[1].classList.remove('open');
            isSuccess = false;
            deleteItemId = null;
            clearTimeout(timeout);
        }, 1000);

    } else {
        isSuccess = false;
        modals[1].classList.remove('open');

    }
}

function updateElement(card, cardTitle) {
    let editBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');
    //buttons
    editBtn.innerHTML = `<ion-icon name="pencil-outline"></ion-icon>`;
    editBtn.setAttribute('id', 'editBtn');
    deleteBtn.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;
    deleteBtn.setAttribute('id', 'deleteBtn');
    card.innerText = cardTitle;
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    //
    editBtn.addEventListener('click', () => editButtonHandle(card));
    deleteBtn.addEventListener('click', () => deleteButtonHandle(card))
}

function getStatusByList(index) {
    if (index === 0) {
        return TODO_STATUS;
    } else if (index === 1) {
        return DOING_STATUS;

    } else {
        return COMPLETED_STATUS;
    }
}

function changeItemStatus(itemID, status) {
    if (itemID != '' && status != '') {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === itemID) {
                todos[i].status = status;
                isSuccess = true;
                break;
            }
        }
    }
}

function addNewItem(caseList, title) {
    let id = todos.length == 0 ? 'todo-' + 0 : 'todo-' + todos.length;
    let status;
    let isSuccess = false;

    switch (caseList) {
        case 0:
            status = TODO_STATUS;
            break;
        case 1:
            status = DOING_STATUS;
            break;
        case 2:
            status = COMPLETED_STATUS;
            break;

        default:
            break;
    }
    if (id != '' && title != '') {
        todos.push({
            id: id,
            title: title,
            status: status
        });
        isSuccess = true;
    }
    if (isSuccess) {
        let newCard = document.createElement('LI');
        //item
        newCard.setAttribute('id', id);
        newCard.setAttribute('class', `list__item ${status}`);
        newCard.setAttribute('draggable', true);
        updateElement(newCard, title);
        //buttons

        if (status === TODO_STATUS) {
            todoList.appendChild(newCard);
        }
        if (status === DOING_STATUS) {

            doingList.appendChild(newCard);
        }
        if (status === COMPLETED_STATUS) {

            completedList.appendChild(newCard);
        }
        newCard.addEventListener('dragstart', dragStart);
        newCard.addEventListener('dragend', dragEnd);

        isSuccess = false;
    }
}



function renderItem() {
    todoList.innerHTML = todos.map((item, index) => {
        if (item.status === TODO_STATUS) {
            return `
            <li id =${item.id} data-index=${index} class="list__item ${item.status}" draggable="true">
                               ${item.title}
    
                               <button id="editBtn"><ion-icon name="pencil-outline"></ion-icon></button>
                               <button id="deleteBtn"><ion-icon name="trash-outline"></ion-icon></button>
            </li>
    
    
            `
        }
    }).join('');
    doingList.innerHTML = todos.map((item, index) => {
        if (item.status === DOING_STATUS) {
            return `
            <li id =${item.id} data-index=${index} class="list__item ${item.status}" draggable="true">
                               ${item.title}
    
                               <button id="editBtn"><ion-icon name="pencil-outline"></ion-icon></button>
                               <button id="deleteBtn"><ion-icon name="trash-outline"></ion-icon></button>
            </li>
            `
        }
    }).join('');

    completedList.innerHTML = todos.map((item, index) => {
        if (item.status === COMPLETED_STATUS) {
            return `
            <li id =${item.id} data-index=${index} class="list__item ${item.status}" draggable="true">
                               ${item.title}
    
                               <button id="editBtn"><ion-icon name="pencil-outline"></ion-icon></button>
                               <button id="deleteBtn"><ion-icon name="trash-outline"></ion-icon></button>
            </li>
            `
        }
    }).join('');
}