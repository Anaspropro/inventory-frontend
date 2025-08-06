"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { CrudFilters } from "@refinedev/core";
import debounce from "lodash/debounce";
import Loading from "@/components/ui/loading";

export default function CategoryList() {
  const { edit, create } = useNavigation();
  const { mutate: deleteCategory } = useDelete();
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filters: CrudFilters = useMemo(
    () => [
      {
        field: "name",
        operator: "contains",
        value: searchTerm,
      },
    ],
    [searchTerm]
  );

  const { data, isLoading } = useList({
    resource: "categories",
    pagination: {
      current: current,
      pageSize: 10,
    },
    filters: searchTerm ? filters : undefined,
  });

  // Fetch all products to calculate category counts
  const { data: productsData } = useList({
    resource: "products",
    pagination: { pageSize: 1000 },
  });

  // Calculate product counts for each category
  const categoryProductCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    productsData?.data.forEach(product => {
      if (product.categoryId) {
        counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [productsData?.data]);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrent(1);
  }, [searchTerm]);

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
    return <Loading />;
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <input
          type="text"
          placeholder="Search categories..."
          defaultValue={searchTerm}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => create("categories")}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
        >
          Create Category
        </button>
      </div>

      <div className="mb-4">
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total Categories: {data?.total || 0}</span>
          <span>Total Products: {productsData?.data.length || 0}</span>
          <span>Categorized Products: {Object.values(categoryProductCounts).reduce((sum, count) => sum + count, 0)}</span>
          <span>Uncategorized Products: {(productsData?.data.length || 0) - Object.values(categoryProductCounts).reduce((sum, count) => sum + count, 0)}</span>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-400 shadow-sm">
        <thead className="bg-gray-300 text-left">
          <tr>
            <th className="border px-3 py-1">Category Name</th>
            <th className="border px-3 py-1">Description</th>
            <th className="border px-3 py-1">Products Count</th>
            <th className="border px-3 py-1">Status</th>
            <th className="border px-3 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((category) => (
            <tr key={category.id}>
              <td className="border px-3 py-1 font-medium">{category.name}</td>
              <td className="border px-3 py-1">{category.description || "No description"}</td>
              <td className="border px-3 py-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {categoryProductCounts[Number(category.id)] || 0} products
                </span>
              </td>
              <td className="border px-3 py-1">
                {category.isActive ? (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </td>
              <td className="border px-3 py-1">
                <div className="space-x-6">
                  <button
                    onClick={() => category.id && edit("categories", category.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        category.id &&
                        window.confirm(
                          "Are you sure you want to delete this category?"
                        )
                      ) {
                        deleteCategory({
                          resource: "categories",
                          id: category.id,
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

      {data?.data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No categories found. Create your first category!
        </div>
      )}
    </div>
  );
}
