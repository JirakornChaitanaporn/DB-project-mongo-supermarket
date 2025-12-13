import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

interface CategoryLayout {
  _id: string;
  category_name: string;
  category_description?: string;
}

export function DeleteCategory() {
  const [categories, setCategories] = useState<CategoryLayout[]>([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    fetch(`${domain_link}api/category/fetch`)
      .then((res) => res.json())
      .then((data: CategoryLayout[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
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
      const res = await fetch(`${domain_link}api/category/delete/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(`Deleted category: ${JSON.stringify(result)}`);
      setCategories(categories.filter((c) => c._id !== deleteId));
    } catch (err) {
      console.error("Error deleting category:", err);
      setMessage("Error deleting category");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delete Categories</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Category Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="border px-4 py-2">{cat.category_name}</td>
              <td className="border px-4 py-2">{cat.category_description || "-"}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => confirmDelete(cat._id!)}
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
              Are you sure you want to delete this category?
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
