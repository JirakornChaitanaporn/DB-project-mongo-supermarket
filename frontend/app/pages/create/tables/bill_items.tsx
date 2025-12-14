import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";
import SelectEntityModal from "../../../component/Modals/selectModal";

interface Bill {
  _id: string;
  total_amount: number;
}

interface Product {
  _id: string;
  product_name: string;
  price: number;
}

interface Promotion {
  _id: string;
  promotion_name: string;
  product_id: { _id: string; product_name: string; price: number };
  discount_type: "percent" | "amount";
  discount_value: number;
  start_date: string;
  end_date: string;
}

export default function CreateBillItem() {
  const [bill_id, setBillId] = useState("");
  const [bill_name, setBillName] = useState("");

  const [product_id, setProductId] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_price, setProductPrice] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [promotion_id, setPromotionId] = useState("");
  const [promotion_name, setPromotionName] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const [message, setMessage] = useState("");

  const [showBillModal, setShowBillModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // 🔥 Fetch promotions when product changes
  useEffect(() => {
    const fetchPromotions = async () => {
      if (!product_id) {
        setPromotions([]);
        return;
      }
      try {
        const response = await fetch(
          `${domain_link}api/promotion/fetch?product_id=${product_id}`
        );
        const data = await response.json();
        if (response.ok) {
          setPromotions(data.promotions || []);
        } else {
          setPromotions([]);
        }
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setPromotions([]);
      }
    };
    fetchPromotions();
  }, [product_id]);

  // Calculate final price live
  const calculateFinalPrice = (): number => {
    const subtotal = product_price * quantity;
    const promo = promotions.find((pr) => pr._id === promotion_id);

    if (promo) {
      const now = new Date();
      const start = new Date(promo.start_date);
      const end = new Date(promo.end_date);

      const withinPeriod = now >= start && now <= end;
      if (withinPeriod) {
        if (promo.discount_type === "percent") {
          const discount = (promo.discount_value / 100) * subtotal;
          return Math.max(subtotal - discount, 0);
        } else if (promo.discount_type === "amount") {
          return Math.max(subtotal - promo.discount_value * quantity, 0);
        }
      }
    }
    return subtotal;
  };

  // Submit bill item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bill_id || !product_id) {
      setMessage("Please select a Bill and Product.");
      return;
    }

    try {
      const final_price = calculateFinalPrice();
      const bodyData = {
        bill_id,
        product_id,
        quantity,
        promotion: promotion_id || null,
        price: product_price,
        final_price,
      };

      const response = await fetch(`${domain_link}api/billitem/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error creating bill item");

      if (response.ok) {
        setMessage("Bill updated with new product successfully!");
        setBillId(""); setBillName("");
        setProductId(""); setProductName(""); setProductPrice(0);
        setQuantity(1);
        setPromotionId(""); setPromotionName("");
      } else {
        const errData = await response.json();
        setMessage(errData.error || "Error updating bill");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating bill item");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Product to Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bill Selection */}
        <div>
          <label className="block font-medium">Bill:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={bill_name}
              readOnly
              placeholder="No bill selected"
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowBillModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Bill
            </button>
          </div>
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

        {/* Quantity */}
        <div>
          <label className="block font-medium">Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-2 py-1 bg-gray-100 text-black"
          />
        </div>

        {/* Promotion Dropdown */}
        <div>
          <label className="block font-medium">Promotion:</label>
          <select
            value={promotion_id}
            onChange={(e) => setPromotionId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          >
            <option value="">No Promotion</option>
            {promotions.map((promo) => (
              <option key={promo._id} value={promo._id}>
                {promo.promotion_name}{" "}
                {promo.discount_type === "percent"
                  ? `(-${promo.discount_value}%)`
                  : `(Save $${promo.discount_value})`}
              </option>
            ))}
          </select>
        </div>

        {/* Final Price */}
        <div>
          <label className="block font-medium">Final Price:</label>
          <p className="text-lg font-semibold text-blue-600">
            ${calculateFinalPrice()}
          </p>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product to Bill
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}

      {/* Bill Modal */}
      <SelectEntityModal
        show={showBillModal}
        title="Select Bill"
        fetchUrl="api/bill/fetch"
        columns={[
          { key: "_id", label: "Bill ID" },
          { key: "total_amount", label: "Total Amount" },
        ]}
        onSelect={(bill: Bill) => {
          setBillId(bill._id);
          setBillName(`Bill #${bill._id} (Total: $${bill.total_amount})`);
          setShowBillModal(false);
        }}
        onCancel={() => setShowBillModal(false)}
      />

      {/* Product Modal */}
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
          setProductName(`${product.product_name} ($${product.price})`);
          setProductPrice(product.price);
          setShowProductModal(false);
        }}
        onCancel={() => setShowProductModal(false)}
      />
    </div>
  );
}
