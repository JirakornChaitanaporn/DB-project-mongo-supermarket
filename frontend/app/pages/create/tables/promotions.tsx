import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function CreatePromotion() {
  const [promotion_name, setPromotionName] = useState("");
  const [product_id, setProductId] = useState("");
  const [discount_type, setDiscountType] = useState("amount");
  const [discount_value, setDiscountValue] = useState(0);
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${domain_link}api/product/fetch`);
        const data = await response.json();

        if (response.ok) {
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      promotion_name,
      product_id,
      discount_type,
      discount_value: Number(discount_value),
      start_date,
      end_date,
    };

    try {
      const response = await fetch(`${domain_link}api/promotion/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Promotion created successfully!");
        // Reset form
        setPromotionName("");
        setProductId("");
        setDiscountType("amount");
        setDiscountValue(0);
        setStartDate("");
        setEndDate("");
      } else {
        setMessage(data.error || "Error creating promotion");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating promotion");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Promotion</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Promotion Name:</label>
          <input
            type="text"
            value={promotion_name}
            onChange={(e) => setPromotionName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Product:</label>
          <select
            value={product_id}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id} className="text-black">
                {product.product_name} (Price: {product.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Discount Type:</label>
          <select
            value={discount_type}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="amount" className="text-black">Amount</option>
            <option value="percent" className="text-black">Percent</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Discount Value:</label>
          <input
            type="number"
            value={discount_value}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
            required
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Start Date:</label>
          <input
            type="date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">End Date:</label>
          <input
            type="date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Promotion
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
