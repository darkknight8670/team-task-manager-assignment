"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../dashboard.module.css";
import { useSession } from "next-auth/react";

export default function NewProject() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create project");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>TaskMaster</div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/projects" className={`${styles.navLink} ${styles.navLinkActive}`}>
            Projects
          </Link>
          <Link href="/tasks" className={styles.navLink}>
            My Tasks
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.welcome}>Create New Project</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.statCard} style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Project Name</label>
              <input 
                type="text" 
                placeholder="E.g. Website Redesign" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Description</label>
              <textarea 
                placeholder="Briefly describe the project goals..." 
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", minHeight: "120px" }}
              />
            </div>

            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                type="submit" 
                className={styles.btnPrimary} 
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
              <Link 
                href="/" 
                className={styles.navLink} 
                style={{ border: "1px solid #ddd", color: "#333", display: "flex", alignItems: "center" }}
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
