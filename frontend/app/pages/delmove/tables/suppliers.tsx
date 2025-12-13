import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import ConfirmModal from "../../../component/Modals/deleteModal";

export default function DeleteSupplier() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete logic
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/supplier/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch suppliers");
      }

      const data = await response.json();
      setSuppliers(data.suppliers);
      setTotal(data.total);
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
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSuppliers();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Delete supplier
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${domain_link}api/supplier/delete/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete supplier");
      }

      const result = await res.json();
      setMessage(`Deleted supplier: ${result.supplier_name || deleteId}`);
      setSuppliers(suppliers.filter((s) => s._id !== deleteId));
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setMessage("Error deleting supplier");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Suppliers Management</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by supplier name..."
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

      {loading && <p>Loading suppliers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Supplier Name</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier._id} className="bg-gray-100">
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
                      {supplier.address
                        ? `${supplier.address.street}, ${supplier.address.city}, ${supplier.address.postal_code}, ${supplier.address.country}`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmDelete(supplier._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
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
                    No suppliers found
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

          {/* Rows per page */}
          <div className="mt-4 flex items-center gap-2">
            <label className="font-medium">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowModal(false);
          setDeleteId(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
