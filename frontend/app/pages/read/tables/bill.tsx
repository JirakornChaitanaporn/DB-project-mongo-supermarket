import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function ReadBill() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch bills from backend
  const fetchBills = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await fetch(
        `${domain_link}api/bill/fetch?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
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
    setCurrentPage(1); // reset to first page when searching
    fetchBills();
  };

  // Pagination logic
  const indexOfLastBill = currentPage * rowsPerPage;
  const indexOfFirstBill = indexOfLastBill - rowsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(bills.length / rowsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bills</h2>

      {/* Search bar */}
      {/* <form
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
      </form> */}

      {loading && <p>Loading bills...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Products</th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentBills.length > 0 ? (
                currentBills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="border px-4 py-2">
                      {bill.customer_id?.first_name
                        ? `${bill.customer_id.first_name} ${bill.customer_id.last_name.charAt(0).toUpperCase() + "."}`
                        : "guest"}
                    </td>
                    <td className="border px-4 py-2">{bill.employee_id}</td>
                    <td className="border px-4 py-2">
                      {bill.products?.map((p: any) => (
                        <div key={p._id}>
                          {p.product_id?.product_name} (x{p.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">{bill.total_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
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
    </div>
  );
}
