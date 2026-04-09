const State = require('../models/State');

// ✅ CREATE
exports.createState = async (req, res) => {
  try {
    const newState = new State(req.body);
    const savedState = await newState.save();
    res.status(201).json(savedState);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ READ ALL
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find().sort({ createdAt: -1 });
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE
exports.updateState = async (req, res) => {
  try {
    const updatedState = await State.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedState) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.json(updatedState);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ DELETE
exports.deleteState = async (req, res) => {
  try {
    const deleted = await State.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.json({ message: 'State deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};