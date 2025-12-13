import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import BlankPage from "../../../component/Modals/updateModal";

export default function EditEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any | null>(null);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/employee/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch employees");
      }

      const data = await response.json();

      if (data.employees && data.total !== undefined) {
        setEmployees(data.employees);
        setTotal(data.total);
      } else if (Array.isArray(data)) {
        setEmployees(data);
        setTotal(data.length);
      } else {
        setEmployees([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError(err.message);
      setEmployees([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEmployees();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open modal
  const confirmEdit = (employee: any) => {
    setEditEmployee({ ...employee });
    setShowModal(true);
  };

  // Update employee
  const handleUpdate = async (updatedEmployee: any) => {
    try {
      const payload = {
        first_name: updatedEmployee.first_name,
        last_name: updatedEmployee.last_name,
        phone_number: updatedEmployee.phone_number,
        gender: updatedEmployee.gender,
        role_id: updatedEmployee.role_id,
        hire_date: updatedEmployee.hire_date,
      };

      const res = await fetch(
        `${domain_link}api/employee/update/${updatedEmployee._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update employee");
      }

      const result = await res.json();
      setMessage(`Updated employee: ${result.first_name} ${result.last_name}`);

      setEmployees(employees.map((e) => (e._id === result._id ? result : e)));
    } catch (err: any) {
      console.error("Error updating employee:", err);
      setMessage("Error updating employee");
    } finally {
      setShowModal(false);
      setEditEmployee(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Employees Management</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Find
        </button>
      </form>

      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Hire Date</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee._id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td className="border px-4 py-2">
                      {employee.phone_number || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {employee.gender || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {employee.role_id?.role_name || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {employee.hire_date
                        ? new Date(employee.hire_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(employee)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <BlankPage
        show={showModal}
        title="Edit Employee"
        fields={[
          { key: "first_name", label: "First Name", type: "text" },
          { key: "last_name", label: "Last Name", type: "text" },
          { key: "phone_number", label: "Phone", type: "text" },
          { key: "gender", label: "Gender", type: "text" },
          { key: "hire_date", label: "Hire Date", type: "date" },
        ]}
        entity={editEmployee}
        onChange={setEditEmployee}
        onSave={() => handleUpdate(editEmployee!)}
        onCancel={() => {
          setShowModal(false);
          setEditEmployee(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
