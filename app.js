//Item  Controller
const ItemCtrl = (function () {
  //item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //Data structure / state of the application, all the data components of the application
  const data = {
    items: [
      { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };
  return {
    //Gets data(the data structure with the data on the page)
    logData: function () {
      return data;
    },
    getItems: function () {
      //gets items in data
      return data.items;
    },
    addItem: function (name, calories) {
      //assigns id to a new items and adds it to the items object
      //create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1; //since arrays start at zero, this maps to the last item in the array
      } else ID = 0;

      //calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);
      //push new item into array of items in data
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function () {
      //gets total calories from all individual items already in the data structure and new ones to be added...it is called in app init
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      //set total to a property in the data structure
      data.totalCalories = total;
      return total;
    },
    getItemById: function (id) {
      //gets item by the id it has
      //this loops through items in the array
      let found = null;
      //loop through items
      data.items.forEach((item) => {
        //for each item in the list of items
        if (item.id == id) {
          found = item; //change value of found to current item if the id matches the id passed in
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      //sets item passed to it as the current Item property in data..
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calories) {
      //parse calories to number
      calories = parseInt(calories); //it has to be converted to a number, since its from user input

      let found = null;

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
  };
})();

//UI Controller
const UICtrl = (function () {
  //pointers to ui elements on the page
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-meal",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    listItems: "#item-list li",
  };
  return {
    populateItemList: function (items) {
      //for each item in the items array it adds an element to the itemList ui element
      //this adds elements to the page, it loops through all the items object and breaks it down into the output on each iteration..
      let html = "";
      items.forEach(function (item) {
        html += `
        <li class="collection-item" id="${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });
      //insert list items into html into the element in the ui
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    /////todo try using revealed module pattern to implement this below
    //-------------------------
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
    },
    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
    },
    getUISelectors: function () {
      //makes UIselectors available for use outside where its defined inside the closure
      return UISelectors;
      //-------------------------
    },
    getItemInput: function () {
      //returns an object with the value passed in the input form
      //this returns the values passed into the meal and calorie forms
      return {
        name: document.querySelector(UISelectors.itemNameInput).value, //this returns the value passed in the meal form
        calories: document.querySelector(UISelectors.itemCaloriesInput).value, //this returns the value  passed in the calories form
      };
    },
    addListItem: function (item) {
      //add item passed in to the list in the ui
      //show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      //create li element
      const li = document.createElement("li");
      //add class
      li.className = "collection-item";
      //add id
      li.id = `item-${item.id}`;
      //add html to the dom
      li.innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
      `;
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function () {
      //clears the input field
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function () {
      //hide item from  the list when it is empty
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      //show total number of calories to the ui
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    addItemToForm: function () {
      //makes current item appear on the form input
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn list into an array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#item-${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
  };
})();

//App Controller
//This is where the app is to be built  and run from here
const App = (function (ItemCtrl, UICtrl) {
  //load event listeners
  const loadEventListeners = function () {
    //this calls the event listeners for the buttons in the ui
    //get ui selectors
    const UISelectors = UICtrl.getUISelectors();
    //add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit); //event listener for add button, it triggers the itemAddSubmit function when called

    //disable submit on enter
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });

    //edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    //update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
  };

  const itemAddSubmit = function (e) {
    //this gets input on submit and makes sure it is not empty, else returns a prompt
    e.preventDefault(); //*this works anywhere in the function...
    const input = UICtrl.getItemInput();

    //check if fields have input
    if (input.name !== "" && input.calories !== "") {
      //add item
      const NewItem = ItemCtrl.addItem(input.name, input.calories);
      //add item to ui
      UICtrl.addListItem(NewItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //clear Input
      UICtrl.clearInput();
    } else alert("please fill in the appropriate fields");
  };

  const itemEditClick = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      //this specifically targets the edit icon in each of the collection items, since the cant be targeted directly

      //get list item id
      const Id = e.target.parentNode.parentNode.id;

      //get item to edit
      const itemToEdit = ItemCtrl.getItemById(Id);

      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();
    }
  };

  const itemUpdateSubmit = function (e) {
    e.preventDefault();

    //get input
    const input = UICtrl.getItemInput();

    //update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //update UI
    UICtrl.updateListItem(updatedItem);
    
  };
  //functions called here for the functions passed as argument, are declared in their returned objects(since they are declared public)
  return {
    init: function () {
      //clear all items and add a new item
      UICtrl.clearEditState();

      //this is called first when the app is run or refreshed, it populates the ui with data passed, and calls all event listeners
      //fetches data from data structure
      const items = ItemCtrl.getItems();

      //check if any items listed
      if (items.length === 0) {
        UICtrl.hideList();
      } else UICtrl.populateItemList(items);
      //populate list with items in data
      UICtrl.populateItemList(items);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // add total calories to ui
      UICtrl.showTotalCalories(totalCalories);
      //load all event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

//Storage Controller
const Storage = function () {};

App.init(); //calls init
