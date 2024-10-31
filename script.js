const inputBox = document.getElementById("input-task");
const sendBtn = document.querySelector(".send-btn");
const removeTaskBtn = document.querySelector(".remove-btn");
const tasksContainer = document.querySelector(".tasks");

const uploadStorage = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = function () {
  if (localStorage.key("tasks"))
    return JSON.parse(localStorage.getItem("tasks"));
};
const tasks = loadTasks() ? loadTasks() : [];
console.log(tasks);
const removeTask = function () {
  const taskInfo = this.closest(".task").querySelector(".task-info").innerHTML;
  this.closest(".task").remove();
  const index = tasks.findIndex((task) => taskInfo === task.info);
  tasks.splice(index, 1);
  uploadStorage();
};

const addListenersToAll = function () {
  document
    .querySelectorAll(".remove-btn")
    .forEach((btn) => btn.addEventListener("click", removeTask));
};

const displayTasks = function (tasks) {
  tasksContainer.innerHTML = "";
  if (!tasks) return;
  tasks.forEach((task, i) => {
    const html = `
    <div class="task">
        <label class="checkbox-container">
            <input type="checkbox" />
            <span class="checkmark"></span>
            <p class="task-info">${task.info}</p>
        </label>
        <i class="fa-solid fa-trash-can remove-btn"></i>
    </div>
  `;
    tasksContainer.insertAdjacentHTML("beforeend", html);
  });
  tasksContainer.querySelectorAll(".task").forEach((task, i) => {
    const input = task.querySelector("input");
    if (tasks[i].state === "completed") input.checked = true;
    addListenersToAll();
  });
};
displayTasks(tasks);

const addTask = function () {
  const task = inputBox.value;
  if (!task) {
    alert(`Add Task Details`);
    return;
  }
  const taskObj = {
    state: "not completed",
    info: `${task}`,
  };
  tasks.push(taskObj);
  inputBox.value = "";
  const html = `
    <div class="task">
        <label class="checkbox-container">
            <input type="checkbox" />
            <span class="checkmark"></span>
            <p class="task-info">${task}</p>
        </label>
        <i class="fa-solid fa-trash-can remove-btn"></i>
    </div>
  `;
  tasksContainer.insertAdjacentHTML("afterbegin", html);
  tasksContainer
    .querySelector(".task")
    .querySelector(".remove-btn")
    .addEventListener("click", removeTask);
  uploadStorage();
};

sendBtn.addEventListener("click", addTask);

inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

tasksContainer.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target.closest(".checkbox-container");
  if (!target) return;
  const checkbox = target.querySelector("input");
  const taskContainer = target.closest(".task");
  const taskInfo = taskContainer.querySelector(".task-info").innerHTML;
  const taskIndex = tasks.findIndex((task) => task.info === taskInfo);
  console.log(tasks);

  if (checkbox.checked) {
    checkbox.checked = false;
    tasksContainer.insertAdjacentElement("afterbegin", taskContainer);
    tasks.at(taskIndex).state = "not completed";
    const [task] = tasks.splice(taskIndex, 1);
    tasks.unshift(task);
  } else {
    checkbox.checked = true;
    tasksContainer.insertAdjacentElement("beforeend", taskContainer);
    tasks.at(taskIndex).state = "completed";
    const [task] = tasks.splice(taskIndex, 1);
    tasks.push(task);
  }
  console.log(tasks);

  uploadStorage();
});
