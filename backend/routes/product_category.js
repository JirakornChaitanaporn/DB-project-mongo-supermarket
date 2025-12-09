const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { getAllProductCategory, insertProductCategory } = require('../controllers/product_category')

// create json parser
jsonParser = bodyParser.json();

router.get('/product_category', getAllProductCategory);
router.post('/product_category', jsonParser, insertProductCategory);

module.exports = router;
