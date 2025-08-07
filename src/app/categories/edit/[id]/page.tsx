"use client";

import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "@/components/ui/loading";
import { SubmitHandler } from "react-hook-form";

interface ICategoryForm {
  name: string;
  description?: string;
  isActive: boolean;
}

export default function EditCategory() {
  const navigation = useNavigation();
  const { id } = useParams();
  const [error, setError] = useState<string>("");

  const { data: categoryData, isLoading } = useOne({
    resource: "categories",
    id: id as string,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
    setValue,
  } = useForm<ICategoryForm, any, ICategoryForm>({
    refineCoreProps: {
      resource: "categories",
      action: "edit",
      id: id as string,
      redirect: false,
    },
  });

  useEffect(() => {
    if (categoryData?.data) {
      setValue("name", categoryData.data.name || "");
      setValue("description", categoryData.data.description || "");
      setValue("isActive", categoryData.data.isActive ?? true);
    }
  }, [categoryData, setValue]);

  const onSubmit: SubmitHandler<ICategoryForm> = async (data) => {
    try {
      setError(""); // Clear any previous errors
      const parsedData = {
        ...data,
        isActive: data.isActive ?? true,
      };
      await onFinish(parsedData);
      navigation.list("categories");
    } catch (error: any) {
      console.error("Error updating category:", error);

      // Handle duplicate name error - check for 409 status code
      if (error?.statusCode === 409 || error?.response?.status === 409) {
        setError("A category with this name already exists. Please choose a different name.");
      } else {
        setError("An error occurred while updating the category. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!categoryData?.data) {
    return <div className="p-6 text-center">Category not found</div>;
  }

  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Edit Category</h1>

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
            {isSubmitting ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
