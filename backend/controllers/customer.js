const { customerSchema } = require('../schemas/customer');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllCustomer = async (req, res) => {
    const conn = createConnection();
    const Customer = conn.model('Customer', customerSchema);
    const result = await Customer.find({})

    conn.close();
    return res.json(result);
}

const insertCustomer = async (req, res) => {
    
    const conn = createConnection();
    const body = req.body
    const Customer = conn.model('Customer', customerSchema); // use / create collection name "Customer"

    const new_doc = new Customer(body); // new empty document of Customer collection 
    const error = await new_doc.validateSync();

    if (error) {
        console.log(error.errors);
        return res.status(400).json({ msg: getMongoErrorMsg(error.errors) })
    }
    await new_doc.save();
    conn.close();

    return res.status(201).json(new_doc);
}

module.exports = {
    getAllCustomer,
    insertCustomer
}