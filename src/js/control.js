"use strict";

// Elements

const containerApp = document.querySelector(".app");
const btnAdd = document.querySelector(".btn-add");
const inputTaskTitle = document.querySelector(".input-add-task");
const containerTasks = document.querySelector(".tasks");
const countTask = document.querySelector(".count-task");
const overlay = document.querySelector(".overlay");
const modalEdit = document.querySelector(".modal-edit");
const inputEditModal = document.querySelector(".input-edit-task");
const errMessage = document.getElementById("message-error");
const btnCancelModal = document.querySelector(".cancel-edit");
const btnCloseModal = document.querySelector(".icon-close-modal");
const btnSubmitEdit = document.querySelector(".submit-edit");

// Application data
const state = { tasksList: [], pendingTasks: 0, editTarget: null };

const saveTasksToLocal = function () {
  localStorage.setItem("tasks", JSON.stringify(state.tasksList));
};

const loadTasksFromLocal = function () {
  const tasksData = localStorage.getItem("tasks");

  if (!tasksData) return;

  state.tasksList = JSON.parse(tasksData);
  renderTasks();
};

const showError = function () {
  errMessage.classList.remove("hidden");

  setTimeout(() => errMessage.classList.add("hidden"), 3000);
};

const addTask = function () {
  const title = inputTaskTitle.value;

  if (!title) return showError();

  const id = Date.now();
  const objTask = {
    id,
    title,
    completed: false,
  };

  state.tasksList.push(objTask);
  renderTasks();
  inputTaskTitle.value = "";
  saveTasksToLocal();
};

const renderTasks = function (tasks = state.tasksList) {
  const markup = tasks
    .map(
      (task) => `<div id="${task.id}" class="task ${
        task.completed ? "completed" : ""
      }">
              <input type="checkbox" class="task-check" />
              <span class="taskname">${task.title}</span>
              <button class="edit-task">
                <box-icon
                  type="solid"
                  color="#fff"
                  name="message-square-edit"
                ></box-icon>
              </button>
              <button class="delete-task">
                <box-icon type="solid" color="#fff" name="trash"></box-icon>
              </button>
            </div>`
    )
    .join("");

  renderSpinner();
  containerTasks.innerHTML = "";
  containerTasks.insertAdjacentHTML("beforeend", markup);
  state.pendingTasks = state.tasksList.filter((task) => !task.completed).length;
  countTask.textContent = state.pendingTasks;
};

const deleteTask = function (e) {
  const btnDelete = e.target.closest(".delete-task");

  if (!btnDelete) return;

  const parentTask = btnDelete.closest(".task");
  const targetTask = findTask(parentTask);
  const targetIndex = state.tasksList.indexOf(targetTask);
  state.tasksList.splice(targetIndex, 1);
  renderTasks();
  saveTasksToLocal();
};

const showEditModal = function (e) {
  const btnEdit = e.target.closest(".edit-task");

  if (!btnEdit) return;

  state.editTarget = btnEdit.closest(".task");
  overlay.classList.remove("hidden");
  inputEditModal.value =
    state.editTarget.querySelector(".taskname").textContent;
  inputEditModal.focus();
};

const editTask = function () {
  if (!inputEditModal.value) return;

  const targetTask = findTask(state.editTarget);
  targetTask.title = inputEditModal.value;
  renderTasks();
  overlay.classList.add("hidden");
  saveTasksToLocal();
};

const markTask = function (e) {
  const targetInp = e.target.closest(".task-check");

  if (!targetInp) return;

  const parentTask = targetInp.parentElement;
  const targetTask = findTask(parentTask);
  targetInp.disabled = targetTask.completed = true;
  renderTasks();
  saveTasksToLocal();
};

const findTask = function (parentTask) {
  const taskId = +parentTask.getAttribute("id");
  return state.tasksList.find((task) => task.id === taskId);
};

const closeEditModal = function () {
  [btnCloseModal, btnCancelModal].forEach((btn) =>
    btn.addEventListener("click", () => overlay.classList.add("hidden"))
  );

  inputEditModal.value = "";
  state.editTarget = null;
};

const renderSpinner = function () {
  const spinnerEl = `<span class="loader"></span>`;

  containerTasks.innerHTML = "";
  containerTasks.insertAdjacentHTML("beforeend", spinnerEl);
};

// App Initialization

const init = function () {
  btnAdd.addEventListener("click", addTask);
  containerApp.addEventListener("click", deleteTask);
  containerApp.addEventListener("click", showEditModal);
  containerApp.addEventListener("click", markTask);
  btnSubmitEdit.addEventListener("click", editTask);
  window.addEventListener("load", loadTasksFromLocal);
  closeEditModal();
};

init();
