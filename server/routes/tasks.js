const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const { protect } = require('../middleware/auth');

router.use(protect); // Protect all task routes

router.get("/", getTasks);
router.post("/", createTask);

router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
