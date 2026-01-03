import React from "react";
import { AccountRecord } from "./types";

export const StatusBadge = ({
  status,
}: {
  status: AccountRecord["status"];
}) => {
  const styles = {
    Active: "bg-[#4ade80] text-white",
    Certified: "bg-[#4ade80] text-white",
    "Not Active": "bg-[#94a3b8] text-white",
    "Not Certified": "bg-[#94a3b8] text-white",
    Pending: "bg-[#fbbf24] text-white",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold inline-block min-w-[90px] md:min-w-[100px] text-center ${styles[status]}`}
    >
      {status}
    </span>
  );
};
