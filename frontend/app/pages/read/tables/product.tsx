import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function ReadProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await fetch(
        `${domain_link}api/product/fetch?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

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

      {/* Loading / Error states */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
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
                  <tr key={prod._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{prod.product_name}</td>
                    <td className="border px-4 py-2">
                      {prod.category_id?.category_name}
                    </td>
                    <td className="border px-4 py-2">
                      {prod.supplier_id?.supplier_name}
                    </td>
                    <td className="border px-4 py-2">{prod.price}</td>
                    <td className="border px-4 py-2">{prod.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
