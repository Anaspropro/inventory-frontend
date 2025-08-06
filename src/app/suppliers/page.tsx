"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState } from "react";
import { CrudFilters } from "@refinedev/core";
import Loading from "@/components/ui/loading";

export default function SupplierList() {
  const { edit, create } = useNavigation();
  const { mutate: deleteSupplier } = useDelete();
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filters: CrudFilters = [
    {
      field: "name",
      operator: "contains",
      value: searchTerm,
    },
  ];

  const { data, isLoading } = useList({
    resource: "suppliers",
    pagination: {
      current: current,
      pageSize: 10,
    },
    filters: searchTerm ? filters : undefined,
  });

  if (isLoading)
    return <Loading />;

  return (
    <div className="p-6 bg-white rounded-md shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button
          onClick={() => create("suppliers")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Add Supplier
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Contact Person</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((supplier) => (
            <tr key={supplier.id}>
              <td className="border px-4 py-2">{supplier.name}</td>
              <td className="border px-4 py-2">{supplier.contactPerson}</td>
              <td className="border px-4 py-2">{supplier.email}</td>
              <td className="border px-4 py-2">{supplier.phone}</td>
              <td className="border px-4 py-2">
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      supplier.id && edit("suppliers", supplier.id)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        supplier.id &&
                        window.confirm(
                          "Are you sure you want to delete this supplier?"
                        )
                      ) {
                        deleteSupplier({
                          resource: "suppliers",
                          id: supplier.id,
                        });
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {data?.data.length || 0} of {data?.total || 0} suppliers
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
            disabled={current === 1}
            className={`px-3 py-1 rounded ${
              current === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded">Page {current}</span>
          <button
            onClick={() => setCurrent((prev) => prev + 1)}
            disabled={!data?.data.length || data?.data.length < 10}
            className={`px-3 py-1 rounded ${
              !data?.data.length || data?.data.length < 10
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
