import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function ReadSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${domain_link}api/supplier/fetch`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch suppliers");
      }

      const data = await response.json();
      setSuppliers(data);
    } catch (err: any) {
      console.error("Error fetching suppliers:", err);
      setError(err.message);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Filter roles by name only
  const filteredSuppliers = suppliers.filter((suppliers) =>
    suppliers.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastSupplier = currentPage * rowsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - rowsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );
  const totalPages = Math.ceil(suppliers.length / rowsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Suppliers</h2>

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

      {loading && <p>Loading suppliers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Supplier Name</th>
                <th className="border px-4 py-2">Contact Person</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {currentSuppliers.length > 0 ? (
                currentSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td className="border px-4 py-2">
                      {supplier.supplier_name}
                    </td>
                    <td className="border px-4 py-2">
                      {supplier.contacts?.person || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {supplier.contacts?.phone || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {supplier.contacts?.email || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {supplier.address ? (
                        <>
                          {supplier.address.street}, {supplier.address.city},{" "}
                          {supplier.address.postal_code},{" "}
                          {supplier.address.country}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No suppliers found
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
