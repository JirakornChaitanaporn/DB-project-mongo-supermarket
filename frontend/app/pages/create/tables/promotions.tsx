import React, { useState } from "react";
import { domain_link } from "../../domain";
import SelectEntityModal from "../../../component/Modals/selectModal";

export default function CreatePromotion() {
  const [promotion_name, setPromotionName] = useState("");
  const [product_id, setProductId] = useState("");
  const [product_name, setProductName] = useState("");
  const [discount_type, setDiscountType] = useState("amount");
  const [discount_value, setDiscountValue] = useState(0);
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);

  // Submit promotion
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
        setProductName("");
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

      {/* Promotion Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Promotion Name:</label>
          <input
            type="text"
            value={promotion_name}
            onChange={(e) => setPromotionName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block font-medium">Product:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={product_name}
              readOnly
              placeholder="No product selected"
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Product
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Discount Type:</label>
          <select
            value={discount_type}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
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
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        <div>
          <label className="block font-medium">Start Date:</label>
          <input
            type="date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        <div>
          <label className="block font-medium">End Date:</label>
          <input
            type="date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
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

      {/* Product Selection Modal */}
      <SelectEntityModal
        show={showProductModal}
        title="Select Product"
        fetchUrl="api/product/fetch"
        columns={[
          { key: "product_name", label: "Product" },
          { key: "price", label: "Price" },
        ]}
        onSelect={(product) => {
          setProductId(product._id);
          setProductName(product.product_name);
          setShowProductModal(false);
        }}
        onCancel={() => setShowProductModal(false)}
      />
    </div>
  );
}
