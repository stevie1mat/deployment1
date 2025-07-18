"use client";

import React, { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import ServiceGrid from "@/components/ServiceGrid";
import ServiceFilters from "@/components/ServiceFilters";
import TaskMap from "@/components/tasks/TasksMap";
import { FiGrid, FiMap, FiUser, FiPlusCircle, FiSearch } from "react-icons/fi";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  Title: string;
  Description: string;
  Location: string;
  Latitude: number;
  longitude: number;
  LocationType: string;
  Credits: number;
  Availability: any[];
  Type?: string;
  Status?: string;
  Author?: {
    id: string;
    Name: string;
    Email: string;
  };
}

// Transform API task to ServiceGrid format
const transformTaskToService = (task: any) => ({
  id: task.ID || task.id,
  category: task.Category || 'General',
  title: task.Title,
  description: task.Description,
  location: task.Location,
  latitude: typeof task.Latitude === "string" ? Number(task.Latitude) : task.Latitude,
  longitude: typeof task.Longitude === "string" ? Number(task.Longitude) : task.Longitude,
  rating: 4.8, // Default rating since API doesn't provide it
  reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews
  user: task.Author?.Name || 'Anonymous',
  avatar: 'https://images.pexels.com/photos/277576/pexels-photo-277576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Default avatar
  price: task.Credits,
  image: 'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839184_1280.jpg', // Default image
});

// Dynamically import TaskMap to avoid SSR issues
const DynamicTaskMap = dynamic(() => import("@/components/tasks/TasksMap"), {
  ssr: false,
});

export default function Page() {
  const [allTasks, setAllTasks] = useState<any[]>([]); // Store all tasks
  const [services, setServices] = useState<any[]>([]); // Filtered tasks for display
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  // Filter states
  const [deliveryTime, setDeliveryTime] = useState("");
  const [budget, setBudget] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      try {
        // Fetch current user profile
        let currentUserId = null;
        let profileData = null;
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8081'}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          profileData = await profileRes.json();
          currentUserId = profileData.ID || profileData.id;
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";
        const res = await fetch(`${API_BASE_URL}/api/tasks/get/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        const tasks = json.data || json;
        console.log("[Explore] Raw tasks from backend:", tasks);
        // Filter out own tasks BEFORE transforming
        let filteredTasks = tasks;
        if (currentUserId) {
          filteredTasks = tasks.filter(
            (task: any) =>
              task.Author?.ID !== currentUserId &&
              task.Author?.id !== currentUserId
          );
        }
        // Transform tasks to service format
        let transformedServices = filteredTasks.map(transformTaskToService);
        console.log("[Explore] Transformed services:", transformedServices);
        setAllTasks(transformedServices);
        setServices(transformedServices);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Realtime search and category filter
  useEffect(() => {
    let filteredTasks = allTasks;
    
    // Apply search filter
    if (search) {
      filteredTasks = filteredTasks.filter(task =>
        (task.title && task.title.toLowerCase().includes(search.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (category) {
      filteredTasks = filteredTasks.filter(task =>
        task.category && task.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    console.log("[Explore] Services passed to grid/map:", filteredTasks);
    setServices(filteredTasks);
  }, [search, category, allTasks]);

  return (
    <ProtectedLayout>
      {/* Hero Title & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-center py-6 px-2 md:px-0 w-full gap-4">
        {/* Search Bar and Category Dropdown */}
        <div className="flex flex-1 w-full max-w-3xl bg-white rounded-2xl shadow items-center p-4 gap-2">
          <div className="flex items-center flex-1 min-h-[48px]">
            <FiSearch className="w-6 h-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search For Help or Services"
              className="w-full text-lg text-gray-700 outline-none placeholder-gray-400 bg-transparent min-h-[48px]"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search for help or services"
            />
          </div>
          <div className="w-full md:w-56 border-l md:border-l border-gray-200 md:pl-4 min-h-[48px] flex items-center">
            <select
              className="w-full text-lg bg-white text-gray-700 outline-none min-h-[44px] rounded-xl px-2"
              value={category}
              onChange={e => setCategory(e.target.value)}
              aria-label="Category"
            >
              <option value="">Select a category</option>
              <option>Academic Help</option>
              <option>Tech & Digital Skills</option>
              <option>Creative & Arts</option>
              <option>Personal Development</option>
              <option>Language & Culture</option>
              <option>Health & Wellness</option>
              <option>Handy Skills & Repair</option>
              <option>Everyday Help</option>
              <option>Administrative & Misc Help</option>
              <option>Social & Community</option>
              <option>Entrepreneurship & Business</option>
              <option>Specialized Skills</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        {/* View Toggle Buttons */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 mt-4 md:mt-0 min-w-[260px] w-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiGrid size={16} />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiMap size={16} />
            Map View
          </button>
        </div>
      </div>
         {/* Service Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-600 py-20">Loading services...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : viewMode === 'grid' ? (
          <ServiceGrid items={services} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <DynamicTaskMap tasks={services} />
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
