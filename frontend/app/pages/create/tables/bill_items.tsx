import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

// Interfaces
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
  product_id: {
    _id: string;
    product_name: string;
    price: number;
  };
  discount_type: "percent" | "amount";
  discount_value: number;
  start_date: string;
  end_date: string;
}

export default function CreateBillItem() {
  const [bill_id, setBillId] = useState<string>("");
  const [product_id, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [promotion_id, setPromotionId] = useState<string>("");
  const [bills, setBills] = useState<Bill[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [message, setMessage] = useState<string>("");

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billRes, prodRes, promoRes] = await Promise.all([
          fetch(`${domain_link}api/bill/fetch`),
          fetch(`${domain_link}api/product/fetch`),
          fetch(`${domain_link}api/promotion/fetch`)
        ]);

        const billData = await billRes.json();
        const prodData = await prodRes.json();
        const promoData = await promoRes.json();

        if (billRes.ok) setBills(billData.bills || billData || []);
        if (prodRes.ok) setProducts(prodData.products || prodData || []);
        if (promoRes.ok) setPromotions(promoData.promotions || promoData || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, []);


  // Calculate final price live
  const calculateFinalPrice = (): number => {
    const product = products.find(p => p._id === product_id);
    const price = product?.price || 0;
    const subtotal = price * quantity;

    const promo = promotions.find(pr => pr._id === promotion_id);
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
          return Math.max(subtotal - (promo.discount_value * quantity), 0);
        }
      }
    }
    return subtotal;
  };

  // Submit single bill item
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bill_id || !product_id) {
      setMessage("Please select a Bill and Product.");
      return;
    }

    try {
      const product = products.find(p => p._id === product_id);
      const price = product?.price || 0;
      const final_price = calculateFinalPrice();

      // Create BillItem
      const bodyData = {
        bill_id,
        product_id,
        quantity,
        promotion: promotion_id || null,
        price,
        final_price
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
        setBillId("");
        setProductId("");
        setQuantity(1);
        setPromotionId("");
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
        {/* Bill Selector */}
        <div>
          <label className="block font-medium">Bill:</label>
          <select
            value={bill_id}
            onChange={(e) => setBillId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Bill</option>
            {bills.map((b) => (
              <option key={b._id} value={b._id} className="text-black">
                Bill #{b._id} (Total: ${b.total_amount})
              </option>
            ))}
          </select>
        </div>

        {/* Product Selector */}
        <div>
          <label className="block font-medium">Product:</label>
          <select
            value={product_id}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.product_name} (${p.price})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium">Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Promotion Selector */}
        <div>
          <label className="block font-medium">Promotion:</label>
          <select
            value={promotion_id}
            onChange={(e) => setPromotionId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          >
            <option value="">No Promotion</option>
            {promotions
              .filter((promo) => promo.product_id?._id === product_id)
              .map((promo) => (
                <option key={promo._id} value={promo._id}>
                  {promo.promotion_name}{" "}
                  {promo.discount_type === "percent"
                    ? `(-${promo.discount_value}%)`
                    : `(Save $${promo.discount_value})`}
                </option>
              ))}
          </select>
        </div>

        {/* Final Price Display */}
        <div>
          <label className="block font-medium">Final Price:</label>
          <p className="text-lg font-semibold text-blue-600">
            ${calculateFinalPrice()}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product to Bill
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
