# Freedom Notes

Freedom Notes is a web application for creating, sharing, and managing notes within a board-based system. It provides features for both public and anonymous note posting, note approval by admins, and user authentication.

## Features

- **Create Notes:** Users can create notes with a title, body, tags, and select a board. Notes can be posted publicly or anonymously.
- **Boards:** Organize notes into boards. Boards can be created and their status managed by admins.
- **Approval Workflow:** Notes require admin approval before being publicly visible. Admins can approve, archive, or delete notes.
- **User Authentication:** Users can sign up, log in, and view their own notes. Roles include regular users and admins.
- **Pagination & Sorting:** Notes are paginated and can be sorted on retrieval.
- **Admin Dashboard:** Admins have access to more advanced management features, including viewing all users and moderating notes.
- **REST API:** The backend exposes a RESTful API for frontend consumption.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js, Express.js, MongoDB (with Mongoose)
- **Authentication:** JWT-based authentication for secure routes
- **Other:** CORS, dotenv

## Project Structure

```
freedomnotes/
├── backend/
│   ├── controllers/   # REST API controllers (note, user, board)
│   ├── models/        # Mongoose models (Note, User, Board)
│   ├── routes/        # Express routers
│   ├── middlewares/   # Authentication/authorization middleware
│   └── server.js      # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # React page components (Admin, etc.)
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   └── README.md        # Frontend-specific info
└── README.md            # (You are here)
```

## Getting Started

### Backend

1. **Install dependencies:**
    ```bash
    cd backend
    npm install
    ```
2. **Environment Variables:**
    - Create a `.env` file in `backend/` with:
      ```
      MONGO_URI=<your-mongodb-connection-string>
      JWT_SECRET=<your-secret>
      ```
3. **Run the backend:**
    ```bash
    npm start
    ```

### Frontend

1. **Install dependencies:**
    ```bash
    cd frontend
    npm install
    ```
2. **Environment Variables:**
    - Create a `.env` file in `frontend/` with:
      ```
      VITE_API_URL=http://localhost:5000
      ```
    - Adjust the `VITE_API_URL` if your backend is running on a different host or port.
3. **Run the frontend:**
    ```bash
    npm run dev
    ```
4. **Open** [http://localhost:5173](http://localhost:5173) in your browser.

## API Overview

- `POST   /api/user/signup` — Register new user
- `POST   /api/user/login`  — Log in
- `GET    /api/note`        — Get all approved notes
- `POST   /api/note`        — Create new note (authenticated)
- `PATCH  /api/note/:id/approve` — Approve a note (admin)
- `PATCH  /api/note/:id/archive` — Archive a note (admin)
- `PATCH  /api/note/archive-by-user` — Archive user's own note
- ...and more (see backend routes for details)

<!-- ## Contributing

Contributions are welcome! Please open an issue or submit a pull request. -->

## License

Copyright (c) 2025 [Mark Daniel V. Callejas | [IkedaLab-Daniel](https://github.com/IkedaLab-Daniel)]

Permission is granted to view the source code for personal, non-commercial purposes only. Copying, downloading, modifying, redistributing, or republishing this code, in whole or in part, is strictly prohibited without explicit written permission from the author.

## Maintainer

- [IkedaLab-Daniel](https://github.com/IkedaLab-Daniel)