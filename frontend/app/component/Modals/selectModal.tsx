import React, { useState, useEffect } from "react";
import { domain_link } from "../../pages/domain";

type Column = { key: string; label: string };

interface SelectEntityModalProps {
  show: boolean;
  title: string;
  fetchUrl: string;
  columns: Column[];
  onSelect: (entity: any) => void;
  onCancel: () => void;
}

export default function SelectEntityModal({
  show,
  title,
  fetchUrl,
  columns,
  onSelect,
  onCancel,
}: SelectEntityModalProps) {
  const [entities, setEntities] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("search", searchTerm);
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", itemsPerPage.toString());

        const response = await fetch(`${domain_link}${fetchUrl}?${queryParams.toString()}`);
        const data = await response.json();
        if (response.ok) {
          setEntities(data.roles || data.customers || data.employees || []); // adapt based on API
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error("Error fetching entities:", err);
      }
    };
    fetchEntities();
  }, [searchTerm, currentPage, fetchUrl]);

  const totalPages = Math.ceil(total / itemsPerPage);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[500px] h-[600px] max-w-full p-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">{title}</h3>

        {/* Search */}
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-black"
        />

        {/* Table */}
        <div className="border border-gray-300 overflow-hidden flex-1">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="border px-4 py-2 text-left">{col.label}</th>
                ))}
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {entities.map((entity) => (
                <tr key={entity._id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="border px-4 py-2">{entity[col.key]}</td>
                  ))}
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => onSelect(entity)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Cancel */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
