import React, { useState, useEffect } from "react";
import { domain_link } from "../../domain";

import BlankPage from "../../../component/Modals/updateModal";

export default function EditCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit modal logic
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any | null>(null);

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", rowsPerPage.toString());

    try {
      const response = await fetch(
        `${domain_link}api/customer/fetch?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch customers");
      }

      const data = await response.json();

      if (data.customers && data.total !== undefined) {
        setCustomers(data.customers);
        setTotal(data.total);
      } else if (Array.isArray(data)) {
        setCustomers(data);
        setTotal(data.length);
      } else {
        setCustomers([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      setError(err.message);
      setCustomers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Open modal
  const confirmEdit = (customer: any) => {
    setEditCustomer({ ...customer });
    setShowModal(true);
  };

  // Update customer
  const handleUpdate = async (updatedCustomer: any) => {
    try {
      const payload = {
        first_name: updatedCustomer.first_name,
        last_name: updatedCustomer.last_name,
        email: updatedCustomer.email,
        phone_number: updatedCustomer.phone_number,
        loyalty_point: updatedCustomer.loyalty_point,
      };

      const res = await fetch(
        `${domain_link}api/customer/update/${updatedCustomer._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update customer");
      }

      const result = await res.json();
      setMessage(`Updated customer: ${result.first_name} ${result.last_name}`);

      setCustomers(customers.map((c) => (c._id === result._id ? result : c)));
    } catch (err: any) {
      console.error("Error updating customer:", err);
      setMessage("Error updating customer");
    } finally {
      setShowModal(false);
      setEditCustomer(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Customers Management</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Find
        </button>
      </form>

      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-black">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Loyalty Points</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="border px-4 py-2">
                      {customer.email || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {customer.phone_number || "—"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {customer.loyalty_point || 0}
                    </td>
                    <td className="border px-4 py-2">
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => confirmEdit(customer)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <BlankPage
        show={showModal}
        title="Edit Customer"
        fields={[
          { key: "first_name", label: "First Name", type: "text" },
          { key: "last_name", label: "Last Name", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone_number", label: "Phone", type: "text" },
          {
            key: "loyalty_point",
            label: "Loyalty Points",
            type: "number",
          },
        ]}
        entity={editCustomer}
        onChange={setEditCustomer}
        onSave={() => handleUpdate(editCustomer!)}
        onCancel={() => {
          setShowModal(false);
          setEditCustomer(null);
        }}
      />

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
