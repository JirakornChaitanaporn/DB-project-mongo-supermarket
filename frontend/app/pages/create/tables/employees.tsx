import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";
import SelectEntityModal from "../../../component/Modals/selectModal"

export default function CreateEmployee() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [role_id, setRoleId] = useState("");
  const [role_name, setRoleName] = useState("");
  const [hire_date, setHireDate] = useState("");
  const [message, setMessage] = useState("");

  const [showRoleModal, setShowRoleModal] = useState(false);

  // Submit employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      first_name,
      last_name,
      phone_number,
      gender,
      role_id,
      hire_date: hire_date ? new Date(hire_date) : new Date(),
    };

    try {
      const response = await fetch(`${domain_link}api/employee/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Employee created successfully!");
        // reset form
        setFirstName(""); setLastName(""); setPhoneNumber("");
        setGender(""); setRoleId(""); setRoleName(""); setHireDate("");
      } else {
        setMessage(data.error || "Error creating employee");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating employee");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Employee</h2>

      {/* Employee Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Phone Number:</label>
          <input
            type="text"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male" style={{ color: "black" }}>Male</option>
            <option value="Female" style={{ color: "black" }}>Female</option>
            <option value="Other" style={{ color: "black" }}>Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Role:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={role_name}
              readOnly
              placeholder="No role selected"
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowRoleModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Role
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Hire Date:</label>
          <input
            type="date"
            value={hire_date}
            onChange={(e) => setHireDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Employee
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}

      {/* Role Selection Modal */}
      <SelectEntityModal
        show={showRoleModal}
        title="Select Role"
        fetchUrl="api/role/fetch"
        columns={[
          { key: "role_name", label: "Role" },
          { key: "role_salary", label: "Salary" },
        ]}
        onSelect={(role) => {
          setRoleId(role._id);
          setRoleName(role.role_name);
          setShowRoleModal(false);
        }}
        onCancel={() => setShowRoleModal(false)}
      />
    </div>
  );
}
