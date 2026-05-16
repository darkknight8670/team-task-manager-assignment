import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "../dashboard.module.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import TaskStatusUpdate from "../components/TaskStatusUpdate";

export default async function MyTasks() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { assigneeId: session.user.id },
    include: { project: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>TaskMaster</div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/projects" className={styles.navLink}>
            Projects
          </Link>
          <Link href="/tasks" className={`${styles.navLink} ${styles.navLinkActive}`}>
            My Tasks
          </Link>
        </nav>
        
        <LogoutButton className={styles.logoutBtn} />
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.welcome}>My Tasks</h1>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className={styles.statCard} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{task.title}</h3>
                  <p style={{ margin: "0.2rem 0", fontSize: "0.9rem", color: "#666" }}>
                    Project: <Link href={`/projects/${task.project.id}`}>{task.project.name}</Link>
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    <span style={{ color: task.priority === "HIGH" ? "red" : "#666" }}>
                      Priority: {task.priority}
                    </span>
                  </div>
                </div>
                <TaskStatusUpdate task={JSON.parse(JSON.stringify(task))} />
              </div>
            ))
          ) : (
            <p>You don't have any tasks assigned yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
