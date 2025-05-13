const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Routes
router.get('/', registerController.getAllStudents);
router.post('/', registerController.registerStudent);
router.put('/:student_id', registerController.registerStudent);
router.delete('/:id', registerController.deleteStudent);

module.exports = router;