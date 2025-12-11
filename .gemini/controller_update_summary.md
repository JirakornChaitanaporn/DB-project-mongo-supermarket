# Controller Update Pattern (Based on Customer & Role)

## Pattern to Follow:

### Models (Schemas):
```javascript
import mongoose from "mongoose";

export const SchemaName = new mongoose.Schema({
    // fields
}, { collection: "collection_name" });
```

### Controllers:
```javascript
const { createConnection } = require("../utils/mongo");
const { SchemaName } = require("../schemas/SchemaModel");

// Create - Status 201
const create = async (req, res) => {
    // ... logic
    res.status(201).json(savedData);
};

// Fetch - Status 200
const fetch = async (req, res) => {
    // ... logic
    res.status(200).json(data);
};

// FetchById - Status 200
const fetchById = async (req, res) => {
    const { id } = req.params;
    const data = await Model.findById(id);
    res.status(200).json(data);
};

// Update - Status 200
const update = async (req, res) => {
    // ... logic
    res.status(200).json(updatedData);
};

// Delete - Status 204
const deleteItem = async (req, res) => {
    // ... logic
    res.status(204).json({ message: "Deleted" });
};

module.exports = { create, fetch, fetchById, update, deleteItem };
```

### Routes:
```javascript
const { fetch, fetchById, create, update, deleteItem } = require("../controllers/Controller.js");

route.get("/fetch", fetch);
route.get("/fetchById/:id", fetchById);
route.post("/create", create);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteItem);
```

## Completed:
- ✅ CustomerModel, CustomerController, CustomerRoutes
- ✅ RoleModel, RoleController, RoleRoutes
- ✅ SupplierModel, SupplierController, SupplierRoutes
- ✅ EmployeeModel, EmployeeController, EmployeeRoutes

## Remaining:
- Category
- Product
- Promotion
- Bill
- BillItem
