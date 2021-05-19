const mongoose = require('mongoose');
const db = require('./index');

const appSchema = new mongoose.Schema({
  name: String,
});

const App = mongoose.model('App', appSchema);

const getApps = async () => {
  try {
    const apps = await App.find();
    return apps;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getAppById = async (id) => {
  try {
    const app = await App.findById(id);
    console.log('hello app');
    return app;
  } catch (error) {
    console.log('hello eorror', error);
    return { id: null, name: null };
  }
};

const setApp = async (app) => {
  const newApp = new App(app);
  try {
    const savedApp = newApp.save();
    return savedApp;
  } catch (error) {
    console.log(error);
    return {};
  }
};


module.exports = {
  getAppById,
  getApps,
  setApp,
}