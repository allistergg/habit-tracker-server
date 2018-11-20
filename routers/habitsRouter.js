const express = require('express');
const router = express.Router();

let habits = [
    { id: 0, habit: "Study Spanish", checked: false },
    { id: 1, habit: "Read a novel", checked: false },
    { id: 2, habit: "Programming", checked: false }
]

let days = {
    Monday: {
        dayId: 1,
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    },

    Tuesday: {
        dayId: 2,
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    },
    Wednesday: {
        dayId: 3,
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    },
    Thursday: {
        dayId: 4, 
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    },
    Friday: {
        dayId: 5,
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    },
    Saturday: {
        dayId: 6,
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    },
    Sunday: {
        dayId: 7,
        habits:
            [
                { id: 0, habit: "Study Spanish", checked: false },
                { id: 1, habit: "Read a novel", checked: false },
                { id: 2, habit: "Programming", checked: false }
            ]
    }
}



router.get('/api/habits', (req, res) => {
    console.log(days)
    res.json(days)
})

router.post('/api/habits', (req, res) => {

    const newHabit = { id: habits[habits.length - 1].id + 1, habit: req.body.habit, checked: false }
    habits = [...habits, newHabit]
    res.json(habits[habits.length - 1])

})

router.put('/api/habits', (req, res) => {
    const id = req.body.id
    const day = req.body.day
    foundHabit = days[day].habits.find(habit => habit.id === id)
    foundHabit.checked = !foundHabit.checked
    res.json(foundHabit)
})


module.exports = router;