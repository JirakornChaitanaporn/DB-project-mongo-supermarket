import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export default function CreateProduct() {
  const [product_name, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [supplier_id, setSupplierId] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  // Fetch suppliers and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierRes, categoryRes] = await Promise.all([
          fetch(`${domain_link}api/supplier/fetch`),
          fetch(`${domain_link}api/category/fetch`)
        ]);

        const supplierData = await supplierRes.json();
        const categoryData = await categoryRes.json();
        console.log(categoryData)

        if (supplierRes.ok) {
          setSuppliers(Array.isArray(supplierData) ? supplierData : supplierData.suppliers || []);
        }
        if (categoryRes.ok) {
          setCategories(Array.isArray(categoryData) ? categoryData : categoryData.categories || []);
        }
      } catch (err) {
        console.error("Error fetching suppliers/categories:", err);
      }
    };
    fetchData();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      product_name,
      price: Number(price),
      supplier_id,
      category_id,
      quantity: Number(quantity),
    };

    try {
      const response = await fetch(`${domain_link}api/product/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product created successfully!");
        // Reset form
        setProductName("");
        setPrice(0);
        setSupplierId("");
        setCategoryId("");
        setQuantity(0);
      } else {
        setMessage(data.error || "Error creating product");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating product");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Product Name:</label>
          <input
            type="text"
            value={product_name}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Supplier:</label>
          <select
            value={supplier_id}
            onChange={(e) => setSupplierId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id} className="text-black">
                {supplier.supplier_name} (Contact: {supplier.contacts?.person})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Category:</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id} className="text-black">
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Product
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
