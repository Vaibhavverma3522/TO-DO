let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");

let draggedElement = null;

function createNewtask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
  `;

  column.appendChild(div);

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", function () {
    div.remove();
    countAndSaveTasks();
  });

  div.addEventListener("dragstart", function () {
    draggedElement = div;
  });
}

function countAndSaveTasks() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.innerText = tasks.length;
  });
}

tasks.forEach(function (task) {
  task.addEventListener("dragstart", function () {
    draggedElement = task;
  });
});

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));
  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      createNewtask(task.title, task.desc, column);
    });
  }
}

function addDragEventOnColumn(column) {
  column.addEventListener("dragenter", function (e) {
    e.preventDefault();
    this.classList.add("hover-over");
  });
  column.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.classList.remove("hover-over");
  });
  column.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  column.addEventListener("drop", function (e) {
    e.preventDefault();
    if (!draggedElement) return;
    column.appendChild(draggedElement);
    column.classList.remove("hover-over");
    countAndSaveTasks();
  });
}

addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

const toggleModal = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskButton = document.querySelector("#add-new-task");

toggleModal.addEventListener("click", function (e) {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", function () {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", function () {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-title-description").value;
  createNewtask(taskTitle, taskDesc, todo);
  countAndSaveTasks();
  modal.classList.remove("active");
});
