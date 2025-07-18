"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import Image from "next/image";
import { FiStar, FiMapPin, FiClock, FiUser, FiCreditCard } from "react-icons/fi";

interface Service {
  id: number;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  user: string;
  avatar: string;
  price: number;
  image: string;
  description?: string;
  location?: string;
  availability?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/tasks/get/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch service");
        const data = await res.json();
        const task = data.data || data;
        // Map backend fields to frontend fields
        const mappedService = {
          id: task._id || task.id || task.ID,
          title: task.Title,
          description: task.Description,
          price: task.Credits,
          user: task.Author?.Name,
          avatar: task.Author?.Avatar,
          image: task.Images && task.Images.length > 0 ? task.Images[0] : "/default-image.png",
          category: task.Category,
          rating: 4.8, // You can update this if you have real ratings
          reviews: 0, // You can update this if you have real reviews
          location: task.Location,
          availability: task.Availability && task.Availability.length > 0 ? `${task.Availability[0].Date} ${task.Availability[0].TimeFrom} - ${task.Availability[0].TimeTo}` : undefined,
        };
        setService(mappedService);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!service) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Service not found</div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Services
          </button>

          {/* Main content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Hero image */}
            <div className="relative h-64 md:h-96">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold">{service.rating}</span>
                    </div>
                    <span className="text-gray-500">({service.reviews} reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">
                    {service.price} credits
                  </div>
                  <div className="text-sm text-gray-500">per session</div>
                </div>
              </div>

              {/* Service provider */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <Image
                  src={service.avatar}
                  alt={service.user}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{service.user}</h3>
                  <p className="text-gray-600">Service Provider</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">About this service</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Service details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-gray-400" />
                      <span className="text-gray-700">{service.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiClock className="text-gray-400" />
                      <span className="text-gray-700">{service.availability}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiCreditCard className="text-gray-400" />
                      <span className="text-gray-700">{service.price} credits per session</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Book Now
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Contact Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
} 