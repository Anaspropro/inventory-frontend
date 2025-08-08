"use client";

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { CrudFilters } from "@refinedev/core";
import debounce from "lodash/debounce";
import Loading from "@/components/ui/loading";
import HamburgerButton from "@/components/ui/hamburger-button";
import { useMenu } from "@/components/layout/menu-context";

export default function CategoryList() {
  const { edit, create } = useNavigation();
  const { mutate: deleteCategory } = useDelete();
  const { toggleMenu } = useMenu();
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
          <h1 className="text-2xl-responsive font-bold">Categories</h1>
        </div>

        <div className="header-responsive">
          <div className="actions-responsive">
            <input
              type="text"
              placeholder="Search categories..."
              defaultValue={searchTerm}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="form-responsive input w-full md:w-64"
            />
            <button
              onClick={() => create("categories")}
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              Create Category
            </button>
          </div>
        </div>

        <div className="card-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Categories:</span> {data?.total || 0}
            </div>
            <div>
              <span className="font-medium">Total Products:</span> {productsData?.data.length || 0}
            </div>
            <div>
              <span className="font-medium">Categorized:</span> {Object.values(categoryProductCounts).reduce((sum, count) => sum + count, 0)}
            </div>
            <div>
              <span className="font-medium">Uncategorized:</span> {(productsData?.data.length || 0) - Object.values(categoryProductCounts).reduce((sum, count) => sum + count, 0)}
            </div>
          </div>
        </div>

        <div className="table-wrapper-responsive">
          <div className="table-responsive">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products Count
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
                {data?.data.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-500">
                      {category.description || "No description"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categoryProductCounts[Number(category.id)] || 0} products
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="actions-responsive">
                        <button
                          onClick={() => category.id && edit("categories", category.id)}
                          className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
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

        {data?.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found. Create your first category!
          </div>
        )}
      </div>
    </div>
  );
}
