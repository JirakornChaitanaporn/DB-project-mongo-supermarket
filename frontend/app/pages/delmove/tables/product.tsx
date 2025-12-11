import React, { useState, useEffect } from "react";

import { domain_link } from "../../domain";

import type { ProductLayout } from "../../../types/product";

export function DeleteProduct() {
  const [products, setProducts] = useState<ProductLayout[]>([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    fetch(`${domain_link}api/product/fetch`)
      .then((res) => res.json())
      .then((data: ProductLayout[]) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
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
      const res = await fetch(`${domain_link}api/product/delete/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(`Deleted product: ${JSON.stringify(result)}`);
      setProducts(products.filter((p) => p._id !== deleteId));
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage("Error deleting product");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delete Products</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td className="border px-4 py-2">{prod.product_name}</td>
              <td className="border px-4 py-2">{prod.price}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => confirmDelete(prod._id!)}
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
              Are you sure you want to delete this product?
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
