import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function ReadBill() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch bills with server-side pagination
  const fetchBills = async () => {
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
        `${domain_link}api/bill/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        // Try JSON first, fallback to text if not valid JSON
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

      // Handle different response formats
      if (data.bills && data.total !== undefined) {
        // Server-side pagination format: { bills: [...], total: 150 }
        setBills(data.bills || []);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        // Simple array format: [...]
        setBills(data);
        setTotal(data.length);
      } else {
        // Fallback
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
  // Can add searchTerm in useEffect.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBills();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bills List</h2>

      {/* Search bar */}
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
              </tr>
            </thead>
            <tbody>
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <tr key={bill._id} className="bg-gray-100 text-left">
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
                              {p.quantity || 1}) ( {p.product_id?.price} Per unit )
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-4 py-2 text-center text-gray-500 text-black"
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
