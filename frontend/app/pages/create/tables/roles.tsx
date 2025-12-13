import React, { useState } from "react";
import { domain_link } from "../../domain";

export default function CreateRole() {
  const [role_name, setRoleName] = useState("");
  const [role_description, setRoleDescription] = useState("");
  const [role_salary, setRoleSalary] = useState(10000);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      role_name,
      role_description,
      role_salary: Number(role_salary),
    };

    try {
      const response = await fetch(`${domain_link}api/role/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Role created successfully!");
        // Reset form
        setRoleName("");
        setRoleDescription("");
        setRoleSalary(10000);
      } else {
        setMessage(data.error || "Error creating role");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating role");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Role</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Role Name:</label>
          <input
            type="text"
            value={role_name}
            onChange={(e) => setRoleName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Role Description:</label>
          <textarea
            value={role_description}
            onChange={(e) => setRoleDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Role Salary:</label>
          <input
            type="number"
            value={role_salary}
            onChange={(e) => setRoleSalary(Number(e.target.value))}
            min={10000}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Role
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
