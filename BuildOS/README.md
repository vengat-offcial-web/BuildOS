# 🏗️ BuildOS — Modern Construction Operations & Site Management Platform

![BuildOS Banner](https://img.shields.io/badge/BuildOS-Construction%20SaaS-7C3AED?style=for-the-badge&logo=react)
![React Version](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Vite Version](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/State-Zustand%20v5-443E38?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-BEF264?style=for-the-badge)

**BuildOS** is an enterprise-grade, modern web application designed for real-time construction management, multi-site project tracking, site engineer delegation, workforce roster management, material inventory logistics, and worker portal execution.

---

## ✨ Features & Key Modules

### 👑 Admin & Director Portal
- **⚡ Executive Dashboard (`/`)**: High-level overview of active sites, daily workforce attendance, stock availability metrics, project completion trends, and quick date range filtering.
- **🏗️ Construction Projects Roster (`/projects`)**: Complete roster of active, planned, and completed developments with status filtering and interactive bento cards.
- **➕ Assign Project Wizard (`/assign-project` or `/projects/new`)**: Step-by-step project creation form for setting site location, site engineer selection, duration estimation, workforce requirements, and priority level.
- **🔍 Project Details & Management (`/projects/:id`)**: Comprehensive site control center with interactive tabs:
  - **Milestones & Tasks**: Interactive milestone checklists and site task delegation.
  - **Site Team & Personnel**: Assigned site engineers, leads, and workers with contact info.
  - **Materials & Equipment**: Dedicated stock allocation and usage tracking.
  - **Modals**: Edit project info, milestones, tasks, team rosters, materials, or cancel site operations.
- **👷 Site Workforce Directory (`/workers`)**: Full worker directory with trade filtering, pending registration approval workflow (Accept/Decline), profile cards, attendance tracking, and deletion safeguards.
- **📦 Material Inventory (`/materials`)**: Real-time material stock management, low stock alerts, search/category filter, new stock order dispatch, and stock level editing.
- **📋 Site Tasks Checklist (`/tasks`)**: Operational task management with priority levels, domain categories (Safety, Concrete, Electrical, Scaffolding, QA/QC), due dates, and completion status.
- **📈 Completed Project Reports (`/reports`)**: Executive audit archives detailing completed sites, total execution duration, site engineer oversight, workforce roster, and material consumption logs.
- **⚙️ Admin Profile Settings (`/settings`)**: Manage director credentials, avatar upload, password changes, and workspace data modes (Demo Sample Mode vs. Clean Slate Real Data Mode).

### 👷 Worker Operations Portal
- **📱 Worker Dashboard (`/worker-dashboard`)**: Tailored portal for site workers:
  - **Shift Clock In / Clock Out**: Real-time shift check-in synced with admin notifications.
  - **Daily Shift Checklist**: Interactive task progress checklist with 1-click supervisor report submission.
  - **Apply for Leave**: Direct leave application dispatched to assigned site engineer.
  - **Report Safety Hazard**: Instant alert dispatch for scaffolding, PPE, or electrical hazards.
  - **Assigned Site Modal**: Detailed breakdown of assigned site, target deadline, shift schedule, and role.
- **⚙️ Worker Settings (`/worker-settings`)**: Dedicated worker profile updates, avatar customization, and security credential management.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 19, JavaScript (ES6+), React Router v7 |
| **Build Tooling** | Vite v8.1.3 (Fast HMR & Optimized Bundling) |
| **Styling & Theme** | Tailwind CSS v4, Glassmorphism design system, Custom gradients |
| **Icons & Media** | React Icons (`fi`, `fa6`), Lucide-style badges |
| **State Architecture** | Zustand v5 (Modular Stores with LocalStorage Persistence) |
| **UI Components** | Atomic Component System (`src/components/ui`), Modular Page Folders |

---

## 📐 Architecture & Component Structure

BuildOS uses a modular component architecture where each page has its own dedicated directory under `src/components/`:

```
BuildOS/
├── src/
│   ├── assets/                # App images & fallback avatars
│   ├── components/            # Modular Component Architecture
│   │   ├── AssignProject/     # Header, Info, Engineer, Timeline, Workforce cards
│   │   ├── Dashboard/         # Hero banner, Date picker, Filter pills, Bento grid
│   │   ├── Materials/         # Materials filter, Stock cards, New order/edit modals
│   │   ├── ProjectDetails/    # Hero, Header, Tabs nav, Milestones, Edit modals
│   │   ├── Projects/          # Roster header, Status filter bar, Projects grid
│   │   ├── Reports/           # Executive KPI overview, Search, Audit report view
│   │   ├── Settings/          # Admin profile card, Password form, Reset card
│   │   ├── Tasks/             # Tasks filter, Category badges, Task list, Modals
│   │   ├── WorkerDashboard/   # Status banners, Shift checklist, Leave & Safety modals
│   │   ├── Workers/           # Workers directory grid, Trade filter, Profile modals
│   │   ├── WorkerSettings/    # Worker profile, Account details, Security form
│   │   ├── ui/                # Base design system (Card, Badge, ProgressBar, etc.)
│   │   └── index.js           # Central barrel export file
│   ├── context/               # Context providers (AuthContext, DataContext)
│   ├── controllers/           # Custom hook page controllers
│   ├── models/                # Business logic & data domain models
│   ├── pages/                 # Clean, lean page routes
│   └── store/                 # Zustand State Architecture
│       ├── useAuthStore.js
│       ├── useDataStore.js
│       ├── useLeaveRequestStore.js
│       ├── useMaterialStore.js
│       ├── useNotificationStore.js
│       ├── useProjectStore.js
│       ├── useTaskStore.js
│       ├── useWorkerNotesStore.js
│       └── useWorkerStore.js
├── public/                    # Static assets
├── package.json               # Project manifest
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started & Local Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vengat-offcial-web/BuildOS.git
   cd BuildOS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the application.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔒 Demo Credentials & User Roles

| Role | Email / Access | Key Capabilities |
| :--- | :--- | :--- |
| **Admin / Director** | `admin@gmail.com` | Full system access, project creation, site engineer assignment, worker approval, inventory management, reports audit. |
| **Site Worker** | Worker Portal Access | Shift clock in/out, daily checklist submission, leave application, site safety hazard reporting. |

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
