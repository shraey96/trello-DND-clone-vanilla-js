import {
  addEventListenersToElements,
  attachAddBtnListener,
  attachCloseBtnEventListener,
} from "./utils.js";
import { createAndAddTask, createAndAddList } from "./board.js";

const addBtns = document.querySelectorAll(".add-btn");
const closeBtns = document.querySelectorAll(".close-btn");
const formCloseBtn = document.querySelector(".close-btn--form");
const taskFormContainer = document.querySelector(".task-form-container");
const taskForm = document.querySelector("form");
const taskFormTitleInput = document.querySelector("#task-title-input");
const taskFormDescInput = document.querySelector("#task-desc-input");
const listFormTitleInput = document.querySelector("#list-title-input");

/**
 * @function clearFormDataAttributes
 *
 * @description removes form data attributes which were being used to identify formType and formList
 * @returns {boolean}
 */
const clearFormDataAttributes = () => {
  taskForm.removeAttribute("data-form-type");
  taskForm.removeAttribute("data-form-list");
};

/**
 adds sumbit event listener to form, and adds task or list accordingly
 */
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

/**
 adds click event listener to form close btn to close form
 */
addEventListenersToElements([formCloseBtn], "click", () => {
  taskFormContainer.classList.remove("task-form-container--visible");
  clearFormDataAttributes();
});

attachAddBtnListener(addBtns);
attachCloseBtnEventListener(closeBtns);
