const { customerSchema } = require('../schemas/customer');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllCustomer = async (req, res) => {
    try {
        const conn = createConnection();
        const Customer = conn.model('Customer', customerSchema);
        const result = await Customer.find({})
        
        await conn.close(); // Use await
        return res.json(result);
    } catch (error) {
        console.error('Error in getAllCustomer:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
}

const getCustomerByID = async (req, res) => {
    const conn = createConnection();
    const id = req.params.id

    const Customer = conn.model('Customer', customerSchema);
    const result = await Customer.findById(id)

    conn.close();
    return res.json(result);
}

const getCustomerByFirstname = async (req,res) => {
    const conn = createConnection();
    const name = req.params.firstname

    const Customer = conn.model('Customer', customerSchema)
    const cond = {
        $or:[
                {firstname: {$regex: name}}, 
                {lastname : {$regex: name}}
            ]
    }
    const result = await Customer.find(cond);
    conn.close()
    return res.json(result)
}

const insertCustomer = async (req, res) => {
    try {
        const conn = createConnection();
        const body = req.body
        const Customer = conn.model('Customer', customerSchema);

        const new_doc = new Customer(body);
        const error = new_doc.validateSync();

        if (error) {
            console.log(error.errors);
            await conn.close(); // Close connection before returning
            return res.status(400).json({ msg: getMongoErrorMsg(error.errors) })
        }
        
        await new_doc.save(); // Make sure save completes
        await conn.close(); // Use await to ensure proper cleanup
        
        return res.status(201).json(new_doc);
    } catch (error) {
        console.error('Error in insertCustomer:', error);
        return res.status(500).json({ msg: 'Server error: ' + error.message });
    }
}

module.exports = {
    getAllCustomer,
    getCustomerByID,
    getCustomerByFirstname,
    insertCustomer
}