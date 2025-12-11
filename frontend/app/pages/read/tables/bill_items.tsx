import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function ReadBillItems() {
  const [billItems, setBillItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch bill items
  const fetchBillItems = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("product_id", searchTerm); // adjust if you want to search differently
    }

    try {
      const response = await fetch(
        `${domain_link}api/billitem/fetch?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch bill items");
      }

      const data = await response.json();
      setBillItems(data);
    } catch (err: any) {
      console.error("Error fetching bill items:", err);
      setError(err.message);
      setBillItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBillItems();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = billItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(billItems.length / rowsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bill Items</h2>

      {/* Search bar */}
      {/* <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by product ID..."
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

      {loading && <p>Loading bill items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Bill Total</th>
                <th className="border px-4 py-2">Transaction Time</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Promotion</th>
                <th className="border px-4 py-2">Final Price</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td className="border px-4 py-2">
                      {item.bill_id?.total_amount || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.bill_id?.transaction_time
                        ? new Date(item.bill_id.transaction_time).toLocaleString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.product_id?.product_name || "—"}
                    </td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">
                      {item.promotion
                        ? `${item.promotion.promotion_name} (${item.promotion.discount_type}: ${item.promotion.discount_value})`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">{item.final_price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="border px-4 py-2 text-center text-gray-500"
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
        </div>
      )}
    </div>
  );
}
