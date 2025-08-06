"use client";

import { useList } from "@refinedev/core";

export default function CategoryStats() {
  const { data: categoriesData } = useList({
    resource: "categories",
    pagination: { pageSize: 100 },
  });

  const { data: productsData } = useList({
    resource: "products",
    pagination: { pageSize: 1000 },
  });

  const categoryStats = categoriesData?.data.map(category => {
    const productsInCategory = productsData?.data.filter(
      product => product.categoryId === Number(category.id)
    ) || [];
    
    return {
      id: category.id,
      name: category.name,
      productCount: productsInCategory.length,
      totalValue: productsInCategory.reduce((sum, product) => 
        sum + (Number(product.price) * Number(product.quantity)), 0
      ),
    };
  }) || [];

  const totalProducts = productsData?.data.length || 0;
  const categorizedProducts = productsData?.data.filter(p => p.categoryId && p.categoryId > 0).length || 0;
  const uncategorizedProducts = totalProducts - categorizedProducts;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Category Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{categorizedProducts}</div>
          <div className="text-sm text-gray-600">Categorized</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{uncategorizedProducts}</div>
          <div className="text-sm text-gray-600">Uncategorized</div>
        </div>
      </div>

      {categoryStats.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Products by Category</h4>
          <div className="space-y-2">
            {categoryStats
              .sort((a, b) => b.productCount - a.productCount)
              .slice(0, 5)
              .map((stat) => (
                <div key={stat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{stat.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {stat.productCount} products
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      ${stat.totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 