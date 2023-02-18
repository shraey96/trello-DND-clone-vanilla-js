import {
  addEventListenersToElements,
  itemOnDragStart,
  itemOnDragEnd,
  insertItemInList,
  isEmpty,
  attachCloseBtnEventListener,
  attachAddBtnListener,
} from "./utils.js";

const LOCAL_STORAGE_KEY = "lists_and_tasks";

/**
 * @function createAndAddTask
 * @param {object} payload
 * @param {string} list
 *
 * @description creates and new task and adds it to the DOM, and attaches needed eventlisteners for the same
 */
export const createAndAddTask = (payload = {}, list) => {
  const elementToInsertTaskTo =
    document.querySelector(`.list-item[data-list-type="${list}"]`) ||
    document.querySelector(".list-item");

  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task-item");
  taskDiv.setAttribute("draggable", true);

  const taskHeader = document.createElement("p");
  taskHeader.innerText = payload.taskTitle;
  taskHeader.classList.add("task-item__title");

  const taskDesc = document.createElement("p");
  taskDesc.innerText = payload.taskDesc;
  taskDesc.classList.add("task-item__desc");

  const taskCloseBtn = document.createElement("span");
  taskCloseBtn.innerText = "x";
  taskCloseBtn.classList.add("close-btn");
  taskCloseBtn.setAttribute("data-close-type", "task");

  taskDiv.appendChild(taskHeader);
  taskDiv.appendChild(taskDesc);
  taskDiv.appendChild(taskCloseBtn);

  addEventListenersToElements([taskDiv], "dragstart", (e) =>
    itemOnDragStart(e.target)
  );
  addEventListenersToElements([taskDiv], "dragend", (e) =>
    itemOnDragEnd(e.target)
  );

  attachCloseBtnEventListener([taskCloseBtn]);

  elementToInsertTaskTo.appendChild(taskDiv);
};

/**
 * @function creatcreateAndAddListeAndAddTask
 * @param {string} title
 *
 * @description creates and new list and adds it to the DOM, and attaches needed eventlisteners for the same
 */
export const createAndAddList = (title) => {
  const escapedListTitle = title.replaceAll(" ", "");

  const listItemDiv = document.createElement("div");
  listItemDiv.classList.add("list-item");
  listItemDiv.setAttribute("data-list-type", escapedListTitle);

  const listHeader = document.createElement("h3");
  listHeader.classList.add("list-item__heading");
  listHeader.innerText = title;

  const addBtn = document.createElement("button");
  addBtn.classList.add("add-btn", "list-item__add-task-btn");
  addBtn.setAttribute("data-add-type", "task");
  addBtn.innerText = "+";

  const listCloseBtn = document.createElement("span");
  listCloseBtn.innerText = "x";
  listCloseBtn.classList.add("close-btn");
  listCloseBtn.setAttribute("data-close-type", "list");

  listItemDiv.appendChild(listHeader);
  listItemDiv.appendChild(addBtn);
  listItemDiv.appendChild(listCloseBtn);

  document.querySelector(".lists-container").appendChild(listItemDiv);

  attachCloseBtnEventListener([listCloseBtn]);
  attachAddBtnListener([addBtn]);

  addEventListenersToElements([listItemDiv], "dragover", insertItemInList);
};

/**
 On refresh of page, scrape DOM and build an array of list and its task to save to localStorage
 */
addEventListenersToElements([window], "beforeunload", () => {
  const storagePayload = [];
  Array.from(document.querySelectorAll(".list-item")).forEach((listItem) => {
    const data = { items: [] };
    const listName = listItem.querySelector(".list-item__heading");
    data.listName = listName.innerText;

    const taskItems = listItem.querySelectorAll(".task-item");

    taskItems.forEach((taskItem) => {
      const task = {
        title: taskItem.querySelector(".task-item__title").innerText,
        desc: taskItem.querySelector(".task-item__desc").innerText,
        listId: data.listName?.replaceAll(" ", ""),
      };
      data.items.push(task);
    });
    storagePayload.push(data);
  });

  if (!isEmpty(storagePayload)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storagePayload));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
});

/**
 On load of page, retrieve array of lists and its task and add to DOM
 */
window.onload = () => {
  const listsFromLocalStorage =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

  listsFromLocalStorage.forEach((listItem) => {
    createAndAddList(listItem.listName);
    if (!isEmpty(listItem.items)) {
      listItem.items.forEach((item) => {
        createAndAddTask(
          { taskTitle: item.title, taskDesc: item.desc },
          item.listId
        );
      });
    }
  });
};
