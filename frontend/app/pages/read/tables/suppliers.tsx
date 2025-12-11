import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function ReadSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Fetch suppliers (with optional search)
  const fetchSuppliers = async (searchTerm = "") => {
    try {
      const response = await fetch(
        `${domain_link}api/supplier/fetch?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();

      if (response.ok) {
        setSuppliers(data);
        setMessage("");
      } else {
        setMessage(data.error || "Error fetching suppliers");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while fetching suppliers");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuppliers(search);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Suppliers</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by supplier name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <ul className="space-y-3">
        {suppliers.map((supplier) => (
          <li
            key={supplier._id}
            className="border border-gray-300 rounded p-3 shadow-sm"
          >
            <h3 className="font-semibold">{supplier.supplier_name}</h3>
            <p>Contact: {supplier.contacts?.person} ({supplier.contacts?.phone})</p>
            <p>Email: {supplier.contacts?.email || "N/A"}</p>
            <p>
              Address: {supplier.address?.street}, {supplier.address?.city},{" "}
              {supplier.address?.postal_code}, {supplier.address?.country}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
