"use client";

import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";
import { useState } from "react";

interface ICategoryForm {
  name: string;
  description?: string;
  isActive: boolean;
}

export default function CreateCategory() {
  const navigation = useNavigation();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
  } = useForm<ICategoryForm, any, ICategoryForm>({
    refineCoreProps: {
      resource: "categories",
      action: "create",
    },
  });

  const onSubmit = async (data: ICategoryForm) => {
    try {
      setError(""); // Clear any previous errors
      const parsedData = {
        ...data,
        isActive: data.isActive ?? true,
      };
      await onFinish(parsedData);
      navigation.list("categories");
    } catch (error: any) {
      console.error("Error creating category:", error);

      // Handle duplicate name error - check for 409 status code
      if (error?.statusCode === 409 || error?.response?.status === 409) {
        setError("A category with this name already exists. Please choose a different name.");
      } else {
        setError("An error occurred while creating the category. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Create Category</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Category Name *</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Enter category description"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("isActive")}
              className="mr-2"
              defaultChecked={true}
            />
            <span className="font-medium">Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigation.list("categories")}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-2 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
