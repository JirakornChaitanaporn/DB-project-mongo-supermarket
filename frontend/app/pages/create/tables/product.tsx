import React, { useState } from "react";
import { domain_link } from "../../domain";
import SelectEntityModal from "../../../component/Modals/selectModal";

export default function CreateProduct() {
  const [product_name, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [supplier_id, setSupplierId] = useState("");
  const [supplier_name, setSupplierName] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [category_name, setCategoryName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Submit product
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
        // reset form
        setProductName("");
        setPrice(0);
        setSupplierId("");
        setSupplierName("");
        setCategoryId("");
        setCategoryName("");
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

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Product Name:</label>
          <input
            type="text"
            value={product_name}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
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
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        {/* Supplier Selection */}
        <div>
          <label className="block font-medium">Supplier:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={supplier_name}
              readOnly
              placeholder="No supplier selected"
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowSupplierModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Supplier
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block font-medium">Category:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={category_name}
              readOnly
              placeholder="No category selected"
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Select Category
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
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

      {/* Supplier Modal */}
      <SelectEntityModal
        show={showSupplierModal}
        title="Select Supplier"
        fetchUrl="api/supplier/fetch"
        columns={[
          { key: "supplier_name", label: "Supplier" },
        ]}
        onSelect={(supplier) => {
          setSupplierId(supplier._id);
          setSupplierName(supplier.supplier_name);
          setShowSupplierModal(false);
        }}
        onCancel={() => setShowSupplierModal(false)}
      />

      {/* Category Modal */}
      <SelectEntityModal
        show={showCategoryModal}
        title="Select Category"
        fetchUrl="api/category/fetch"
        columns={[
          { key: "category_name", label: "Category" },
        ]}
        onSelect={(category) => {
          setCategoryId(category._id);
          setCategoryName(category.category_name);
          setShowCategoryModal(false);
        }}
        onCancel={() => setShowCategoryModal(false)}
      />
    </div>
  );
}
