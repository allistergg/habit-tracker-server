const express = require('express');
const router = express.Router();
const passport = require('passport')
const { Day, Habit } = require('../models/habits-days');


// let habits = [
//     { id: 0, habit: "Study Spanish", checked: false },
//     { id: 1, habit: "Read a novel", checked: false },
//     { id: 2, habit: "Programming", checked: false }
// ]

// let days = {
//     Monday: {
//         dayId: 1,
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     },

//     Tuesday: {
//         dayId: 2,
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     },
//     Wednesday: {
//         dayId: 3,
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     },
//     Thursday: {
//         dayId: 4, 
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     },
//     Friday: {
//         dayId: 5,
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     },
//     Saturday: {
//         dayId: 6,
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     },
//     Sunday: {
//         dayId: 7,
//         habits:
//             [
//                 { id: 0, habit: "Study Spanish", checked: false },
//                 { id: 1, habit: "Read a novel", checked: false },
//                 { id: 2, habit: "Programming", checked: false }
//             ]
//     }
// }

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res) => {
    Day.find({})
        .populate('habits.habit')
        .then(data => {
            console.log(data)
            res.json(data)
        })

})

router.get('/names', (req, res) => {
    Habit.find({})
        .then(data => {
            res.json(data)
        })
})

router.post('/', (req, res) => {
    let newHabitResult;
    const newHabit = { name: req.body.name }
    Habit.create(newHabit)
        .then(result => {
            newHabitResult = result
            console.log('newHabitResult:', newHabitResult)
            Day.find({})
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
})

router.delete('/:id', (req, res, next) => {
    const habitId = req.params.id
    Habit.findByIdAndRemove(habitId)
        .then(() => {
            Day.find({})
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
    })







router.put('/', (req, res, next) => {
    const habitId = req.body.id
    console.log(habitId)
    const dayId = req.body.day
    console.log(dayId)
    Day.findById(dayId)
        .populate('habits.habit')
        .then(_day => {
            let day = _day;
            console.log('line 106', day)
            const foundHabit = day.habits.find(habit => habit.habit._id.toString() === habitId)
            console.log('foundHabit', foundHabit);
            foundHabit.checked = !foundHabit.checked;
            day.save();
            console.log('line 113', day)
            res.json(day)
        })
});










module.exports = router;