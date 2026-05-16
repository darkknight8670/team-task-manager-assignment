import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "../../dashboard.module.css";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";
import TaskList from "../../components/TaskList";

export default async function ProjectDetail({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

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
        
        <LogoutButton className={styles.logoutBtn} />
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <Link href="/" style={{ fontSize: "0.9rem", color: "#666", textDecoration: "none" }}>
              &larr; Back to Dashboard
            </Link>
            <h1 className={styles.welcome}>{project.name}</h1>
            <p style={{ color: "#666" }}>{project.description}</p>
          </div>
          <div className={styles.userMenu}>
            <span>{session.user.role}</span>
          </div>
        </header>

        <TaskList 
           projectId={project.id} 
           tasks={JSON.parse(JSON.stringify(project.tasks))} 
           users={JSON.parse(JSON.stringify(users))}
           isAdmin={session.user.role === "ADMIN"}
           currentUserId={session.user.id}
        />
      </main>
    </div>
  );
}
