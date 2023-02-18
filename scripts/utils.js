/**
~~~~~~~~~~~~~~~~~~~ GENERIC UTILS ~~~~~~~~~~~~~~~~~~~
 */

/**
 * @function addEventListenersToElements
 * @param {array} elements
 * @param {string} eventName
 * @param {function} callback
 *
 * @description Attaches event listeners on a list of elements, given an eventName, and runs the provided callback for it
 * @returns {boolean}
 */
export const addEventListenersToElements = (
  elements = [],
  eventName,
  callback
) => {
  Array.from(elements)?.forEach((element) => {
    element.addEventListener(eventName, callback);
  });
};

/**
 * @function isEmpty
 * @param {any} value
 *
 * @description Returns boolean depending on if value is empty or not
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (typeof value === "undefined" || value === null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  if (typeof value === "string" && value === "") return true;
  return false;
};

/**
~~~~~~~~~~~~~~~~~~~ DRAG HELPER UTILS ~~~~~~~~~~~~~~~~~~~
 */

/**
 * @function itemOnDragStart
 * @param {object} element
 *
 * @description helper util to mark item as dragging
 * @returns {boolean}
 */
export const itemOnDragStart = (element) =>
  element.classList.add("task-item--is-dragging");

/**
 * @function itemOnDragEnd
 * @param {object} element
 *
 * @description helper util to mark item as not dragging
 * @returns {boolean}
 */
export const itemOnDragEnd = (element) =>
  element.classList.remove("task-item--is-dragging");

/**
 * @function getTaskToInsertAbove
 * @param {string} listItem
 * @param {number} clientY
 *
 * @description returns closest element below the mouseY, so that we can insert the dragged element above it
 * @returns {object}
 */
export const getTaskToInsertAbove = (listItem, clientY) => {
  const nonDraggingTasksForList = listItem.querySelectorAll(
    ".task-item:not(.task-item--is-dragging)"
  );
  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;
  Array.from(nonDraggingTasksForList).forEach((nonDraggingTask) => {
    const boundingRects = nonDraggingTask.getBoundingClientRect();
    const offset = clientY - boundingRects.top;
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = nonDraggingTask;
    }
  });
  return closestTask;
};

/**
 * @function insertItemInList
 * @param {object} e
 *
 * @description helper util to append or insertbefore a dragging card, to a new list (or re-arranging in same list)
 */
export const insertItemInList = (e) => {
  e.preventDefault();
  const listItem = e.currentTarget;
  const taskToInsertAbove = getTaskToInsertAbove(listItem, e.clientY);
  const currentDraggingTask = document.querySelector(".task-item--is-dragging");
  if (taskToInsertAbove) {
    listItem?.insertBefore(currentDraggingTask, taskToInsertAbove);
  } else {
    listItem?.appendChild(currentDraggingTask);
  }
};

/**
~~~~~~~~~~~~~~~~~~~ FORM HELPER UTILS ~~~~~~~~~~~~~~~~~~~
 */

/**
 * @function attachCloseBtnEventListener
 * @param {array} nodes
 *
 * @description attaches 'click' eventlistener to nodes list, which is used for removing task or list
 */
export const attachCloseBtnEventListener = (nodes = []) => {
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

/**
 * @function attachAddBtnListener
 * @param {array} nodes
 *
 * @description attaches 'click' eventlistener to nodes list, which is used for opening add form for task or list
 */
export const attachAddBtnListener = (nodes = []) => {
  addEventListenersToElements(nodes, "click", (e) => {
    const closestList = e.target.closest(".list-item");
    const taskForm = document.querySelector("form");
    if (closestList) {
      taskForm.setAttribute(
        "data-form-list",
        closestList.getAttribute("data-list-type")
      );
    }
    const addType = e.target.dataset?.addType;
    taskForm.setAttribute("data-form-type", addType);
    document
      .querySelector(".task-form-container")
      .classList.add("task-form-container--visible");
    if (addType === "task") {
      document.querySelector("#task-title-input").focus();
    }
    if (addType === "list") {
      document.querySelector("#list-title-input").focus();
    }
  });
};
