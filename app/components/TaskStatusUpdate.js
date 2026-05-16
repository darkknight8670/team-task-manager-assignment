"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskStatusUpdate({ task }) {
  const [status, setStatus] = useState(task.status);
  const router = useRouter();

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <select 
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #ddd" }}
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
    </div>
  );
}
