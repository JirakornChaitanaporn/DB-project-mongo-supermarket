const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const {get_all_employee , insert_employee} = require('../controllers/employee');

jsonParser = bodyParser.json();

router.get('/employee', get_all_employee)
router.post('/employee', jsonParser , insert_employee)

module.exports = router