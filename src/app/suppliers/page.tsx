"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState } from "react";
import { CrudFilters } from "@refinedev/core";
import Loading from "@/components/ui/loading";
import HamburgerButton from "@/components/ui/hamburger-button";
import { useMenu } from "@/components/layout/menu-context";

export default function SupplierList() {
  const { edit, create } = useNavigation();
  const { mutate: deleteSupplier } = useDelete();
  const { toggleMenu } = useMenu();
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

  if (isLoading) {
    return (
      <div className="loading-responsive">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container-responsive p-responsive">
      <div className="space-responsive">
        <div className="flex items-center gap-4 mb-6">
          <HamburgerButton onClick={toggleMenu} />
          <h1 className="text-2xl-responsive font-bold">Suppliers</h1>
        </div>

        <div className="header-responsive">
          <div className="actions-responsive">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-responsive input w-full md:w-64"
            />
            <button
              onClick={() => create("suppliers")}
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              Add Supplier
            </button>
          </div>
        </div>

        <div className="table-wrapper-responsive">
          <div className="table-responsive">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.contactPerson}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.email}
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.phone}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="actions-responsive">
                        <button
                          onClick={() => supplier.id && edit("suppliers", supplier.id)}
                          className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
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
                          className="btn-responsive bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing {data?.data.length || 0} of {data?.total || 0} suppliers
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
              disabled={current === 1}
              className={`btn-responsive ${
                current === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="px-3 py-2 bg-gray-100 rounded-md text-sm">Page {current}</span>
            <button
              onClick={() => setCurrent((prev) => prev + 1)}
              disabled={!data?.data.length || data?.data.length < 10}
              className={`btn-responsive ${
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
    </div>
  );
}
