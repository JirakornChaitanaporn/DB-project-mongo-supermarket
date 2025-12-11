import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function ReadRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${domain_link}api/role/fetch`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch roles");
      }

      const data = await response.json();
      setRoles(data);
    } catch (err: any) {
      console.error("Error fetching roles:", err);
      setError(err.message);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles by name only
  const filteredRoles = roles.filter((role) =>
    role.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRole = currentPage * rowsPerPage;
  const indexOfFirstRole = indexOfLastRole - rowsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Roles List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by role name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset to first page when searching
        }}
        className="mb-4 w-full px-4 py-2 border rounded"
      />

      {loading && <p>Loading roles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Role Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Salary</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.length > 0 ? (
                currentRoles.map((role) => (
                  <tr key={role._id}>
                    <td className="border px-4 py-2">{role.role_name}</td>
                    <td className="border px-4 py-2">
                      {role.role_description || "—"}
                    </td>
                    <td className="border px-4 py-2">{role.role_salary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No roles found
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
        </div>
      )}
    </div>
  );
}
