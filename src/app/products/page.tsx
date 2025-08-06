"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { CrudFilters } from "@refinedev/core";
import debounce from "lodash/debounce";
import Loading from "@/components/ui/loading";

export default function ProductList() {
  const { edit, create, list } = useNavigation();
  const { mutate: deleteProduct } = useDelete();
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

 if (isLoading)
   return (
     <Loading />
   );



  return (
    <div className="p-4 bg-white rounded-md shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => list("categories")}
            className="bg-blue-600 text-white text-sm border border-gray-300 rounded-md px-4 py-2"
          >
            Manage Categories
          </button>
          {/* <input
            type="text"
            placeholder="Search products..."
            defaultValue={searchTerm}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categoriesData?.data.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select> */}
          <button
            onClick={() => create("products")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            Create Product
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-400 shadow-sm">
        <thead className="bg-gray-300 text-left">
          <tr>
            <th className="border px-3 py-1">Product</th>
            <th className="border px-3 py-1">Category</th>
            <th className="border px-3 py-1">Description</th>
            <th className="border px-3 py-1">Price</th>
            <th className="border px-3 py-1">Quantity</th>
            <th className="border px-3 py-1">Status</th>
            <th className="border px-3 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((product) => (
            <tr key={product.id}>
              <td className="border px-3 py-1">{product.name}</td>
              <td className="border px-3 py-1">
                {product.category ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category.name}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">No category</span>
                )}
              </td>
              <td className="border px-3 py-1">{product.description}</td>
              <td className="border px-3 py-1">
                ${Number(product.price).toFixed(2)}
              </td>
              <td className="border px-3 py-1">
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
              <td className="border px-3 py-1">
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
              <td className="border px-2 py-1">
                <div className="space-x-2">
                  <button
                    onClick={() => product.id && edit("products", product.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
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

      {/* <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {data?.total ? (
            <>
              Showing {(current - 1) * 10 + 1}-
              {Math.min(current * 10, data.total)} of {data.total} products
            </>
          ) : (
            "No products found"
          )}
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
          <span className="px-3 py-1 bg-gray-100 rounded">
            Page {current} of {Math.ceil((data?.total || 0) / 10)}
          </span>
          <button
            onClick={() => setCurrent((prev) => prev + 1)}
            disabled={!data?.total || current >= Math.ceil(data.total / 10)}
            className={`px-3 py-1 rounded ${
              !data?.total || current >= Math.ceil(data.total / 10)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
}
