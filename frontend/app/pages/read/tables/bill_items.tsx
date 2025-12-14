import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function ReadBillItems() {
  const [billItems, setBillItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch bill items with server-side pagination
  const fetchBillItems = async () => {
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
        `${domain_link}api/billitem/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch bill items");
      }

      const data = await response.json();

      // Handle different response formats
      if (data.billItems && data.total !== undefined) {
        // Server-side pagination format: { billItems: [...], total: 150 }
        setBillItems(data.billItems || []);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        // Simple array format: [...]
        setBillItems(data);
        setTotal(data.length);
      } else {
        // Fallback
        setBillItems([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error("Error fetching bill items:", err);
      setError(err.message);
      setBillItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillItems();
  }, [currentPage, rowsPerPage]);
  // Can add searchTerm in useEffect.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBillItems();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bill Items List</h2>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by product name..."
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

      {loading && <p>Loading bill items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Bill id</th>
                <th className="border px-4 py-2">Transaction Time</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Promotion</th>
                <th className="border px-4 py-2">Final Price</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length > 0 ? (
                billItems.map((item) => (
                  <tr key={item._id} className="bg-gray-100 text-left">
                    <td className="border px-4 py-2 text-right">
                      {item.bill_id?.total_amount
                        ? `id: ${item.bill_id?._id}`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.bill_id?.transaction_time
                        ? new Date(
                            item.bill_id.transaction_time
                          ).toLocaleString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.product_id?.product_name || "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {item.quantity}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${item.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.promotion?.promotion_name
                        ? `${item.promotion.promotion_name} (${item.promotion.discount_type}: ${
                            item.promotion.discount_type === "percent"
                              ? `${item.promotion.discount_value}%`
                              : `$${item.promotion.discount_value}`
                          })`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${item.final_price?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="border px-4 py-2 text-center text-gray-500 text-black"
                  >
                    No bill items found
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
