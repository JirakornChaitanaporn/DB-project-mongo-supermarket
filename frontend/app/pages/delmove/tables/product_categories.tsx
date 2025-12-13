import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import ConfirmModal from "../../../component/Modals/deleteModal";

export default function DeleteCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const rowsPerPage = 10;

  // Delete logic
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);

    try {
      const response = await fetch(
        `${domain_link}api/category/fetch?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch categories");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === "object") {
        setCategories(data.category || data.categories || data.data || []);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories();
  };

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / rowsPerPage);

  // Open modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${domain_link}api/category/delete/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete category");
      }

      const result = await res.json();
      setMessage(`Deleted category: ${result.category_name || deleteId}`);
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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Product Categories Management</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by category name..."
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

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <p className="mb-2 text-sm text-gray-600">
            Total categories: {categories.length}
          </p>

          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Category Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <tr key={category._id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {category.category_name}
                    </td>
                    <td className="border px-4 py-2">
                      {category.category_description || "—"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmDelete(category._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No categories found
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

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowModal(false);
          setDeleteId(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
