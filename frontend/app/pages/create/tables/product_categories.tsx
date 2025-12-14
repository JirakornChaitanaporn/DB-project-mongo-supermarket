import React, { useState } from "react";
import { domain_link } from "../../domain";

export default function CreateProductCategories() {
  const [category_name, setCategoryName] = useState("");
  const [category_description, setCategoryDesc] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      category_name,        // ✅ fixed typo
      category_description,
    };

    try {
      const response = await fetch(`${domain_link}api/category/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Category created successfully!");
        setCategoryName("");
        setCategoryDesc("");
      } else {
        setMessage(data.error || "Error creating category");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating category");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Category Name:</label>
          <input
            type="text"
            value={category_name}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        <div>
          <label className="block font-medium">Category Description:</label>
          <textarea
            value={category_description}
            onChange={(e) => setCategoryDesc(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Category
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
