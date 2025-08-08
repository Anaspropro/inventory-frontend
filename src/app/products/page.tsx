"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { CrudFilters } from "@refinedev/core";
import debounce from "lodash/debounce";
import Loading from "@/components/ui/loading";
import HamburgerButton from "@/components/ui/hamburger-button";
import { useMenu } from "@/components/layout/menu-context";

export default function ProductList() {
  const { edit, create, list } = useNavigation();
  const { mutate: deleteProduct } = useDelete();
  const { toggleMenu } = useMenu();
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useList({
    resource: "categories",
    pagination: { pageSize: 100 },
  });

  const filters: CrudFilters = useMemo(
    () => {
      const filterArray: CrudFilters = [];
      
      if (searchTerm) {
        filterArray.push({
          field: "name",
          operator: "contains" as const,
          value: searchTerm,
        });
      }
      
      if (selectedCategory) {
        filterArray.push({
          field: "categoryId",
          operator: "eq" as const,
          value: Number(selectedCategory),
        });
      }
      
      return filterArray;
    },
    [searchTerm, selectedCategory]
  );

  const { data, isLoading } = useList({
    resource: "products",
    pagination: {
      current: current,
      pageSize: 10,
    },
    filters: filters.length > 0 ? filters : undefined,
  });

  // Reset pagination when search term or category changes
  useEffect(() => {
    setCurrent(1);
  }, [searchTerm, selectedCategory]);

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
          <h1 className="text-2xl-responsive font-bold">Products</h1>
        </div>

        <div className="header-responsive">
          <div className="actions-responsive">
            <button
              onClick={() => list("categories")}
              className="btn-responsive bg-blue-600 text-white border border-gray-300"
            >
              Manage Categories
            </button>
            <button
              onClick={() => create("products")}
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              Create Product
            </button>
          </div>
        </div>

        <div className="filters-responsive">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={searchTerm}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="form-responsive input w-full md:w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-responsive select w-full md:w-48"
          >
            <option value="">All Categories</option>
            {categoriesData?.data.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrapper-responsive">
          <div className="table-responsive">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">No category</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-500">
                      {product.description}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {product.quantity === 0 && (
                          <svg
                            className="w-4 h-4 text-red-600 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {product.quantity < 5 && product.quantity > 0 && (
                          <svg
                            className="w-4 h-4 text-yellow-600 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {product.quantity >= 5 && (
                          <svg
                            className="w-4 h-4 text-green-600 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span
                          className={
                            product.quantity === 0
                              ? "text-red-600 font-semibold"
                              : product.quantity < 5 && product.quantity > 0
                              ? "text-yellow-600 font-semibold"
                              : product.quantity >= 5
                              ? "text-green-600 font-semibold"
                              : ""
                          }
                        >
                          {product.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity === 0 ? (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Out of Stock
                        </span>
                      ) : product.quantity < 5 ? (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="actions-responsive">
                        <button
                          onClick={() => product.id && edit("products", product.id)}
                          className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (
                              product.id &&
                              window.confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              deleteProduct({
                                resource: "products",
                                id: product.id,
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
      </div>
    </div>
  );
}
