const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { getAllSupplier, insertSupplier } = require('../controllers/supplier')

// create json parser
jsonParser = bodyParser.json();

router.get('/supplier', getAllSupplier);
router.post('/supplier', jsonParser, insertSupplier);

module.exports = router;
