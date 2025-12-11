import React, { useState, useEffect } from "react";

import { domain_link } from "../../domain";
import type { ProductLayout } from "../../../types/product";

export function UpdateProduct() {

  const [products, setProducts] = useState<ProductLayout[]>([]);
  const [selectedId, setSelectedId] = useState("");

  const [id, setId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [supplierId, setSupplierId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);

  const [message, setMessage] = useState("");

  // Fetch all products when page loads
  useEffect(() => {
    fetch(`${domain_link}api/product/fetch`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);


  useEffect(() => {
    if (selectedId) {
      const prod = products.find((p: ProductLayout) => p._id === selectedId);
      if (prod) {
        setId(prod._id);
        setProductName(prod.product_name);
        setPrice(prod.price);
        setSupplierId(prod.supplier_id || "");
        setCategoryId(prod.category_id || "");
        setQuantity(prod.quantity);
      }
    }
  }, [selectedId, products]);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      product_name: productName,
      price: Number(price),
      supplier_id: supplierId,
      category_id: categoryId,
      quantity: Number(quantity),
      updated_at: new Date().toISOString(), // use updated_at instead of created_at
    };

    try {
      const response = await fetch(`${domain_link}api/product/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      setMessage(`Updated product: ${JSON.stringify(result)}`);
    } catch (err) {
      console.error("Error updating product:", err);
      setMessage("Error updating product");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Update Product</h2>

      {/* Dropdown to select product */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select a product</option>
        {products.map((prod: any) => (
          <option key={prod._id} value={prod._id}>
            {prod.product_name} (Price: {prod.price})
          </option>
        ))}
      </select>

      {/* Update form */}
      {selectedId && (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Supplier ID"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-2 w-full"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

