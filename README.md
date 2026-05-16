# 🚀 Team Task Manager (Full-Stack)

A modern, high-performance web application for team collaboration and project tracking. Built with **Next.js**, **Prisma**, and **NextAuth**, this platform allows teams to manage projects, assign tasks, and track progress with role-based access control.

**🌐 Live Demo:** [View App on Railway](https://team-task-manager-assignment-production-e2fa.up.railway.app)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Signup/Login**: Secure account creation and session management.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Create projects, assign tasks, and manage the team.
  - **Member**: View assigned tasks and update progress status.
- **Protected Routes**: Middleware and server-side checks to prevent unauthorized access.

### 📊 Dashboard & Analytics
- **Project Overview**: Visualize total projects and task counts.
- **Personalized Stats**: Each user sees their own task counts (Pending vs. Done).
- **Dynamic UI**: Glassmorphism-inspired design with premium gradients and smooth transitions.

### 📁 Project & Task Management
- **Project Board**: Create and view detailed project pages.
- **Task Assignment**: Assign tasks to specific team members with priority levels (Low, Medium, High).
- **Status Tracking**: Real-time status updates (To Do → In Progress → Done).

---

## 🛠️ Tech Stack

- **Frontend/Backend**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Production) / SQLite (Local)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: Vanilla CSS (Custom CSS Modules)
- **Deployment**: [Railway](https://railway.app/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/darkknight8670/team-task-manager-assignment.git

# Navigate to directory
cd team-task-manager

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Initialization
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push
```

### 5. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app!

---

## 🌐 Deployment (Railway)

This project is optimized for Railway. To deploy your own version:
1. Connect your GitHub repository to [Railway](https://railway.app/).
2. Provision a **PostgreSQL** database.
3. Add the following Environment Variables in Railway:
   - `DATABASE_URL`: Your Railway Postgres connection string.
   - `NEXTAUTH_SECRET`: A random hash.
   - `NEXTAUTH_URL`: Your Railway app URL.
4. The deployment will automatically run `npx prisma db push` and `npm run build`.

---

## 📄 License
Distributed under the MIT License.
