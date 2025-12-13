import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import BlankPage from "../../../component/Modals/updateModal";

export default function EditBillItems() {
  const [billItems, setBillItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  // Fetch bill items
  const fetchBillItems = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/billitem/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch bill items");
      }

      const data = await response.json();

      if (data.billItems && data.total !== undefined) {
        setBillItems(data.billItems);
        setTotal(data.total);
      } else if (Array.isArray(data)) {
        setBillItems(data);
        setTotal(data.length);
      } else {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBillItems();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open modal
  const confirmEdit = (item: any) => {
    setEditItem({ ...item });
    setShowModal(true);
  };

  // Update bill item
  const handleUpdate = async (updatedItem: any) => {
    try {
      const payload = {
        quantity: updatedItem.quantity,
        price: updatedItem.price,
        promotion: updatedItem.promotion?._id || updatedItem.promotion || null,
      };

      const res = await fetch(
        `${domain_link}api/billitem/update/${updatedItem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update bill item");
      }

      const result = await res.json();
      setMessage("Bill item updated successfully");

      setBillItems(billItems.map((b) => (b._id === result._id ? result : b)));
    } catch (err: any) {
      console.error("Error updating bill item:", err);
      setMessage("Error updating bill item");
    } finally {
      setShowModal(false);
      setEditItem(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bill Items Management</h2>

      {/* Search */}
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
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Final Price</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length > 0 ? (
                billItems.map((item) => (
                  <tr key={item._id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {item.product_id?.product_name || "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {item.quantity}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${item.price?.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${item.final_price?.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(item)}
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
                    No bill items found
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
        title="Edit Bill Item"
        fields={[
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "price", label: "Price", type: "number" },
        ]}
        entity={editItem}
        onChange={setEditItem}
        onSave={() => handleUpdate(editItem!)}
        onCancel={() => {
          setShowModal(false);
          setEditItem(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
