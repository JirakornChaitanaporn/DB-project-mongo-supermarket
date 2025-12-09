const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');
const customerRouter = require('./routes/customer')
const employeeRouter = require('./routes/employee')
const roleRouter = require('./routes/role')

dotenv.config()
const port = process.env.EXPRESS_PORT || 5175;

const app = express()

// Add CORS middleware
app.use(cors());

// Add body parser middleware BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add routes
app.use(customerRouter);
app.use(employeeRouter);
app.use(roleRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Internal server error', error: err.message });
});

// run express
app.listen(port, () => {
    console.log('Super market backend listening on port '+port);
})