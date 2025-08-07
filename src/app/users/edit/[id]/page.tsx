"use client"

import { useNavigation } from "@refinedev/core"
import { useParams } from "next/navigation";
import { useForm } from "@refinedev/react-hook-form"
import { SubmitHandler } from "react-hook-form";

interface IUserForm {
  firstname: string;
  lastname: string;
  department: string;
  role: string;
}

const EditUser = () => {
  const navigation = useNavigation();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
  } = useForm<IUserForm, any, IUserForm>({
    refineCoreProps: {
      resource: "users",
      action: "edit",
      id: id as string,
      redirect: false,
    },
  })

  const onSubmit: SubmitHandler<IUserForm> = async (data) => {
    try {
      const parsedData = {
        ...data,
      }
      await onFinish(parsedData);
      navigation.list("users");
    } catch (error) {
      console.error("Error editing user:", error);
    }
  }
 
  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Edit User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <input
            {...register("firstname", { required: true })}
            placeholder="First Name"
            className="shadow-lg outline-1 border-purple-300 w-full border p-2 rounded-md outline-purple-500"
          />
        </div>

        <div>
          <input
            {...register("lastname", { required: true })}
            placeholder="Last Name"
            className="shadow-lg outline-1 border-purple-300 w-full border p-2 rounded-md outline-purple-500"
          />
        </div>        

        <div>
          <select
            {...register("department", { required: true })}
            className="shadow-lg outline-1 border-purple-300 w-full border p-2 rounded-md outline-none"
          >
            <option value="">Select department</option>
            <option value="Management/Executive">Management/Executive</option>
            <option value="IT/Engineering">IT/Engineering</option>
            <option value="HR">HR</option> 
            <option value="Finance">Finance</option>
            <option value="Marketing/PR">Marketing/PR</option>
            <option value="Sales">Sales</option>
            <option value="Customer Service/Support">Customer Service/Support</option>
          </select>
        </div>

        <div>
          <select
            {...register("role", { required: true })}
            className="shadow-lg border-purple-300 w-full border p-2 rounded-md outline-none"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <div className="w-full items-center flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="shadow-lg border-purple-300 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser