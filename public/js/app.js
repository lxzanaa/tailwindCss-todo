let addForm = document.querySelector('#add_form');
let itemList = document.querySelector('#item_list');
let countItems = document.querySelector('#count_items');
let countChecks = document.querySelector('#count_checks');
let deleteBtn = document.querySelector('#delete-btn');
let noItemText = document.querySelector('#no-item');
let filterSelect = document.querySelector('#filter_select');
let itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];
renderItems();
updateItemCount();
updateCheckedCount(0);

function saveItemsToLocalStorage() {
    localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
}

function createNewItem(quantity, itemText) {
    let newItem = document.createElement('li');
    let itemId = 'item-' + Date.now(); // Unique ID for each item
    newItem.innerHTML = `
    <div class="flex items-center justify-between bg-[#ffebb3] rounded-full px-6 py-3">
      <input type="checkbox" id="${itemId}">
      <label for="${itemId}" class="font-bold text-lg text-[#5a3e2b]">${quantity} ${itemText}</label>
      <div class="flex items-center">
        <button class="deleteButton text-red-500 mr-3"><i class="fas fa-times text-2xl"></i></button>
      </div>
    </div>
  `;
    itemList.appendChild(newItem);

    let deleteButton = newItem.querySelector('.deleteButton');
    deleteButton.addEventListener('click', function () {
        let index = itemsArray.findIndex(item => item.id === itemId);
        if (index !== -1) itemsArray.splice(index, 1);
        newItem.remove();
        updateItemCount();
        saveItemsToLocalStorage();

        let isChecked = newItem.querySelector('input[type="checkbox"]').checked;
        if (isChecked) {
            updateCheckedCount(-1);
        }

        if (itemList.children.length === 0) {
            noItemText.style.display = 'block';
        }
    });

    noItemText.style.display = 'none';

    itemsArray.push({ id: itemId, quantity: quantity, text: itemText, checked: false });
    saveItemsToLocalStorage();
}

function updateItemCount() {
    countItems.textContent = itemsArray.length;
    if (itemsArray.length === 0) {
        noItemText.style.display = 'block';
    } else {
        noItemText.style.display = 'none';
    }
}

function updateCheckedCount(initialize = 0) {
    let checkedCount;
    if (initialize) {
        checkedCount = itemsArray.filter(item => item.checked).length;
    } else {
        checkedCount = parseInt(countChecks.textContent) + initialize;
    }
    countChecks.textContent = checkedCount;
}

addForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let quantity = addForm.querySelector('#count_select').value;
    let itemTextInput = addForm.querySelector('input[type="text"]');
    let itemText = itemTextInput.value;

    createNewItem(quantity, itemText);

    addForm.reset();

    updateItemCount();
});

itemList.addEventListener('click', function (event) {
    if (event.target.matches('input[type="checkbox"]')) {
        let isChecked = event.target.checked;
        let itemId = event.target.id;
        let item = itemsArray.find(item => item.id === itemId);
        item.checked = isChecked;
        saveItemsToLocalStorage();

        if (isChecked) {
            updateCheckedCount(1);
            event.target.closest('li').querySelector('label').style.textDecoration = 'line-through';
        } else {
            updateCheckedCount(-1);
            event.target.closest('li').querySelector('label').style.textDecoration = 'none';
        }
    }
});

deleteBtn.addEventListener('click', function () {
    itemList.innerHTML = '';
    itemsArray = [];
    updateItemCount();
    countChecks.textContent = '0';
    noItemText.style.display = 'block';
    saveItemsToLocalStorage();
});

filterSelect.addEventListener('change', function () {
    let filterValue = filterSelect.value;

    if (filterValue === 'order') {
        itemsArray.sort((a, b) => a.id.localeCompare(b.id));
    } else if (filterValue === 'description') {
        itemsArray.sort((a, b) => a.text.localeCompare(b.text));
    } else if (filterValue === 'status') {
        itemsArray.sort((a, b) => a.checked - b.checked);
    }

    renderItems();
});

function renderItems() {
    itemList.innerHTML = '';

    itemsArray.forEach(item => {
        let newItem = document.createElement('li');
        newItem.innerHTML = `
      <div class="flex items-center justify-between bg-[#ffebb3] rounded-full px-6 py-3">
        <input type="checkbox" id="${item.id}" ${item.checked ? 'checked' : ''}>
        <label for="${item.id}" class="font-bold text-lg text-[#5a3e2b]">${item.quantity} ${item.text}</label>
        <div class="flex items-center">
          <button class="deleteButton text-red-500 mr-3"><i class="fas fa-times text-2xl"></i></button>
        </div>
      </div>
    `;
        itemList.appendChild(newItem);

        let deleteButton = newItem.querySelector('.deleteButton');
        deleteButton.addEventListener('click', function () {
            let index = itemsArray.findIndex(i => i.id === item.id);
            if (index !== -1) itemsArray.splice(index, 1);
            newItem.remove();
            updateItemCount();
            saveItemsToLocalStorage();

            let isChecked = newItem.querySelector('input[type="checkbox"]').checked;
            if (isChecked) {
                updateCheckedCount(-1);
            }

            if (itemList.children.length === 0) {
                noItemText.style.display = 'block';
            }
        });

        if (item.checked) {
            newItem.querySelector('label').style.textDecoration = 'line-through';
        }
    });

    updateItemCount();
    updateCheckedCount(1);
}

updateItemCount();
updateCheckedCount(1); 
