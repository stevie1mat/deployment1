// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";

// // ─── Mock users ───
// const users = [
//   {
//     id: 1,
//     name: "Sarah Kim",
//     // role: "Healthy Meal Prep Coach",
//     rating: 4.9,
//     reviews: 198,
//     skills: ["Nutrition", "Meal Plans", "Vegan Cooking"],
//     location: "Toronto",
//     rate: "30 credits / hr",
//     success: "97%",
//     avatar:
//       "https://cdn.pixabay.com/photo/2020/04/24/00/38/face-5084530_1280.jpg",
//     coords: [43.6532, -79.3832],
//   },
//   {
//     id: 2,
//     name: "Daniel Ortiz",
//     role: "Math Tutor",
//     rating: 4.8,
//     reviews: 285,
//     skills: ["Algebra", "Geometry", "Exam Prep"],
//     location: "Mississauga",
//     rate: "45 credits / hr",
//     success: "99%",
//     avatar:
//       "https://cdn.pixabay.com/photo/2018/04/26/16/05/sunglasses-3352288_1280.jpg",
//     coords: [43.589, -79.6441],
//   },
//   {
//     id: 3,
//     name: "Ayesha Patel",
//     role: "Dog Walker & Pet Care",
//     rating: 4.95,
//     reviews: 142,
//     skills: ["Dog Walking", "Pet Sitting", "Leash Training"],
//     location: "Brampton",
//     rate: "25 credits / hr",
//     success: "98%",
//     avatar:
//       "https://images.pexels.com/photos/32474164/pexels-photo-32474164/free-photo-of-portrait-of-young-woman-in-garden-setting.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     coords: [43.7315, -79.7624],
//   },
//   {
//     id: 4,
//     name: "Olivia Brown",
//     role: "Yoga & Wellness Coach",
//     rating: 4.87,
//     reviews: 134,
//     skills: ["Yoga", "Meditation", "Breathwork"],
//     location: "Oakville",
//     rate: "35 credits / hr",
//     success: "97%",
//     avatar:
//       "https://images.pexels.com/photos/1944429/pexels-photo-1944429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     coords: [43.4675, -79.6877],
//   },
//   {
//     id: 5,
//     name: "Michael Chen",
//     role: "PC & Smart-Home Setup",
//     rating: 4.89,
//     reviews: 176,
//     skills: ["PC Builds", "Wi-Fi Fixes", "Smart Device Setup"],
//     location: "Richmond Hill",
//     rate: "40 credits / hr",
//     success: "96%",
//     avatar:
//       "https://images.pexels.com/photos/32521458/pexels-photo-32521458/free-photo-of-man-holding-paintbrush-in-artistic-portrait.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     coords: [43.8711, -79.4373],
//   },
// ];

// // 👤 Helper: avatar icon for marker
// const avatarIcon = (url: string) =>
//   L.divIcon({
//     html: `<div style="
//       width: 46px;
//       height: 46px;
//       border-radius: 50%;
//       background: url('${url}') center/cover no-repeat;
//       box-shadow: 0 0 0 2px white;
//     "></div>`,
//     className: "",
//     iconSize: [46, 46],
//     iconAnchor: [23, 23],
//   });

// export default function UsersNearby() {
//   const [center, setCenter] = useState<LatLngExpression>([43.6532, -79.3832]);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
//         () => null,
//         { enableHighAccuracy: true, timeout: 5000 }
//       );
//     }
//   }, []);

//   return (
//     <div className="w-full h-[70vh] rounded-xl overflow-hidden">
//       <MapContainer
//         center={center}
//         zoom={11}
//         scrollWheelZoom
//         className="w-full h-full z-0"
//       >
//         <TileLayer
//           attribution="© OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {users.map((u) => (
//           <Marker
//             key={u.id}
//             position={u.coords as LatLngExpression}
//             icon={avatarIcon(u.avatar)}
//           >
//             <Popup>
//               <div className="p-2 w-56">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Image
//                     src={u.avatar}
//                     alt={u.name}
//                     width={48}
//                     height={48}
//                     className="rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="font-semibold text-sm">{u.name}</p>
//                     <p className="text-xs text-gray-500">{u.role}</p>
//                   </div>
//                 </div>

//                 <p className="text-xs text-yellow-500 font-medium mb-2">
//                   ⭐ {u.rating}{" "}
//                   <span className="text-gray-400">({u.reviews} reviews)</span>
//                 </p>

//                 <div className="flex flex-wrap gap-1 mb-2">
//                   {u.skills.map((s, i) => (
//                     <span
//                       key={i}
//                       className="px-2 py-0.5 bg-pink-100 text-[10px] rounded-full"
//                     >
//                       {s}
//                     </span>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-2 gap-y-1 text-[11px] text-gray-600 mb-3">
//                   <span className="font-medium">Location</span>
//                   <span>{u.location}</span>
//                   <span className="font-medium">Rate</span>
//                   <span>{u.rate}</span>
//                   <span className="font-medium">Job Success</span>
//                   <span>{u.success}</span>
//                 </div>

//                 <button className="w-full text-center text-xs py-2 rounded-md bg-green-100 text-green-800 font-medium">
//                   View Profile ↗
//                 </button>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

import React from "react";

export default function UsersNearby() {
  return <div>UsersNearby</div>;
}
