import React, { useState } from "react";
import TabButton from "../components/TabButton";
import ProgramsTab from "../components/ProgramsTab";
import CoursesTab from "../components/CoursesTab";
import StructureTab from "../components/StructureTab";
import { BookOpen, Layers, Calendar } from "lucide-react";

const ProgramCoursesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "programs" | "courses" | "structure"
  >("programs");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Program & Courses</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <TabButton
            active={activeTab === "programs"}
            onClick={() => setActiveTab("programs")}
            icon={<Layers size={16} />}
            label="Programs"
          />
          <TabButton
            active={activeTab === "courses"}
            onClick={() => setActiveTab("courses")}
            icon={<BookOpen size={16} />}
            label="Course Catalog"
          />
          <TabButton
            active={activeTab === "structure"}
            onClick={() => setActiveTab("structure")}
            icon={<Calendar size={16} />}
            label="Setup & Sessions"
          />
        </div>
      </div>

      {activeTab === "programs" && <ProgramsTab />}
      {activeTab === "courses" && <CoursesTab />}
      {activeTab === "structure" && <StructureTab />}
    </div>
  );
};

export default ProgramCoursesPage;
