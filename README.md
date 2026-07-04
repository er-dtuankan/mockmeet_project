# 🎯 MockMeet

A production-ready, resume-level full-stack **Mock Interview Scheduling and Peer Review Platform** built in standard modular architecture (Hitesh Choudhary "Chai aur Code" style).

## 🚀 Key Features

* **Role-Based Access Control**: Separate panels and workspaces for **Students**, **Interviewers**, and **Teachers** driven by custom JWT authorization middleware.
* **Peer Interview Swap**: Students can toggle Interviewer Mode on, set their expert domains, list availability slots, and accept bookings from peers.
* **Atomic Bookings & Slot Locking**: Mongoose transactions and updates verify availability slots before locking, avoiding double-bookings.
* **Simulated Google Meet Link Generator**: Automatically generates and stores valid Google Meet URLs when bookings are confirmed.
* **Double-Sided Peer Reviews**: Allows student and interviewer to rate (interactive star hover picker) and review each other to build stats profiles.
* **Real-time Notifications bell**: 30-second polling widget keeps users updated on requests, status approvals, and reviews received.
* **Teacher Admin Monitor**: Gives supervisors analytics overview, leaderboards, student directories, and logs of all bookings.

---

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite template) + React Router DOM + Tailwind CSS
* **Backend**: Node.js + Express.js (ES Modules structure)
* **Database**: MongoDB + Mongoose ODM
* **Auth**: JSON Web Tokens (JWT) + bcryptjs password hashing
* **Deployment**: Vercel (Frontend) & Render (Backend API Web Service)

---

## 📁 Repository Structure

```
mockmeet/
├── backend/
│   ├── server.js              # Server entry (Mongoose connect + listen)
│   ├── app.js                 # Express config, CORS, error middleware
│   └── src/
│       ├── config/            # DB & CORS configuration
│       ├── controllers/       # Controller logic (Auth, Bookings, Slots, Reviews)
│       ├── middlewares/       # verifyJWT & requireRole RBAC gates
│       ├── models/            # Mongoose Schema Definitions
│       ├── routes/            # Sub-routers & master index router
│       └── utils/             # ApiError, ApiResponse, asyncHandler, meetLink
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI widgets & Modals
│   │   ├── context/           # AuthContext (JWT verification & user syncing)
│   │   ├── pages/             # Landing, Login, Register, Dashboards, Profiles
│   │   ├── services/          # Axios API Client (with Bearer Token interceptor)
│   │   ├── App.jsx            # Routing configurations
│   │   ├── index.css          # Premium Dark style sheet (Tailwind base)
│   │   └── main.jsx           # Mount entry point
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── DEPLOYMENT.md              # Cloud deployment walkthrough
└── README.md                  # This overview document
```

---

## ⚡ Getting Started

Read [`DEPLOYMENT.md`](DEPLOYMENT.md) for complete details on creating your MongoDB Atlas instance, setting cloud environment variables, and hosting the application on Render and Vercel.
