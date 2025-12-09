const {employeeSchema} = require('../schemas/employee');
const { getMongoErrorMsg } = require('../utils/mongo');
const {createConnection} = require('../utils/mongo');


const get_all_employee = async (req, res) => {
    const conn = createConnection()
    const Employee = conn.model('Employee', employeeSchema)

    const result = await Employee.find({})
    conn.close();
    return res.json(result)
}

const insert_employee = async (req,res) => {
    const conn = createConnection();
    const body = req.body
    const Employee = conn.model('Employee', employeeSchema)

    const new_doc = new Employee(body);
    const error = await new_doc.validateSync();
    if (error) {
        console.log("there is error bro")
        return res.status(400).json({ msg: getMongoErrorMsg(error.errors) })
    }

    await new_doc.save()

    conn.close();
    return res.status(201).json(new_doc)
}

module.exports = {
    get_all_employee,
    insert_employee
}