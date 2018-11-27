
"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a restaurant
const daySchema = mongoose.Schema({
  date: {type : Date, required: true, unique: true},
  habits: [
      {
        habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit'},
        
        checked: Boolean
      }
  ]
});

const habitSchema = mongoose.Schema({
    name: {type : String, required: true, unique: true}
})
 





const Habit = mongoose.model("Habit", habitSchema);
const Day = mongoose.model("Day", daySchema);

module.exports = { Day, Habit };