"use client"

import { BaseKey, useDelete, useList, useNavigation } from "@refinedev/core"
import Loading from "@/components/ui/loading";

export default function UserList() {
  const { data, isLoading } = useList({
    resource: "users",
  })
  const {edit, create} = useNavigation()
  const { mutate: deleteUser } = useDelete();

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="flex items-center mb-4 justify-between w-full">
          <h1 className="text-2xl font-bold">Users</h1>
          <button
            onClick={() => create("users")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">
            Create User
          </button>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-500 shadow-sm">
        <thead className="bg-gray-300 text-left">
          <tr>
            <th className="border px-3 py-1">Last Name</th>
            <th className="border px-3 py-1">First Name</th>
            <th className="border px-3 py-1">Department</th>
            <th className="border px-3 py-1">Role</th>
            <th className="border px-3 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((user) => (
            <tr key={user.id}>
              <td className="border px-3 py-2">{user.lastname}</td>
              <td className="border px-3 py-2">{user.firstname}</td>
              <td className="border px-3 py-2">{user.department}</td>
              <td className="border px-3 py-2">{user.role}</td> 
              <td className="border px-3 py-2">
                <div className="space-x-6">
                  <button
                    onClick={() => user.id && edit("users", user.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (user.id && window.confirm("Are you sure you want to delete this user?")) {
                        deleteUser({
                          resource: "users",
                          id: user.id,
                        });
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
