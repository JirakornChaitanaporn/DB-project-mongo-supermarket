import React, { useState } from "react";

import { domain_link } from "../../domain"

export function CreateProduct() {

    const [productName, setProductName] = useState("");
    const [price,       setPrice]       = useState("");
    const [supplierId,  setSupplierId]  = useState("");
    const [categoryId,  setCategoryId]  = useState("");
    const [quantity,    setQuantity]    = useState("");

    const bodyData = {
        product_name:   productName,
        price:          Number(price),
        supplier_id:    supplierId,
        category_id:    categoryId,
        quantity:       Number(quantity),
        created_at:     new Date().toISOString(),
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();

    try {
        // Checking what was sending in log.
        console.log(bodyData)

      const response = await fetch(`${domain_link}api/product/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            console.log("Product created successfully!");
            setProductName("");
            setPrice("");
        } else {
            console.log("Error: " + data.error);
        }
        } catch (err) {
        console.error(err);
        }
    };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label>supplierId:</label>
        <input
        type="text"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
        placeholder="Supplier ID"
        required
        />
      </div>

      <div>
        <label>categoryId:</label>
        <input
        type="text"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Category ID"
        required
        />
      </div>
      
      <div>
        <label>quantity:</label>
        <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        />
      </div>

      <button type="button">Create Product</button>
    </form>
  );
}
    