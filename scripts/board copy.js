import {
  addEventListenersToElements,
  itemOnDragStart,
  itemOnDragEnd,
  insertItemInList,
  isEmpty,
} from "./utils.js";

const addBtns = document.querySelectorAll(".add-btn");
const cloaseBtns = document.querySelectorAll(".close-btn");
const formCloseBtn = document.querySelector(".close-btn--form");
const taskFormContainer = document.querySelector(".task-form-container");
const taskForm = document.querySelector("form");
const taskFormTitleInput = document.querySelector("#task-title-input");
const taskFormDescInput = document.querySelector("#task-desc-input");
const listFormTitleInput = document.querySelector("#list-title-input");

const createAndAddTask = (payload = {}, list) => {
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

const createAndAddList = (title) => {
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

  attachCloseBtnEventListener([listCloseBtn]);

  document.querySelector(".lists-container").appendChild(listItemDiv);

  addEventListenersToElements([listItemDiv], "dragover", insertItemInList);

  addEventListenersToElements([addBtn], "click", attachAddBtnListener);
};

const clearFormDataAttributes = () => {
  taskForm.removeAttribute("data-form-type");
  taskForm.removeAttribute("data-form-list");
};

const attachCloseBtnEventListener = (nodes = []) => {
  addEventListenersToElements(nodes, "click", (e) => {
    const isListClose = e.target.dataset.closeType === "list";
    const isTaskClose = e.target.dataset.closeType === "task";
    if (isListClose) {
      e.target.closest(".list-item")?.remove();
    }
    if (isTaskClose) {
      e.target.closest(".task-item")?.remove();
    }
  });
};

const attachAddBtnListener = (e) => {
  const closestList = e.target.closest(".list-item");
  if (closestList) {
    taskForm.setAttribute(
      "data-form-list",
      closestList.getAttribute("data-list-type")
    );
  }
  const addType = e.target.dataset?.addType;
  if (addType === "task") {
    document.querySelector("#task-title-input").focus();
  }
  if (addType === "list") {
    document.querySelector("#list-title-input").focus();
  }
  taskForm.setAttribute("data-form-type", addType);
  taskFormContainer.classList.add("task-form-container--visible");
};

addEventListenersToElements(addBtns, "click", (e) => {
  attachAddBtnListener(e);
});

addEventListenersToElements([formCloseBtn], "click", () => {
  taskFormContainer.classList.remove("task-form-container--visible");
  clearFormDataAttributes();
});

addEventListenersToElements([taskForm], "submit", (e) => {
  e.preventDefault();
  const isTaskForm = e.target.dataset.formType === "task";
  const isListForm = e.target.dataset.formType === "list";

  if (isTaskForm) {
    const taskTitle = taskFormTitleInput.value;
    const taskDesc = taskFormDescInput.value;

    if (!taskTitle || !taskDesc) return;

    createAndAddTask({ taskTitle, taskDesc }, e.target.dataset.formList);
    taskFormTitleInput.value = "";
    taskFormDescInput.value = "";
  }

  if (isListForm) {
    const listTitle = listFormTitleInput.value;
    if (!listTitle) return;
    createAndAddList(listTitle);
    listFormTitleInput.value = "";
  }

  clearFormDataAttributes();

  taskFormContainer.classList.remove("task-form-container--visible");
});

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
    localStorage.setItem("lists_and_tasks", JSON.stringify(storagePayload));
  }
});

attachCloseBtnEventListener(cloaseBtns);

window.onload = () => {
  const listsFromLocalStorage =
    JSON.parse(localStorage.getItem("lists_and_tasks")) || [];

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
