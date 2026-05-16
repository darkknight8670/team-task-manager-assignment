import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./dashboard.module.css";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { tasks: { some: { assigneeId: session.user.id } } },
      ],
    },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const tasksCount = await prisma.task.count({
    where: { assigneeId: session.user.id },
  });

  const pendingTasks = await prisma.task.count({
    where: { 
      assigneeId: session.user.id,
      status: { not: "DONE" }
    },
  });

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>TaskMaster</div>
        <nav className={styles.nav}>
          <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
            Dashboard
          </Link>
          <Link href="/projects" className={styles.navLink}>
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
          <h1 className={styles.welcome}>Welcome, {session.user.name}</h1>
          <div className={styles.userMenu}>
            <div className={styles.avatar}>
              {session.user.name ? session.user.name[0].toUpperCase() : "U"}
            </div>
            <span>{session.user.role}</span>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Projects</span>
            <span className={styles.statValue}>{projects.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>My Tasks</span>
            <span className={styles.statValue}>{tasksCount}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pending Tasks</span>
            <span className={styles.statValue}>{pendingTasks}</span>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Projects</h2>
            {session.user.role === "ADMIN" && (
              <Link href="/projects/new" className={styles.btnPrimary}>
                + New Project
              </Link>
            )}
          </div>

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
              <p>No projects found. Create one to get started!</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
