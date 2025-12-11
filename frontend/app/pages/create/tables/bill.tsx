import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function CreateBill() {
  const [customer_id, setCustomerId] = useState<string | null>(null);
  const [employee_id, setEmployeeId] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, empRes] = await Promise.all([
          fetch(`${domain_link}api/customer/fetch`),
          fetch(`${domain_link}api/employee/fetch`)
        ]);

        if (custRes.ok) setCustomers(await custRes.json());
        if (empRes.ok) setEmployees(await empRes.json());
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, []);

  // Submit bill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = { customer_id, employee_id };

    try {
      const response = await fetch(`${domain_link}api/bill/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Bill created successfully!");
        setCustomerId("");
        setEmployeeId("");
      } else {
        setMessage(data.error || "Error creating bill");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error while creating bill");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer */}
        <div>
          <label className="block font-medium">Customer:</label>
          <select
            value={customer_id ?? ""}
            onChange={(e) => setCustomerId(e.target.value === "null" ? null : e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {/* None option */}
            <option value="null" className="text-black">Guest</option>

            {/* Existing customers */}
            {customers.map((c) => (
              <option key={c._id} value={c._id} className="text-black">
                {c.first_name} {c.last_name.charAt(0).toUpperCase() + "."}
              </option>
            ))}
          </select>
        </div>

        {/* Employee */}
        <div>
          <label className="block font-medium">Employee:</label>
          <select
            value={employee_id}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="" className="text-black">Select Employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id} className="text-black">
                {e.first_name} {e.last_name.charAt(0).toUpperCase() + "."}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-red-800">Bill Product will be add from Bill_Item.</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Bill
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
