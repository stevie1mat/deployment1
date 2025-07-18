import React from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

export default function SettingsPage() {
  return (
    <ProtectedLayout headerName="Settings">
      <div className="max-w-3xl mx-auto py-10 space-y-8 bg-gray-100 min-h-[80vh] rounded-2xl">
        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-white/80 rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-gray-600 mb-4">Update your personal information.</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-400 focus:border-emerald-400" placeholder="Your name" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-400 focus:border-emerald-400" placeholder="Your email" disabled />
              </div>
            </div>
          </section>
          {/* Account Section */}
          <section className="bg-white/80 rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Account</h2>
            <p className="text-gray-600 mb-4">Manage your account settings.</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Account</button>
          </section>
          {/* Notifications Section */}
          <section className="bg-white/80 rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p className="text-gray-600 mb-4">Control your notification preferences.</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" disabled />
                Email Notifications
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" disabled />
                SMS Notifications
              </label>
            </div>
          </section>
          {/* Security Section */}
          <section className="bg-white/80 rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Security</h2>
            <p className="text-gray-600 mb-4">Change your password or enable 2FA.</p>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600" disabled>Change Password</button>
          </section>
        </div>
      </div>
    </ProtectedLayout>
  );
} 