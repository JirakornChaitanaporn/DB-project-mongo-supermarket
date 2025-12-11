import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function CreateEmployee() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [role_id, setRoleId] = useState("");
  const [role_name, setRoleName] = useState(""); // store selected role name for display
  const [hire_date, setHireDate] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${domain_link}api/role/fetch`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          setRoles(data);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const paginatedRoles = filteredRoles.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );


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
        // Reset form
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setGender("");
        setRoleId("");
        setRoleName("");
        setHireDate("");
      } else {
        setMessage(data.error || "Error creating employee");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating employee");
    }
  };

  // Select role from modal
  const selectRole = (id: string, name: string) => {
    setRoleId(id);
    setRoleName(name);
    setShowRoleModal(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Employee</h2>

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

      {showRoleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-[500px] h-[600px] max-w-full p-6 flex flex-col transition duration-300 ease-in-out">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Select a Role
            </h3>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />

            {/* Table */}
            <div className="border border-gray-300 overflow-hidden">
              <table className="table-auto w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border px-4 py-2 text-left">Role</th>
                    <th className="border px-4 py-2 text-left">Salary</th>
                    <th className="border px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 align-top" style={{ height: `${5 * 48}px` }}>
                  {paginatedRoles.map((role) => (
                    <tr key={role._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{role.role_name}</td>
                      <td className="border px-4 py-2">{role.role_salary}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => selectRole(role._id, role.role_name)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Fill remaining rows */}
                  {Array.from({ length: 5 - paginatedRoles.length }).map((_, idx) => (
                    <tr key={`empty-${idx}`} className="bg-white">
                      <td className="border px-4 py-2">&nbsp;</td>
                      <td className="border px-4 py-2">&nbsp;</td>
                      <td className="border px-4 py-2 text-center">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Divider */}
            <hr className="my-4 border-gray-200" />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-3 py-1 rounded transition ${
                  currentPage === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {Math.ceil(filteredRoles.length / itemsPerPage)}
              </span>
              <button
                disabled={(currentPage + 1) * itemsPerPage >= filteredRoles.length}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded transition ${
                  (currentPage + 1) * itemsPerPage >= filteredRoles.length
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Next
              </button>
            </div>

            {/* Cancel Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowRoleModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
