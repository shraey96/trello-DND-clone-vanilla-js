export const addEventListenersToElements = (
  elements = [],
  eventName,
  callback
) => {
  Array.from(elements)?.forEach((element) => {
    element.addEventListener(eventName, callback);
  });
};

export const isEmpty = (value) => {
  if (typeof value === "undefined" || value === null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  if (typeof value === "string" && value === "") return true;
  return false;
};

export const itemOnDragStart = (element) =>
  element.classList.add("task-item--is-dragging");

export const itemOnDragEnd = (element) =>
  element.classList.remove("task-item--is-dragging");

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
