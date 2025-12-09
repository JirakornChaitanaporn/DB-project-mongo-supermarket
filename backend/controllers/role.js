const {roleSchema} = require('../schemas/role')
const { getMongoErrorMsg } = require('../utils/mongo');
const {createConnection} = require('../utils/mongo');


const get_all_role = async (req,res) => {
    const conn = createConnection()
    const Role = conn.model('role', roleSchema)
    const result = await Role.find({})

    conn.close()
    return res.json(result)
}

const insert_role = async (req,res) => {
    const conn = createConnection()

    const body = req.body
    const Role = conn.model('role', roleSchema)
    const new_doc = new Role(body)


    const error = await new_doc.validateSync();
    if (error) {
        return res.status(400).json({ msg: getMongoErrorMsg(error.errors) })
    }

    await new_doc.save();

    conn.close()
    return res.status(201).json(new_doc)
}

module.exports = {
    get_all_role,
    insert_role
}