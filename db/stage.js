const mongoose = require('mongoose');
const db = require('./index');

const stagesSchema = new mongoose.Schema({
  name: String,
});

const Stage = mongoose.model('Stage', stagesSchema);

const getStages = async () => {
  try {
    const stages = await Stage.find();
    return stages;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getStageById = async (id) => {
  try {
    const stage = await Stage.findById(id);
    return stage;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getStageByName = async (name) => {
  try {
    const stage = await Stage.findOne({ name, });
    if (stage) { return stage; }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

const addStage = async (stage) => {
  const newStage = new Stage(stage);
  try {
    const savedStage = newStage.save();
    return savedStage;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const deleteStage = async (id) => {
  try {
    const deletedStage = await Stage.findByIdAndDelete(id);
    return deletedStage;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const updateStage = async (id, stage) => {
  try {
    const options = {
      upsert: true,
      new: true,
    };
    const updatedStage = await Stage.findOneAndUpdate({ _id: id }, stage, options);
    console.log(stage);
    return updatedStage;
  } catch (error) {
    console.log(error);
    return {};
  }
};


module.exports = {
  getStages,
  getStageById,
  getStageByName,
  addStage,
  deleteStage,
  updateStage,
};