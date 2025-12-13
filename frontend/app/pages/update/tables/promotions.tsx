import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import BlankPage from "../../../component/Modals/updateModal";

export default function EditPromotion() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit logic
  const [showModal, setShowModal] = useState(false);
  const [editPromotion, setEditPromotion] = useState<any | null>(null);

  // Fetch promotions
  const fetchPromotions = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/promotion/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch promotions");
      }

      const data = await response.json();
      setPromotions(data.promotions || []);
      setTotal(data.total || 0);
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
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPromotions();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open edit modal
  const confirmEdit = (promotion: any) => {
    setEditPromotion({
      ...promotion,
      product_id: promotion.product_id?._id || "",
    });
    setShowModal(true);
  };

  // Update promotion
  const handleUpdate = async (updatedPromotion: any) => {
    try {
      const payload = {
        promotion_name: updatedPromotion.promotion_name,
        product_id: updatedPromotion.product_id,
        discount_type: updatedPromotion.discount_type,
        discount_value: Number(updatedPromotion.discount_value),
        start_date: updatedPromotion.start_date,
        end_date: updatedPromotion.end_date,
      };

      const res = await fetch(
        `${domain_link}api/promotion/update/${updatedPromotion._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update promotion");
      }

      const result = await res.json();
      setMessage(`Updated promotion: ${result.promotion_name}`);

      setPromotions(promotions.map((p) => (p._id === result._id ? result : p)));
    } catch (err: any) {
      console.error("Error updating promotion:", err);
      setMessage("Error updating promotion");
    } finally {
      setShowModal(false);
      setEditPromotion(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Promotions Management</h2>

      {/* Search */}
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
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Promotion Name</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Discount Type</th>
                <th className="border px-4 py-2">Discount Value</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <tr key={promotion._id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {promotion.promotion_name}
                    </td>
                    <td className="border px-4 py-2">
                      {promotion.product_id?.product_name || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {promotion.discount_type || "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {promotion.discount_type === "percent"
                        ? `${promotion.discount_value}%`
                        : `$${promotion.discount_value.toFixed(2)}`}
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
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(promotion)}
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
                    colSpan={7}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No promotions found
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

      {/* Edit Modal */}
      <BlankPage
        show={showModal}
        title="Edit Promotion"
        fields={[
          { key: "promotion_name", label: "Promotion Name", type: "text" },
          { key: "product_id", label: "Product ID", type: "text" },
          {
            key: "discount_type",
            label: "Discount Type",
            type: "select",
            options: ["percent", "fixed"],
          },
          { key: "discount_value", label: "Discount Value", type: "number" },
          { key: "start_date", label: "Start Date", type: "date" },
          { key: "end_date", label: "End Date", type: "date" },
        ]}
        entity={editPromotion}
        onChange={setEditPromotion}
        onSave={() => handleUpdate(editPromotion!)}
        onCancel={() => {
          setShowModal(false);
          setEditPromotion(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
