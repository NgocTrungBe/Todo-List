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
// let listItems = document.querySelectorAll('.list .list__item');
let inputs = document.querySelectorAll('input');
let dragItem;
//modal

let modals = document.querySelectorAll('.modal');

let modalContent = document.querySelector('.modal__content');
let closeModalBtns = document.querySelectorAll('.close-modal-btn');
let editInput = document.querySelector('.edit');
let saveBtn = document.querySelector('#saveBtn');
let deleteBtn = document.querySelector('#deleteBtn');
let notification = document.querySelector('.notification');
// status variable
const TODO_STATUS = "todo";
const DOING_STATUS = "doing";
const COMPLETED_STATUS = "completed";

let todos = [{
    id: 'todo-0',
    title: 'no',
    status: TODO_STATUS
}];

let editItemId = null;
let deleteItemId = null;


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
        drag();
    })
})

closeModalBtns.forEach((button, index) => {
    button.addEventListener('click', function(e) {
        modals[index].classList.remove('open');
        notification.classList.remove('success');
        notification.classList.remove('fail');
        editItemId = null;
        deleteItemId = null;
    });

})





function drag() {
    let listItems = document.querySelectorAll('.list .list__item');
    let editBtns = document.querySelectorAll('.list__item #editBtn');
    let deleteBtns = document.querySelectorAll('.list__item #deleteBtn');
    let shadowItem = document.createElement("LI");
    let shadowItemHeight = 0;
    let prevItem = null;



    if (listItems.length > 0) {
        listItems.forEach((item, index) => {

            // item drag start
            item.addEventListener('dragstart', function(e) {
                dragItem = item;
                prevItem = { id: e.target.id, clientHeight: item.clientHeight };
                setTimeout(() => {
                    item.style.display = 'none';
                }, 0);
            });

            item.addEventListener('dragend', function() {
                setTimeout(() => {
                    dragItem.style.display = 'block';
                    dragItem = null;
                    prevItem = null;
                }, 0)
            });



            editBtns[index].addEventListener('click', function(e) {
                let paths = e.path;
                let itemID;
                let itemTitle;
                let positionX = 0;
                let positionY = 0;
                e.stopPropagation();
                for (let i = 0; i < paths.length; i++) {
                    if (paths[i].nodeName === "LI" && paths[i].classList[0] === 'list__item') {

                        itemID = paths[i].id;
                        itemTitle = paths[i].innerText;
                        positionX = paths[i].offsetLeft;
                        positionY = paths[i].offsetTop + paths[i].clientHeight;
                        break;
                    }
                }
                openModal(itemID, itemTitle, positionX, positionY, 'editModal');
            });

            deleteBtns[index].addEventListener('click', function(e) {

                let paths = e.path;
                let itemID;
                e.stopPropagation();
                for (let i = 0; i < paths.length; i++) {
                    if (paths[i].nodeName === "LI" && paths[i].classList[0] === 'list__item') {
                        itemID = paths[i].id;
                        positionX = paths[i].offsetLeft;
                        positionY = paths[i].offsetTop + paths[i].clientHeight;
                        break;
                    }
                }
                openModal(itemID, '', positionX, positionY, 'deleteModal');
            });

        });


        allList.forEach((list, index) => {
            list.addEventListener('dragover', function(e) {
                e.preventDefault();
                if (prevItem != null) {
                    setTimeout(() => {
                        shadowItem.style.height = prevItem.clientHeight + 'px';
                        shadowItem.style.background = 'rgba(0,0,0,0.1)';
                        shadowItem.style.borderRadius = '5px';
                        list.style.height = prevItem.clientHeight;
                        list.appendChild(shadowItem);
                    }, 0)

                }

            });
            list.addEventListener('dragenter', function(e) {
                e.preventDefault();


            });

            list.addEventListener('drop', function(e) {
                list.append(dragItem);
                list.removeChild(shadowItem);
                let itemNewStatus = getStatusByList(index);
                if (prevItem != null && itemNewStatus != '') {
                    changeItemStatus(prevItem.id, itemNewStatus);
                    drag();
                }

            });

        })
    }
}



function openModal(itemID, itemTitle, positionX, positionY, caseModal) {

    if (positionX != undefined && positionY != undefined) {
        modalContent.style.top = positionY + 'px';
        modalContent.style.left = positionX + 'px';

        editInput.value = itemTitle;


        if (caseModal === 'editModal') {
            modals[0].classList.add('open');
            editItemId = itemID;
        }
        if (caseModal === 'deleteModal') {
            modals[1].classList.add('open');
            deleteItemId = itemID;
        }

    }


}
saveBtn.addEventListener('click', () => editItemById());
deleteBtn.addEventListener('click', () => deleteItemById());

function editItemById() {

    let isSuccess = false;
    let itemTitle = editInput.value;
    if (editItemId != null && itemTitle != '') {
        for (let i = 0; i < todos.length; i++) {
            if ((todos[i].id).includes(editItemId)) {


                todos[i].title = itemTitle;
                isSuccess = true;
                break;
            }
        }
    }
    if (isSuccess) {
        notification.classList.remove('fail');
        notification.classList.add('success');
        notification.innerText = 'Cập nhật thành công!';
        renderItem();
        drag();
        let timeout = setTimeout(function() {
            modals[0].classList.remove('open');
            notification.classList.remove('success');
            isSuccess = false;
            editItemId = null;
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
    if (deleteItemId != null) {
        for (let i = 0; i < todos.length; i++) {
            if ((todos[i].id).includes(deleteItemId)) {

                todos.splice(i, 1);
                isSuccess = true;
                break;
            }
        }
    }
    if (isSuccess) {
        renderItem();
        drag();
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
    let isSuccess = false;
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === itemID) {
            todos[i].status = status;
            isSuccess = true;
            break;
        }
    }
    if (isSuccess) {
        renderItem();
        isSuccess = false;
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
        renderItem();
        isSuccess = false;
    }




}

function renderItem() {

    todoList.innerHTML = todos.map((item, index) => {
        if (item.status === TODO_STATUS) {
            return `
            <li id =${item.id} class="list__item ${item.status}" draggable="true">
                               ${item.title}
                            
                               <span id="editBtn" ><ion-icon name="pencil-outline"></ion-icon></span>
                               <span id="deleteBtn" ><ion-icon name="trash-outline"></ion-icon></span>
            </li>
        
            
            `
        }
    }).join('');
    doingList.innerHTML = todos.map((item, index) => {
        if (item.status === DOING_STATUS) {
            return `
            <li id =${item.id} class="list__item ${item.status}" draggable="true">
                               ${item.title}
                               <span id="editBtn" ><ion-icon name="pencil-outline"></ion-icon></span>
                               <span id="deleteBtn" ><ion-icon name="trash-outline"></ion-icon></span>
            </li>
            `
        }
    }).join('');

    completedList.innerHTML = todos.map((item, index) => {
        if (item.status === COMPLETED_STATUS) {
            return `
            <li id =${item.id} class="list__item ${item.status}" draggable="true">
                               ${item.title}
                               <span id="editBtn" ><ion-icon name="pencil-outline"></ion-icon></span>
                               <span id="deleteBtn" ><ion-icon name="trash-outline"></ion-icon></span>
            </li>
            `
        }
    }).join('');



}
renderItem();
drag();