const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const bAdd = document.querySelector("#tAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");

renderTime();
renderTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value !== "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3), // Generar un ID único
    title: value, // Título de la tarea
    completed: false, // Estado de completado
  };
  tasks.unshift(newTask); // Agregar la nueva tarea al inicio
}

function renderTasks() {
  const html = tasks.map((task) => {
    return `
      <div class="task">
        <div class="completed">${
          task.completed
            ? `<span class="done">Done</span>`
            : `<button class="start-button" data-id="${task.id}">Start</button>`
        }</div>
        <div class="title">${task.title}</div>   
      </div>
    `;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button");

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = button.getAttribute("data-id"); // Obtener el ID de la tarea

      if (!timer && id) {
        // Solo iniciar si no hay un temporizador activo
        startButtonHandler(id); // Pasar el ID de la tarea
        button.textContent = "in progress..."; // Actualizar el texto del botón
      }
    });
  });
}

function startButtonHandler(id) {
  time = 25 * 60; // Establecer el tiempo a 25 minutos (aquí es 5 para prueba)
  current = id; // Guardar el ID de la tarea actual
  const taskIndex = tasks.findIndex((task) => task.id === id);

  taskName.textContent = tasks[taskIndex].title; // Mostrar el nombre de la tarea
  renderTime();
  timer = setInterval(() => {
    timeHandler(id); // Llamar al manejador del tiempo cada segundo
  }, 1000);
}

function timeHandler(id) {
  time--;
  renderTime(); // Actualizar la interfaz con el tiempo restante

  if (time === 0) {
    clearInterval(timer); // Detener el temporizador
    markCompleted(id); // Marcar la tarea como completada
    timer = null;
    renderTasks(); // Renderizar nuevamente las tareas
    startBreak(); // Iniciar el descanso
  }
}

function startBreak() {
  time = 5 * 60; // Establecer el tiempo de descanso (aquí es 3 para prueba)
  taskName.textContent = "Break Time"; // Mostrar el nombre de la tarea
  renderTime();
  timerBreak = setInterval(() => {
    breakHandler(); // Llamar al manejador del descanso cada segundo
  }, 1000);
}

function breakHandler() {
  time--;
  renderTime(); // Actualizar la interfaz con el tiempo restante

  if (time === 0) {
    clearInterval(timerBreak); // Detener el temporizador
    current = null; // Limpiar la tarea actual
    timerBreak = null;
    taskName.textContent = ""; // Limpiar el nombre de la tarea después del descanso
    renderTasks(); // Renderizar nuevamente las tareas
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`; // Formato de minutos y segundos
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true; // Marcar la tarea como completada
  }
}
