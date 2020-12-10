const { remote } = require('electron');

const tasksService = remote.require('./database/models/Task');

const $newTaskForm = document.getElementById('new-task-form');
const $tableBody = document.getElementById('table-body');

async function createTask() {
  try {
    const description = $newTaskForm['description'].value;
    await tasksService.createTask(description);
    getTasks();
  } catch (error) {
    console.error(error);
  } finally {
    console.log('done');
  }
}

async function getTasks() {
  const tasks = await tasksService.getAllTasks();
  $tableBody.innerHTML = '';
  tasks.forEach((task) => {
    $tableBody.innerHTML += `
      <tr>
        <td>${task.id}</td>
        <td>${task.description}</td>
        <td>${task.done}</td>
      </tr>
    `;
  });
}

window.addEventListener('load', getTasks);

$newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  createTask();
});
