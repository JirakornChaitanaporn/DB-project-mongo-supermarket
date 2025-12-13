import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function ReadEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch employees with server-side pagination
  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
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

      // Handle different response formats
      if (data.employees && data.total !== undefined) {
        // Server-side pagination format: { employees: [...], total: 150 }
        setEmployees(data.employees || []);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        // Simple array format: [...]
        setEmployees(data);
        setTotal(data.length);
      } else {
        // Fallback
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
  // Can add searchTerm in useEffect.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEmployees();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Employees List</h2>

      {/* Search bar */}
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
                <th className="border px-4 py-2">Salary</th>
                <th className="border px-4 py-2">Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee._id} className="bg-gray-100 text-left">
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
                    <td className="border px-4 py-2 text-right">
                      {employee.role_id?.role_salary
                        ? `$${employee.role_id.role_salary.toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {employee.hire_date
                        ? new Date(employee.hire_date).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border px-4 py-2 text-center text-gray-500 text-black"
                  >
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {/* Rows per page selector */}
          <div className="mt-4 flex items-center gap-2">
            <label className="font-medium text-black">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page when changing rows
              }}
              className="border border-gray-300 rounded px-2 py-1 text-black"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
