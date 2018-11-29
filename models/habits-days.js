
"use strict";

const mongoose = require("mongoose");

const daySchema = mongoose.Schema({
  date: { type: Date, required: true },
  habits: [
    {
      habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
      checked: Boolean
    }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const habitSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})






const Habit = mongoose.model("Habit", habitSchema);
const Day = mongoose.model("Day", daySchema);

module.exports = { Day, Habit };