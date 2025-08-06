"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { CrudFilters } from "@refinedev/core";
import debounce from "lodash/debounce";
import Loading from "@/components/ui/loading";

export default function SalesList() {
  const { edit, create } = useNavigation();
  const { mutate: deleteSale } = useDelete();
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filters: CrudFilters = useMemo(
    () => [
      {
        field: "saleNumber",
        operator: "contains" as const,
        value: searchTerm,
      },
      ...(statusFilter ? [{
        field: "status",
        operator: "eq" as const,
        value: statusFilter,
      }] : []),
    ],
    [searchTerm, statusFilter]
  );

  const { data, isLoading, refetch } = useList({
    resource: "sales",
    pagination: {
      current: current,
      pageSize: 10,
    },
    filters: searchTerm || statusFilter ? filters : undefined,
    queryOptions: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  });



  // Reset pagination when search term changes
  useEffect(() => {
    setCurrent(1);
  }, [searchTerm, statusFilter]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Refetch data when component mounts
  useEffect(() => {
    refetch();
  }, []); // Empty dependency array to only run on mount

  // Refresh data when page comes into focus (user returns from create/edit)
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading || !data) {
    return <Loading />;
  }

  return (
    <div className="p-3 bg-white rounded-md shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => create("sales")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            Create Sale
          </button>
        </div>
      </div>

      {/* <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by sale number..."
          defaultValue={searchTerm}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div> */}

      <table className="w-full border-collapse border border-gray-400 shadow-sm">
        <thead className="bg-gray-300 text-left">
          <tr>
            <th className="border px-3 py-1">Sale #</th>
            <th className="border px-3 py-1">Customer</th>
            <th className="border px-3 py-1">Status</th>
            <th className="border px-3 py-1">Subtotal</th>
            <th className="border px-3 py-1">Tax</th>
            <th className="border px-3 py-1">Discount</th>
            <th className="border px-3 py-1">Total</th>
            <th className="border px-3 py-1">Date</th>
            <th className="border px-3 py-1">Actions</th>
          </tr>
        </thead>
          <tbody>
           {data?.data?.map((sale: any) => (
            <tr key={sale.id}>
              <td className="border px-3 py-1 font-mono text-xs">{sale.saleNumber}</td>
              <td className="border px-3 py-1">
                <div>
                  <div className="font-medium">{sale.customerName || "N/A"}</div>
                  <div className="text-sm text-gray-500">{sale.customerEmail}</div>
                </div>
              </td>
              <td className="border px-3 py-1">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                  {getStatusText(sale.status)}
                </span>
              </td>
              <td className="border px-3 py-1">${Number(sale.subtotal).toFixed(2)}</td>
              <td className="border px-3 py-1">${Number(sale.tax).toFixed(2)}</td>
              <td className="border px-3 py-1">${Number(sale.discount).toFixed(2)}</td>
              <td className="border px-3 py-1 font-extrabold text-xs">${Number(sale.total).toFixed(2)}</td>
              <td className="border px-3 py-1 text-xs">
                {new Date(sale.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-3 py-1">
                <div className="space-x-2">
                  <button
                    onClick={() => sale.id && edit("sales", sale.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      if (
                        sale.id &&
                        window.confirm(
                          "Are you sure you want to delete this sale?"
                        )
                      ) {
                        deleteSale({
                          resource: "sales",
                          id: sale.id,
                        });
                      }
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

             {(!data?.data || data.data.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No sales found. Create your first sale!
        </div>
      )}
    </div>
  );
}
