import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import ConfirmModal from "../../../component/Modals/deleteModal";

export default function DeleteBill() {
  const [bills, setBills] = useState<any[]>([]);
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

  // Fetch bills
  const fetchBills = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/bill/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        let message = "Failed to fetch bills";
        try {
          const errData = await response.json();
          message = errData.message || message;
        } catch {
          const errText = await response.text();
          message = errText || message;
        }
        throw new Error(message);
      }

      const data = await response.json();

      if (data.bills && data.total !== undefined) {
        setBills(data.bills || []);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        setBills(data);
        setTotal(data.length);
      } else {
        setBills([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error("Error fetching bills:", err);
      setError(err.message);
      setBills([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBills();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Delete bill
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${domain_link}api/bill/delete/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete bill");
      }

      setMessage(`Deleted bill: ${deleteId}`);
      setBills(bills.filter((b) => b._id !== deleteId));
    } catch (err) {
      console.error("Error deleting bill:", err);
      setMessage("Error deleting bill");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bills Management</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by customer..."
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

      {loading && <p>Loading bills...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Products</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Transaction Time</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <tr key={bill._id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {bill.customer_id?.first_name
                        ? `${bill.customer_id.first_name} ${bill.customer_id.last_name?.charAt(0).toUpperCase() || ""}.`
                        : "Guest"}
                    </td>
                    <td className="border px-4 py-2">
                      {bill.employee_id?.first_name
                        ? `${bill.employee_id.first_name} ${bill.employee_id.last_name || ""}`
                        : bill.employee_id || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {bill.products && bill.products.length > 0
                        ? bill.products.map((p: any, idx: number) => (
                            <div key={p._id || idx}>
                              {p.product_id?.product_name || "Unknown"} (x
                              {p.quantity || 1})
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${bill.total_amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="border px-4 py-2">
                      {bill.transaction_time
                        ? new Date(bill.transaction_time).toLocaleString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmDelete(bill._id)}
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
                    No bills found
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
            <label className="font-medium text-black">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
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

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        title="Delete Bill"
        message="Are you sure you want to delete this bill?"
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
