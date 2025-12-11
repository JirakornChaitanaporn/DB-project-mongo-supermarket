import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function ReadPromotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch promotions from backend
  const fetchPromotions = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("search", searchTerm); // backend supports search by promotion_name
    }

    try {
      const response = await fetch(
        `${domain_link}api/promotion/fetch?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch promotions");
      }

      const data = await response.json();
      setPromotions(data);
    } catch (err: any) {
      console.error("Error fetching promotions:", err);
      setError(err.message);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPromotions();
  };

  // Pagination logic
  const indexOfLastPromotion = currentPage * rowsPerPage;
  const indexOfFirstPromotion = indexOfLastPromotion - rowsPerPage;
  const currentPromotions = promotions.slice(
    indexOfFirstPromotion,
    indexOfLastPromotion
  );
  const totalPages = Math.ceil(promotions.length / rowsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Promotions</h2>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by promotion name..."
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

      {loading && <p>Loading promotions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Promotion Name</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Original Price</th>
                <th className="border px-4 py-2">Discount</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {currentPromotions.length > 0 ? (
                currentPromotions.map((promotion) => (
                  <tr key={promotion._id}>
                    <td className="border px-4 py-2">
                      {promotion.promotion_name}
                    </td>
                    <td className="border px-4 py-2">
                      {promotion.product_id?.product_name || "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {promotion.product_id?.price
                        ? `$${promotion.product_id.price.toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {promotion.discount_percentage
                        ? `${promotion.discount_percentage}%`
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {promotion.start_date
                        ? new Date(promotion.start_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {promotion.end_date
                        ? new Date(promotion.end_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {promotion.description || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No promotions found
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
