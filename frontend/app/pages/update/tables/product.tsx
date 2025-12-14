import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import BlankPage from "../../../component/Modals/updateModal";

export default function EditProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit logic
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/product/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open modal
  const confirmEdit = (product: any) => {
    setEditProduct({
      ...product,
      category_id: product.category_id?._id || "",
      supplier_id: product.supplier_id?._id || "",
    });
    setShowModal(true);
  };

  // Update product
  const handleUpdate = async (updatedProduct: any) => {
    try {
      const payload = {
        product_name: updatedProduct.product_name,
        category_id: updatedProduct.category_id,
        supplier_id: updatedProduct.supplier_id,
        price: Number(updatedProduct.price),
        quantity: Number(updatedProduct.quantity),
      };

      const res = await fetch(
        `${domain_link}api/product/update/${updatedProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update product");
      }

      const result = await res.json();
      setMessage(`Updated product: ${result.product_name}`);
      console.log(result);
      

      setProducts(products.map((p) => (p._id === result._id ? result : p)));
    } catch (err: any) {
      console.error("Error updating product:", err);
      setMessage("Error updating product");
    } finally {
      setShowModal(false);
      setEditProduct(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Products Management</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Find
        </button>
      </form>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Supplier</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="bg-gray-100">
                    <td className="border px-4 py-2">{prod.product_name}</td>
                    <td className="border px-4 py-2">
                      {prod.category_id?.category_name || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {prod.supplier_id?.supplier_name || "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {prod.quantity}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(prod)}
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
                    colSpan={6}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No products found
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
        title="Edit Product"
        fields={[
          { key: "product_name", label: "Product Name", type: "text" },
          { key: "category_id", label: "Category ID", type: "text" },
          { key: "supplier_id", label: "Supplier ID", type: "text" },
          { key: "price", label: "Price", type: "number" },
          { key: "quantity", label: "Quantity", type: "number" },
        ]}
        entity={editProduct}
        onChange={setEditProduct}
        onSave={() => handleUpdate(editProduct!)}
        onCancel={() => {
          setShowModal(false);
          setEditProduct(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
