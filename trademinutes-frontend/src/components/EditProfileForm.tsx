// import React, { useState } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// // const schema = z.object({
// //   name: z.string().min(1, "Name is required"),
// //   password: z.string().min(6, "Password must be at least 6 characters"),
// //   avatar: z
// //     .any()
// //     .refine(
// //       (file) =>
// //         !file || (file instanceof File && file.type.startsWith("image/")),
// //       {
// //         message: "Avatar must be an image file",
// //       }
// //     ),
// // });

// type FormData = {
//   name: string;
//   password: string;
//   avatar: FileList;
// };

// const mockUpdateProfile = async (data: {
//   name: string;
//   password: string;
//   avatar?: File;
// }) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Simulate success 80% of the time
//       if (Math.random() < 0.8) {
//         resolve("Profile updated successfully!");
//       } else {
//         reject(new Error("Failed to update profile."));
//       }
//     }, 1200);
//   });
// };

// const EditProfileForm: React.FC = () => {
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data: FormData) => {
//     setServerError(null);
//     setSuccess(null);
//     setLoading(true);
//     try {
//       await mockUpdateProfile({
//         name: data.name,
//         password: data.password,
//         avatar: data.avatar && data.avatar[0],
//       });
//       setSuccess("Profile updated successfully!");
//       reset();
//     } catch (err: any) {
//       setServerError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="max-w-md mx-auto p-6 bg-white rounded shadow"
//     >
//       <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Name</label>
//         <input
//           type="text"
//           {...register("name")}
//           className="w-full border rounded px-3 py-2"
//         />
//         {errors.name && (
//           <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Password</label>
//         <input
//           type="password"
//           {...register("password")}
//           className="w-full border rounded px-3 py-2"
//         />
//         {errors.password && (
//           <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Avatar</label>
//         <input
//           type="file"
//           accept="image/*"
//           {...register("avatar")}
//           className="w-full"
//         />
//         {errors.avatar && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.avatar.message as string}
//           </p>
//         )}
//       </div>
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//         disabled={loading}
//       >
//         {loading ? "Updating..." : "Update Profile"}
//       </button>
//       {success && <p className="text-green-600 mt-3">{success}</p>}
//       {serverError && <p className="text-red-600 mt-3">{serverError}</p>}
//     </form>
//   );
// };

// export default EditProfileForm;

import React from "react";

export default function EditProfileForm() {
  return <div>EditProfileForm</div>;
}
