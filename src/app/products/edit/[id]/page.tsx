"use client";

import { useNavigation, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

interface IProductForm {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  quantity: number;
}

export default function EditProduct() {
  const navigation = useNavigation();
  const { id } = useParams();
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
    refineCore: { onFinish },
  } = useForm<IProductForm, any, IProductForm>({
    refineCoreProps: {
      resource: "products",
      action: "edit",
      id: id as string,
      redirect: false,
    },
  });

  const onSubmit: SubmitHandler<IProductForm> = async (data) => {
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
      console.error("Error updating product:", error);
      
      // Handle duplicate name error - check for 409 status code
      if (error?.statusCode === 409 || error?.response?.status === 409) {
        setError("A product with this name already exists. Please choose a different name.");
      } else {
        setError("An error occurred while updating the product. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Edit Product</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Item Name</label>
          <input
            {...register("name", { required: true })}
            placeholder="Item name"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select a category</option>
            {categoriesData?.data.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true, valueAsNumber: true })}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            {...register("quantity", { required: true, valueAsNumber: true })}
            placeholder="Quantity"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
