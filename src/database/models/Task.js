const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

async function getAllTasks() {
  await Task.sync();
  return await Task.findAll();
}

async function createTask(description, done = false) {
  await Task.sync();
  return await Task.create({ description, done });
}

async function updateTask(id, description, done) {
  await Task.sync();
  return await Task.update({ description, done }, { where: { id } });
}

async function deleteTask(id) {
  await Task.sync();
  return await Task.destroy({ where: { id } });
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
