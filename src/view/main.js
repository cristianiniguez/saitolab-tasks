const { remote } = require('electron');
const tasksService = remote.require('./database/models/Task');

// global variables

let updateState = null;

// elements

const $newTaskForm = document.getElementById('new-task-form');
const $tableTasks = document.getElementById('table-tasks');

// functions

async function saveTask() {
  const description = $newTaskForm['description'].value;
  if (!updateState) {
    try {
      await tasksService.createTask(description);
      await getTasks();
      $newTaskForm.reset();
    } catch (error) {
      console.error(error);
    } finally {
      console.log('done');
    }
  } else {
    try {
      const { id, done } = updateState;
      await tasksService.updateTask(id, description, done);
      await getTasks();
      updateState = null;
      $newTaskForm.reset();
    } catch (error) {
      console.error(error);
    } finally {
      console.log('done');
    }
  }
}

async function doneTask(id, description, done) {
  try {
    await tasksService.updateTask(id, description, done);
    await getTasks();
  } catch (error) {
    console.error(error);
  } finally {
    console.log('done');
  }
}

async function deleteTask(id) {
  const confirmation = confirm('Are you sure you want to delete this task');
  if (confirmation) {
    try {
      await tasksService.deleteTask(id);
      await getTasks();
    } catch (error) {
      console.error(error);
    } finally {
      console.log('done');
    }
  }
}

async function getTasks() {
  const tasks = await tasksService.getAllTasks();
  const $tableBody = $tableTasks.querySelector('tbody');
  $tableBody.innerHTML = '';
  tasks.forEach((task) => {
    $tableBody.innerHTML += `
      <tr>
        <td>${task.id}</td>
        <td>${task.description}</td>
        <td>
          <input
            class="chb-done"
            type="checkbox"
            ${task.done ? 'checked' : ''}
            data-id="${task.id}"
            data-description="${task.description}"
          >
        </td>
        <td>
          <div class="btn-group">
            <button
              class="btn btn-mini btn-default btn-update"
              data-id="${task.id}"
              data-description="${task.description}"
              data-done="${task.done}"
            ><span class="icon icon-pencil"></span></button>
            <button
              class="btn btn-mini btn-default btn-delete"
              data-id="${task.id}"
            ><span class="icon icon-trash"></span></button>
          </div>
        </td>
      </tr>
    `;
  });
  setClickEvents();
}

function setClickEvents() {
  $tableTasks.querySelectorAll('.chb-done').forEach(($chb) => {
    $chb.addEventListener('change', (e) => {
      const {
        checked: done,
        dataset: { id, description },
      } = e.target;
      doneTask(id, description, done);
    });
  });
  $tableTasks.querySelectorAll('.btn-update').forEach(($btn) => {
    const { id, description, done } = $btn.dataset;
    $btn.addEventListener('click', () => {
      updateState = { id, description, done };
      $newTaskForm['description'].value = description;
    });
  });
  $tableTasks.querySelectorAll('.btn-delete').forEach(($btn) => {
    const { id } = $btn.dataset;
    $btn.addEventListener('click', () => {
      deleteTask(id);
    });
  });
}

// events

window.addEventListener('load', getTasks);

$newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveTask();
});
