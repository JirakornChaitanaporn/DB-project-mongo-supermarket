import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

export function DeleteCustomer() {
  // Inline interface definition
  interface CustomerLayout {
    _id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone_number?: string;
    loyalty_point?: number;
    created_at?: string;
  }

  const [customers, setCustomers] = useState<CustomerLayout[]>([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch customers
  useEffect(() => {
    fetch(`${domain_link}api/customer/fetch`)
      .then((res) => res.json())
      .then((data: CustomerLayout[]) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // Trigger modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Perform delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${domain_link}api/customer/delete/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(`Deleted customer: ${JSON.stringify(result)}`);
      setCustomers(customers.filter((c) => c._id !== deleteId));
    } catch (err) {
      console.error("Error deleting customer:", err);
      setMessage("Error deleting customer");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delete Customers</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Loyalty Points</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust._id}>
              <td className="border px-4 py-2">{cust.first_name}</td>
              <td className="border px-4 py-2">{cust.last_name}</td>
              <td className="border px-4 py-2">{cust.email || "-"}</td>
              <td className="border px-4 py-2">{cust.phone_number || "-"}</td>
              <td className="border px-4 py-2">{cust.loyalty_point ?? 0}</td>
              <td className="border px-4 py-2">
                {cust.created_at
                  ? new Date(cust.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => confirmDelete(cust._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <p className="mb-4 text-center text-black">
              Are you sure you want to delete this customer?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
