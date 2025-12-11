import React, { useState } from "react";
import { domain_link } from "../../domain";

export function CreateCustomer() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [loyalty_point, setLoyaltyPoint] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      first_name,
      last_name,
      email,
      phone_number,
      loyalty_point: Number(loyalty_point),
    };

    try {
      const response = await fetch(`${domain_link}api/customer/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Customer created successfully!");
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setLoyaltyPoint(0);
      } else {
        setMessage(data.error || "Error creating customer");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating customer");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Customer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Phone Number:</label>
          <input
            type="text"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Loyalty Points:</label>
          <input
            type="number"
            value={loyalty_point}
            onChange={(e) => setLoyaltyPoint(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Customer
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
