import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "../dashboard.module.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { tasks: true },
      },
    },
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
          <h1 className={styles.welcome}>All Projects</h1>
          {session.user.role === "ADMIN" && (
            <Link href="/projects/new" className={styles.btnPrimary}>
              + New Project
            </Link>
          )}
        </header>

        <div className={styles.grid}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link 
                href={`/projects/${project.id}`} 
                key={project.id} 
                className={styles.projectCard}
              >
                <span className={styles.projectName}>{project.name}</span>
                <span className={styles.projectDesc}>
                  {project.description || "No description provided."}
                </span>
                <span className={styles.taskCount}>
                  {project._count.tasks} Tasks
                </span>
              </Link>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
