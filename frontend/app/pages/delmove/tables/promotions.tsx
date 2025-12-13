import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

interface PromotionLayout {
  _id: string;
  promotion_name: string;
  product_id: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  start_date: string;
  end_date: string;
}


export function DeletePromotion() {
  const [promotions, setPromotions] = useState<PromotionLayout[]>([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch promotions
  useEffect(() => {
    fetch(`${domain_link}api/promotion/fetch`)
      .then((res) => res.json())
      .then((data: PromotionLayout[]) => setPromotions(data))
      .catch((err) => console.error("Error fetching promotions:", err));
  }, []);

  // Trigger modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Perform delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${domain_link}api/promotion/delete/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(`Deleted promotion: ${JSON.stringify(result)}`);
      setPromotions(promotions.filter((p) => p._id !== deleteId));
    } catch (err) {
      console.error("Error deleting promotion:", err);
      setMessage("Error deleting promotion");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delete Promotions</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Promotion Name</th>
            <th className="border px-4 py-2">Discount</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
            <tr key={promo._id}>
              <td className="border px-4 py-2">{promo.promotion_name}</td>
              <td className="border px-4 py-2">
                {promo.discount_type === "percent"
                  ? `${promo.discount_value}%`
                  : `$${promo.discount_value}`}
              </td>
              <td className="border px-4 py-2">
                {new Date(promo.start_date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {new Date(promo.end_date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => confirmDelete(promo._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <p className="mb-4 text-center text-black">
              Are you sure you want to delete this promotion?
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

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
