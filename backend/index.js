const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');

const billitemRouter = require('./routes/BillItemRoutes')
const billRouter = require('./routes/BillRoutes')
const categoryRouter = require('./routes/CategoryRoutes')
const customerRouter = require('./routes/CustomerRoutes')
const employeeRouter = require('./routes/EmployeeRoutes')
const productRouter = require('./routes/ProductRoutes')
const promotionRouter = require('./routes/PromotionRoutes')
const roleRouter = require('./routes/RoleRoutes')
const supplierRouter = require('./routes/SupplierRoutes')

dotenv.config()
const port = process.env.EXPRESS_PORT || 5175;

const app = express()

// Add CORS middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));

// Add body parser middleware BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add routes
app.use("/api/billitem", billitemRouter)
app.use("/api/bill", billRouter)
app.use("/api/category", categoryRouter)
app.use("/api/customer", customerRouter)
app.use("/api/employee", employeeRouter)
app.use("/api/product", productRouter)
app.use("/api/promotion", promotionRouter)
app.use("/api/role", roleRouter)
app.use("/api/supplier", supplierRouter)

// run express
app.listen(port, () => {
    console.log('Super market backend listening on port '+port);
})
