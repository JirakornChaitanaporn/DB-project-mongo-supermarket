import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function ReadProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch products with server-side pagination
  const fetchProducts = async () => {
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
        `${domain_link}api/product/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products); // only current page
      setTotal(data.total); // total count from backend
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
  // Can add searchTerm in useEffect.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>

      {/* Search bar */}
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
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="bg-gray-100 text-left">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-4 py-2 text-center text-gray-500 text-black"
                  >
                    No products found
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
