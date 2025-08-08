"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { CrudFilters } from "@refinedev/core";
import debounce from "lodash/debounce";
import Loading from "@/components/ui/loading";
import HamburgerButton from "@/components/ui/hamburger-button";
import { useMenu } from "@/components/layout/menu-context";

export default function SalesList() {
  const { edit, create } = useNavigation();
  const { mutate: deleteSale } = useDelete();
  const { toggleMenu } = useMenu();
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
          <h1 className="text-2xl-responsive font-bold">Sales</h1>
        </div>

        <div className="header-responsive">
          <div className="actions-responsive">
            <button
              onClick={() => refetch()}
              className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              onClick={() => create("sales")}
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              Create Sale
            </button>
          </div>
        </div>

        <div className="filters-responsive">
          <input
            type="text"
            placeholder="Search by sale number..."
            defaultValue={searchTerm}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="form-responsive input w-full md:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-responsive select w-full md:w-48"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="table-wrapper-responsive">
          <div className="table-responsive">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale #
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {sale.saleNumber}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{sale.customerName || "N/A"}</div>
                        <div className="text-sm text-gray-500">{sale.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                        {getStatusText(sale.status)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(sale.subtotal).toFixed(2)}
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(sale.tax).toFixed(2)}
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(sale.discount).toFixed(2)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${Number(sale.total).toFixed(2)}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="actions-responsive">
                        <button
                          onClick={() => sale.id && edit("sales", sale.id)}
                          className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
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

        {(!data?.data || data.data.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No sales found. Create your first sale!
          </div>
        )}
      </div>
    </div>
  );
}
