const express = require('express');
const router = express.Router();
const passport = require('passport')
const { Day, Habit } = require('../models/habits-days');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
    let userId = req.user.id
    Day.find({userId: userId})
        .populate('habits.habit')
        .then(data => {
            console.log(data)
            res.json(data)
        })
        .catch(err => {
            next(err)
        })

})

router.get('/names', (req, res, next) => {
    let userId = req.user.id
    Habit.find({userId : userId})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            next(err)
        })
})

router.post('/', (req, res, next) => {
    let userId = req.user.id
    const {name} = req.body
    if (!name) {
        const err = new Error('Missing `name` in request body');
        err.status = 400;
        return next(err);
      }
    let newHabitResult;
    const newHabit = { name: req.body.name, userId: req.user.id }
    
    
    Habit.create(newHabit)
        .then(result => {
            newHabitResult = result
            console.log('newHabitResult:', newHabitResult)
            Day.find({userId : userId})
                .populate('habits.habit')
                .then(_results => {
                    let results = _results;
                    results = results.forEach(day => {
                        day.habits.push({ checked: false, habit: newHabitResult._id.toString() })
                        day.save()
                    })
                    Promise.resolve()
                })
                .then(() => {
                    res.status(201).json(newHabitResult)
                })
        })
        .catch(err => {
            next(err)
        })
})

router.delete('/:id', (req, res, next) => {
    const userId = req.user.id
    const habitId = req.params.id
    Habit.findOneAndRemove({_id : habitId, userId : userId})
        .then(() => {
            Day.find({userId : userId})
                .then(results => {
                    console.log(results)
                    results.forEach(_day => {
                        let day = _day
                        const foundHabit = day.habits.find(habit => habit.habit.toString() === habitId)
                        const foundHabitIndex = day.habits.indexOf(foundHabit)
                        day.habits.splice(foundHabitIndex, 1)
                        day.save()

                    })
                })
            .then(() => {
                res.status(200).json(habitId)
            })
        })
        .catch(err => {
            next(err)
        })
    })







router.put('/', (req, res, next) => {
    const userId = req.user.id
    console.log('userId', userId)
    const habitId = req.body.id
    console.log('habitId', habitId)
    const dayId = req.body.day
    console.log('dayId', dayId)
    Day.findOne({
        _id : dayId,
        userId: userId})
        .populate('habits.habit')
        .then(_day => {
            let day = _day;
            console.log('line 163', day)
            const foundHabit = day.habits.find(habit => habit.habit._id.toString() === habitId)
            console.log('foundHabit', foundHabit);
            foundHabit.checked = !foundHabit.checked;
            day.save();
            console.log('line 168', day)
            res.json(day)
        })
});










module.exports = router;