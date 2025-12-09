const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const {get_all_role, insert_role} = require('../controllers/role')

jsonParser = bodyParser.json();

router.get('/role',get_all_role)
router.post('/role', jsonParser, insert_role)

module.exports = router