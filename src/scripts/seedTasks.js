// node src/scripts/seedTasks.js

const Task = require('../database/models/Task');

const tasksMock = [
  { description: 'Learn Python' },
  { description: 'Learn JavaScript' },
  { description: 'Learn Visual Basic' },
  { description: 'Make a Server with JAVA', done: true },
  { description: 'Go to the market' },
  { description: 'Read all the books' },
  { description: 'Create an ecommerce', done: true },
];

(async () => {
  await Task.sync();
  const createPromises = tasksMock.map(Task.create);
  await Promise.all(createPromises);
  console.log('tasks created successfully');
})();
