# ToDo App (Real-Time)

This project is a real-time To-Do List application built with the following stack:

- **Frontend:** Angular with Angular Material
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.IO

## Features

- Create, update, and delete tasks
- Task priority and due date
- Real-time synchronization of tasks across multiple clients
- Edit-locking to prevent simultaneous edits

---

##  Setup and Run Instructions

### Prerequisites

- Node.js (v22+)
- Angular CLI (v17+)
- MongoDB (local or cloud instance)

### 1. Clone the Repository


git clone https://github.com/your-username/your-todo-app.git



### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure your MongoDB server is running on `mongodb://localhost:27017/todo-app` or update the connection string in `server.js`.

### 4. Run Backend Server

```bash
npm start
```

This will start the backend on `http://localhost:5000`.

### 5. Install Frontend Dependencies

```bash
npm install
```

### 6. Run Angular App

```bash
ng serve
```

The frontend will be available at `http://localhost:4200`

---

## 📐 Design Decisions & Patterns

### Folder Structure

- Angular frontend is organized by **features** and **concerns**, with separate folders for components and services.
- Node.js backend uses the **Repository Pattern** for data handling logic.

### Real-Time Functionality

- Implemented using **Socket.IO**.
- Updates (create, edit, delete) are emitted from the server and received in the client using a custom `SocketService`.

### Edit Locking

- Each task has `isLocked` and `lockedBy` fields in the database.
- When a user begins editing a task, it is locked to prevent other users from editing or deleting it concurrently.

### Component Responsibility

- Each Angular component has a **single responsibility**.
  - `task-list.component.ts` for displaying tasks.
  - `task-form.component.ts` for adding/updating/deleting tasks.

### UI/UX

- Angular Material components for clean and responsive UI.
- Priority dropdown defaults to `Low`.
- Clear button separation for add/update/delete actions.

---

## ✅ Notes

- Make sure ports 4200 (frontend) and 5000 (backend) are open.
- Real-time updates work seamlessly when multiple clients are open.

---



