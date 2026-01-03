import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AccountRecord } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export const AdminProfile = ({
  admin,
  onBack,
}: {
  admin: AccountRecord;
  onBack: () => void;
}) => {
  const [permissions] = useState(Array(8).fill(true));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admins
      </button>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {admin.name}
          </h2>
          <p className="text-lg text-slate-400 font-medium underline underline-offset-4 decoration-slate-200">
            {admin.role}
          </p>
        </div>
        <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-full border-4 border-white shadow-inner flex items-center justify-center" />
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm space-y-12">
        <section className="space-y-8">
          <h3 className="text-xl font-bold text-slate-900">
            Admin Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                Name
              </label>
              <input
                type="text"
                defaultValue={admin.name}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                Official Email
              </label>
              <input
                type="email"
                defaultValue={admin.email}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="text-xl font-bold text-slate-900">
            Roles & Permission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {permissions.map((isChecked, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm font-medium text-slate-700">
                  Create Programs
                </span>
                <ToggleSwitch checked={isChecked} onChange={() => {}} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
