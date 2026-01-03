import React, { useState } from "react";
// import React from "react";
import FormFieldVertical from "./FormFIeldVertical";
import { Calendar, ShieldAlert } from "lucide-react";

const StructureTab: React.FC = () => {
  const [currentSemester, setCurrentSemester] = useState("First Semester");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleUpdateTimeline = () => {
    console.log("Updating timeline:", { currentSemester, startDate, endDate });
    // Add your API call here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" /> Session Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div>
              <p className="text-sm font-bold text-blue-900">
                2024/2025 Session
              </p>
              <p className="text-[11px] text-blue-600">
                Active Current Session
              </p>
            </div>
            <button className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-50">
              Manage
            </button>
          </div>
          <button className="w-full py-3 border-2 border-dashed border-slate-100 text-slate-400 text-sm font-bold rounded-xl hover:border-blue-200 hover:text-blue-500 transition-all">
            + Start New Academic Session
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldAlert size={18} className="text-orange-500" /> Semester
          Timeline
        </h3>
        <div className="space-y-3">
          <FormFieldVertical
            label="Current Semester"
            type="select"
            options={["First Semester", "Second Semester"]}
            value={currentSemester}
            onChange={setCurrentSemester}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormFieldVertical
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChange={setStartDate}
            />
            <FormFieldVertical
              label="End Date"
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChange={setEndDate}
            />
          </div>
          <button
            onClick={handleUpdateTimeline}
            className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2 hover:bg-slate-800 transition-colors"
          >
            Update Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default StructureTab;
