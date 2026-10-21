# Smart Hostel Maintenance Portal

A role-based hostel management web application designed to streamline maintenance requests, staff assignments, and admin oversight. The portal allows students to raise complaints, staff to resolve maintenance work, and administrators to monitor operations and generate reports.

## Features

- Student complaint registration and tracking
- Staff dashboard for assigned work and updates
- Admin overview with complaint metrics and staff management
- Role-based route protection and secure login flow
- Notifications for complaint status changes
- Feedback submission and user profile management
- Local demo data persistence using browser storage

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM

## Project Screenshots

### Login Page

![Login Page](https://placehold.co/1200x700/0f172a/ffffff?text=Login+Page)

### Student Dashboard

![Student Dashboard](https://placehold.co/1200x700/1d4ed8/ffffff?text=Student+Dashboard)

### Staff Dashboard

![Staff Dashboard](https://placehold.co/1200x700/047857/ffffff?text=Staff+Dashboard)

### Admin Dashboard

![Admin Dashboard](https://placehold.co/1200x700/7c3aed/ffffff?text=Admin+Dashboard)

> Replace the placeholder screenshots with actual app screenshots when you are ready to showcase the project on GitHub.

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@hostel.com | student123 |
| Maintenance Staff | staff@hostel.com | staff123 |
| Admin / Warden | admin@hostel.com | admin123 |

## Getting Started

1. Clone the repository
2. Navigate into the project folder
3. Install dependencies
4. Start the development server

```bash
cd hostel-portal
npm install
npm run dev -- --host 0.0.0.0
```

Then open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Deploying to Netlify

Import this repository in Netlify and use the build command `npm run build` with the publish directory `dist`. The included `netlify.toml` configures these settings and the single-page-app route fallback.

With no `VITE_API_BASE_URL` set, the demo uses browser local storage, including the seeded demo accounts. This mode is limited to the current browser and is not shared or durable across users/devices. For a shared deployment, host the Express API separately, set `VITE_API_BASE_URL` in Netlify to its origin (for example, `https://your-api.example.com`), and redeploy. The current API stores data in memory, so use a persistent database before relying on it for real users.

## Project Structure

```bash
hostel-portal/
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

## Notes

- The app uses browser local storage for demo data persistence.
- To reset the app to the default sample data, clear local storage for the app's origin.
- The project is suitable for academic/demo use and can be extended with a real backend and database.

## License

This project is intended for educational and demonstration purposes.
