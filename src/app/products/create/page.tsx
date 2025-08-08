"use client";

import { useNavigation, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IProductForm {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId?: number;
}

export default function CreateProduct() {
  const navigation = useNavigation();
  const [error, setError] = useState<string>("");

  // Fetch categories for dropdown
  const { data: categoriesData } = useList({
    resource: "categories",
    pagination: { pageSize: 100 },
  });
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish }
  } = useForm<IProductForm, any, IProductForm>({
    refineCoreProps: {
      resource: "products",
      action: "create",
      redirect: false,
    },
  });

  const onSubmit = async (data: IProductForm) => {
    try {
      setError(""); // Clear any previous errors
      const parsedData = {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
      };
      await onFinish(parsedData);
      navigation.list("products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      
      // Handle duplicate name error - check for 409 status code
      if (error?.statusCode === 409 || error?.response?.status === 409) {
        setError("A product with this name already exists. Please edit the existing product!!.");
      } else {
        setError("An error occurred while creating the product. Please try again.");
      }
    }
  };

  return (
    <div className="container-responsive p-responsive">
      <div className="max-w-2xl mx-auto">
        <div className="card-responsive">
          <h1 className="text-2xl-responsive text-center font-bold mb-6">Create Product</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="form-responsive">
            <div className="form-group">
              <label className="block font-medium mb-2 text-gray-700">Item</label>
              <input
                {...register("name", { required: true })}
                className="form-responsive input"
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label className="block font-medium mb-2 text-gray-700">Category</label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="form-responsive select"
              >
                <option value="">Select a category</option>
                {categoriesData?.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block font-medium mb-2 text-gray-700">Description</label>
              <textarea
                {...register("description")}
                className="form-responsive textarea"
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block font-medium mb-2 text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { required: true, valueAsNumber: true })}
                  className="form-responsive input"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="block font-medium mb-2 text-gray-700">Quantity</label>
                <input
                  type="number"
                  {...register("quantity", { required: true, valueAsNumber: true })}
                  className="form-responsive input"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-responsive bg-blue-600 text-white ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => navigation.list("products")}
                className="btn-responsive bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
