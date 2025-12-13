import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

interface EmployeeLayout {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  gender?: string;
  role_id: string;   // references Role
  hire_date: string; // ISO date string
}

export function DeleteEmployee() {
  const [employees, setEmployees] = useState<EmployeeLayout[]>([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch employees
  useEffect(() => {
    fetch(`${domain_link}api/employee/fetch`)
      .then((res) => res.json())
      .then((data: EmployeeLayout[]) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // Trigger modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Perform delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${domain_link}api/employee/delete/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(`Deleted employee: ${JSON.stringify(result)}`);
      setEmployees(employees.filter((e) => e._id !== deleteId));
    } catch (err) {
      console.error("Error deleting employee:", err);
      setMessage("Error deleting employee");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delete Employees</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Gender</th>
            <th className="border px-4 py-2">Hire Date</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="border px-4 py-2">{emp.first_name}</td>
              <td className="border px-4 py-2">{emp.last_name}</td>
              <td className="border px-4 py-2">{emp.phone_number || "-"}</td>
              <td className="border px-4 py-2">{emp.gender || "-"}</td>
              <td className="border px-4 py-2">
                {new Date(emp.hire_date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => confirmDelete(emp._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <p className="mb-4 text-center text-black">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
