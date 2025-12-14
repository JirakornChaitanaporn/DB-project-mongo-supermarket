import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import BlankPage from "../../../component/Modals/updateModal";

export default function EditBill() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editBill, setEditBill] = useState<any | null>(null);

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
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch bills");
      }

      const data = await response.json();

      if (data.bills && data.total !== undefined) {
        setBills(data.bills);
        setTotal(data.total);
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
  const confirmEdit = (bill: any) => {
    setEditBill({ ...bill });
    setShowModal(true);
  };

  // Update bill (limited & safe fields)
  const handleUpdate = async (updatedBill: any) => {
    try {
      const payload = {
        customer_id: updatedBill.customer_id?._id || updatedBill.customer_id,
        employee_id: updatedBill.employee_id?._id || updatedBill.employee_id,
        transaction_time: updatedBill.transaction_time,
      };

      const res = await fetch(
        `${domain_link}api/bill/update/${updatedBill._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update bill");
      }

      const result = await res.json();
      setMessage("Bill updated successfully");

      setBills(bills.map((b) => (b._id === result._id ? result : b)));
    } catch (err: any) {
      console.error("Error updating bill:", err);
      setMessage("Error updating bill");
    } finally {
      setShowModal(false);
      setEditBill(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
                        ? `${bill.customer_id.first_name} ${bill.customer_id.last_name || ""}`
                        : "Guest"}
                    </td>
                    <td className="border px-4 py-2">
                      {bill.employee_id?.first_name
                        ? `${bill.employee_id.first_name} ${bill.employee_id.last_name || ""}`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${bill.total_amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="border px-4 py-2">
                      {bill.transaction_time
                        ? new Date(bill.transaction_time).toLocaleString()
                        : "—"} (GMT)
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(bill)}
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
        </div>
      )}

      {/* Edit Modal */}
      <BlankPage
        show={showModal}
        title="Edit Bill"
        fields={[
          {
            key: "transaction_time",
            label: "Transaction Time",
            type: "datetime-local",
          },
        ]}
        entity={editBill}
        onChange={setEditBill}
        onSave={() => handleUpdate(editBill!)}
        onCancel={() => {
          setShowModal(false);
          setEditBill(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
