import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";
import BlankPage from "../../../component/Modals/updateModal";

export  default function EditSupplier() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<any | null>(null);

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

  // Trigger modal
  const confirmEdit = (supplier: any) => {
    setEditSupplier(supplier);
    setShowModal(true);
  };

  // Perform update
  const handleUpdate = async (updatedSupplier: any) => {
    try {
      const res = await fetch(
        `${domain_link}api/supplier/update/${updatedSupplier._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSupplier),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update supplier");
      }

      const result = await res.json();
      setMessage(`Updated supplier: ${result.supplier_name}`);

      // Update local state
      setSuppliers(
        suppliers.map((s) => (s._id === updatedSupplier._id ? result : s))
      );
    } catch (err: any) {
      setMessage("Error updating supplier");
    } finally {
      setShowModal(false);
      setEditSupplier(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Suppliers Management</h2>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by supplier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border rounded px-3 py-2"
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
                <th className="border px-4 py-2">Contact Person</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier._id} className="bg-gray-100">
                    <td className="border px-4 py-2">{supplier.supplier_name}</td>
                    <td className="border px-4 py-2">{supplier.contacts?.person}</td>
                    <td className="border px-4 py-2">{supplier.contacts?.phone}</td>
                    <td className="border px-4 py-2">{supplier.address?.city}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(supplier)}
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
                    colSpan={5}
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
            <label className="font-medium">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page when changing rows
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

      {/* Edit Modal */}
      <BlankPage
        show={showModal}
        title="Edit Supplier"
        entity={editSupplier}
        onChange={setEditSupplier}
        onSave={() => handleUpdate(editSupplier!)}
        onCancel={() => {
            setShowModal(false);
            setEditSupplier(null);
        }}
        fields={[
            { key: "supplier_name", label: "Supplier Name", type: "text" },
            { key: "contacts.person", label: "Contact Person", type: "text" },
            { key: "contacts.email", label: "Email", type: "text" },
            { key: "contacts.phone", label: "Phone", type: "text" },
            { key: "address.street", label: "Street", type: "text" },
            { key: "address.city", label: "City", type: "text" },
            { key: "address.postal_code", label: "Postal Code", type: "text" },
            { key: "address.country", label: "Country", type: "text" },
        ]}
      />

{message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
  </div>
  );
}
