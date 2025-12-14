import React, { useState } from "react";
import { domain_link } from "../../domain";
import SelectEntityModal from "../../../component/Modals/selectModal";

export default function CreateBill() {
  const [customer_id, setCustomerId] = useState<string | null>(null);
  const [customer_name, setCustomerName] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [employee_name, setEmployeeName] = useState("");
  const [message, setMessage] = useState("");

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Submit bill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = { customer_id, employee_id };

    try {
      const response = await fetch(`${domain_link}api/bill/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Bill created successfully!");
        setCustomerId(null);
        setCustomerName("");
        setEmployeeId("");
        setEmployeeName("");
      } else {
        setMessage(data.error || "Error creating bill");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating bill");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block font-medium">Customer:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customer_name || "Guest"}
              readOnly
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowCustomerModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Customer
            </button>
          </div>
        </div>

        {/* Employee Selection */}
        <div>
          <label className="block font-medium">Employee:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={employee_name}
              readOnly
              placeholder="No employee selected"
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowEmployeeModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Employee
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium text-red-800">
            Bill products will be added from Bill_Item.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Bill
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}

      {/* Customer Modal */}
      <SelectEntityModal
        show={showCustomerModal}
        title="Select Customer"
        fetchUrl="api/customer/fetch"
        columns={[
          { key: "first_name", label: "First Name" },
          { key: "last_name", label: "Last Name" },
        ]}
        onSelect={(customer) => {
          setCustomerId(customer._id);
          setCustomerName(`${customer.first_name} ${customer.last_name}`);
          setShowCustomerModal(false);
        }}
        onCancel={() => setShowCustomerModal(false)}
      />

      {/* Employee Modal */}
      <SelectEntityModal
        show={showEmployeeModal}
        title="Select Employee"
        fetchUrl="api/employee/fetch"
        columns={[
          { key: "first_name", label: "First Name" },
          { key: "last_name", label: "Last Name" },
        ]}
        onSelect={(employee) => {
          setEmployeeId(employee._id);
          setEmployeeName(`${employee.first_name} ${employee.last_name}`);
          setShowEmployeeModal(false);
        }}
        onCancel={() => setShowEmployeeModal(false)}
      />
    </div>
  );
}
