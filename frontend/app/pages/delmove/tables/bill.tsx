import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function DeleteBill() {
  interface BillLayout {
    _id: string;
    customer_id?: { _id: string; first_name: string; last_name: string } | null;
    employee_id: string | { _id: string; first_name: string; last_name: string };
    products: {
      _id: string;
      product_id?: { _id: string; product_name: string };
      quantity: number;
    }[];
    total_amount: number;
    transaction_time?: string;
  }

  const [bills, setBills] = useState<BillLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const rowsPerPage = 10;

  // Fetch bills
  const fetchBills = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);

    try {
      const response = await fetch(
        `${domain_link}api/bill/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch bills");
      }

      const data = await response.json();
      setBills(data);
    } catch (err: any) {
      console.error("Error fetching bills:", err);
      setError(err.message);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBills();
  };

  // Delete logic
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${domain_link}api/bill/delete/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(`Deleted bill: ${JSON.stringify(result)}`);
      setBills(bills.filter((b) => b._id !== deleteId));
    } catch (err) {
      console.error("Error deleting bill:", err);
      setMessage("Error deleting bill");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  // Pagination
  const indexOfLastBill = currentPage * rowsPerPage;
  const indexOfFirstBill = indexOfLastBill - rowsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(bills.length / rowsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bills</h2>

      {loading && <p>Loading bills...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Products</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBills.length > 0 ? (
                currentBills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="border px-4 py-2">
                      {typeof bill.customer_id === "object" &&
                      bill.customer_id?.first_name
                        ? `${bill.customer_id.first_name} ${bill.customer_id.last_name.charAt(0).toUpperCase()}.`
                        : "guest"}
                    </td>
                    <td className="border px-4 py-2">
                      {typeof bill.employee_id === "object"
                        ? `${bill.employee_id.first_name} ${bill.employee_id.last_name}`
                        : bill.employee_id}
                    </td>
                    <td className="border px-4 py-2">
                      {bill.products?.map((p) => (
                        <div key={p._id}>
                          {typeof p.product_id === "object"
                            ? p.product_id.product_name
                            : p.product_id}{" "}
                          (x{p.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">{bill.total_amount}</td>
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
                    colSpan={5}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No bills found
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <p className="mb-4 text-center text-black">
              Are you sure you want to delete this bill?
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
    </div>
  );
}
