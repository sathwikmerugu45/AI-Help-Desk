# AI Help Desk 🤖🎫

An intelligent ticket management system powered by AI, designed to streamline support workflows by automatically analyzing, categorizing, and resolving help desk tickets using advanced AI capabilities.

## 🎯 Overview

**AI Help Desk** is a full-stack web application that combines modern web technologies with AI-powered ticket intelligence. The system uses **Inngest** (an event-driven platform) to process tickets intelligently and provide automated insights, while offering a clean, intuitive UI for support teams to manage tickets efficiently.

### Key Features
- 🔐 User authentication with JWT tokens and role-based access control
- 🎫 Intelligent ticket creation and management
- 🤖 AI-powered ticket analysis and categorization
- 💼 Admin dashboard for ticket oversight and user management
- 📊 Skill-based ticket assignment and routing
- 🔄 Event-driven architecture with Inngest for asynchronous processing
- 🎨 Modern React UI with Tailwind CSS and DaisyUI
- 📱 Responsive design for all devices

---

## 📋 Stack

### Backend
- **Language:** JavaScript (Node.js)
- **Framework:** Express 5.1
- **Database:** MongoDB with Mongoose ODM
- **Event Processing:** Inngest (v3.38.0) with Agent Kit for AI capabilities
- **Authentication:** JWT + bcryptjs for password hashing
- **Email Service:** Nodemailer (v7.0.3)

### Frontend
- **Language:** JavaScript (ES modules)
- **Framework:** React 19.1
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1.8 + DaisyUI 5.0.42
- **Routing:** React Router DOM 7.6.1
- **Markdown:** React Markdown for rich text display

### DevTools
- ESLint for code quality
- Nodemon for development server hot-reload

---

## 📁 Project Structure

```
ai-ticket-assistant/              Backend (Express + Inngest)
├── index.js                       Main server entry point
├── package.json                   Dependencies: Express, Mongoose, Inngest, JWT, Nodemailer
├── controllers/
│   ├── user.js                    User signup, login, logout, management
│   └── ticket.js                  Ticket CRUD operations
├── routes/
│   ├── user.js                    Auth endpoints (/api/auth/*)
│   └── ticket.js                  Ticket endpoints (/api/tickets/*)
├── models/
│   ├── user.js                    Mongoose User schema (email, password, role, skills)
│   └── ticket.js                  Mongoose Ticket schema (title, description, status, priority)
├── inngest/
│   ├── client.js                  Inngest client configuration
│   └── functions/
│       ├── on-signup.js           Triggered on user signup (email notifications)
│       └── on-ticket-create.js    Triggered on ticket creation (AI analysis, categorization)
├── middlewares/                   Authentication & validation middleware
└── utils/                         Helper functions and utilities

ai-ticket-frontend/               Frontend (React + Vite)
├── index.html                     HTML entry point
├── vite.config.js                 Vite configuration
├── package.json                   React, Vite, Tailwind, React Router
├── src/
│   ├── main.jsx                   Router setup with protected routes
│   ├── index.css                  Global styles
│   ├── components/
│   │   ├── check-auth.jsx         Protected route wrapper (authentication check)
│   │   └── navbar.jsx             Navigation header with logout
│   ├── pages/
│   │   ├── login.jsx              User login form
│   │   ├── signup.jsx             User registration form
│   │   ├── tickets.jsx            List all tickets (main dashboard)
│   │   ├── ticket.jsx             Individual ticket detail & chat view
│   │   └── admin.jsx              Admin dashboard for system management
│   ├── assets/                    Images and static resources
│   └── public/                    Static files served by Vite

.gitignore                         Ignore environment files and node_modules
```

### How It Fits Together

1. **Request Flow:** User interacts with the React frontend → API calls to Express backend → Database operations via Mongoose → Response back to UI
2. **Authentication:** User logs in → JWT token issued → Token stored in localStorage → Included in API request headers for protected routes
3. **Ticket Processing:** 
   - User creates a ticket via frontend
   - Express saves ticket to MongoDB
   - Inngest event triggered (`ticket/created`)
   - AI agent analyzes ticket content (with Inngest Agent Kit)
   - Results stored and displayed in real-time
4. **Admin Management:** Admin dashboard fetches all users and tickets, manages roles and skill assignments

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (local or cloud Atlas)
- **Inngest account** with API key (for event processing)

### Setup Instructions

#### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/sathwikmerugu45/AI-Help-Desk.git
cd AI-Help-Desk

# Backend setup
cd ai-ticket-assistant
npm install

# Frontend setup (in another terminal)
cd ../ai-ticket-frontend
npm install
```

#### 2. Environment Configuration

Create `.env` file in `ai-ticket-assistant/`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-help-desk
JWT_SECRET=your_jwt_secret_key_here
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
```

Create `.env` file in `ai-ticket-frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

#### 3. Start Development Servers

**Backend:**
```bash
cd ai-ticket-assistant
npm run dev          # Starts on http://localhost:3000
# In another terminal:
npm run inngest-dev  # Starts Inngest dev server on http://localhost:8288
```

**Frontend:**
```bash
cd ai-ticket-frontend
npm run dev          # Starts on http://localhost:5173
```

#### 4. Build for Production

```bash
# Backend (already optimized for Node.js)
# Frontend
cd ai-ticket-frontend
npm run build        # Creates dist/ folder
npm run preview      # Preview production build
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /login` - Authenticate user (returns JWT)
- `POST /logout` - Clear session
- `GET /users` - List all users
- `PUT /users/:email` - Update user skills/role

### Tickets (`/api/tickets`)
- `POST /` - Create new ticket
- `GET /` - List all tickets
- `GET /:id` - Get ticket details
- `PATCH /:id/status` - Update ticket status

### Inngest Webhooks (`/api/inngest`)
- Webhooks for event processing

---

## 🤖 AI Features

The system uses **Inngest Agent Kit** to power intelligent ticket analysis:

### `on-ticket-create.js`
Triggered when a new ticket is created. The AI agent:
- ✅ Analyzes ticket title and description
- 📂 Suggests appropriate categories/priority levels
- 🔖 Identifies related skills needed
- 👤 Recommends which user should handle it
- 💡 Generates helpful notes and suggested resolution steps

### `on-signup.js`
Triggered on user registration:
- 📧 Sends welcome email
- 🎯 Sets up user profile with skills

---

## 🔐 Authentication & Authorization

- **JWT-based authentication** with 7-day expiration
- **Roles:** `user`, `moderator`, `admin`
- **Protected routes:** Tickets page, admin dashboard require valid JWT
- **Password security:** Bcryptjs with salt rounds = 10

---

## 🛠️ Development Commands

### Backend
```bash
npm run dev              # Start with hot-reload (nodemon)
npm run inngest-dev      # Start Inngest local dev server
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # Production build
npm run lint             # Check code with ESLint
npm run preview          # Preview production build
```

---

## 📝 Example Workflow

1. **User Signs Up**
   - Fills email, password, and skills
   - Backend hashes password, stores in MongoDB
   - Inngest `on-signup` event triggered → Welcome email sent
   - JWT token returned

2. **User Creates Ticket**
   - Fills in title and description
   - Frontend sends POST request to `/api/tickets`
   - Ticket saved to MongoDB
   - Inngest `ticket/created` event triggered
   - AI agent analyzes: "This is a billing issue requiring database admin skills"
   - Ticket enriched with AI insights (category, priority, suggested assignee)
   - User sees enriched ticket details on dashboard

3. **Admin Reviews & Routes**
   - Admin goes to admin panel
   - Sees all tickets and users
   - Can assign tickets to users with matching skills
   - Can update user roles for escalation handling

---

## 🐛 Troubleshooting

### MongoDB Connection Errors
```
Check MONGO_URI in .env
Ensure MongoDB service is running
For Atlas: Verify IP whitelist includes your machine
```

### Inngest Events Not Processing
```
Verify INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY in .env
Run inngest-dev server: npm run inngest-dev
Check Inngest dashboard for event logs
```

### JWT Token Expired
```
Token expires in 7 days
User will need to login again
Token is stored in localStorage
```

### CORS Errors
```
Frontend and backend must be on same or allowed origins
Check Express cors() middleware in index.js
Update VITE_API_URL in frontend .env
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| **Express 5.1** | Web framework for backend API |
| **Mongoose 8.15.1** | MongoDB object modeling |
| **Inngest 3.38** | Event-driven processing & AI orchestration |
| **JWT (jsonwebtoken 9.0.2)** | Secure token generation |
| **Bcryptjs 2.4.3** | Password hashing & comparison |
| **React 19.1** | Frontend UI framework |
| **Vite 6.3.5** | Fast frontend build tool |
| **Tailwind CSS 4.1.8** | Utility-first CSS framework |
| **DaisyUI 5.0.42** | Component library for Tailwind |

---

## 📸 Screenshots

The application includes:
- **Login/Signup Pages:** Clean authentication flow with validation
- **Tickets Dashboard:** Grid/list view of all support tickets
- **Ticket Details:** Full ticket information with AI-generated insights
- **Admin Dashboard:** System-wide management of users, tickets, and assignments

---

## 🚀 Deployment

### Backend (Inngest-powered Express)
```bash
# Using Vercel
vercel deploy

# Using Railway, Render, or Heroku
# Push to git and connect to deployment platform
# Set environment variables in platform dashboard
```

### Frontend (Vite build)
```bash
# Using Vercel, Netlify, or GitHub Pages
npm run build
# Deploy the dist/ folder
```

---

## 📚 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Inngest Documentation](https://www.inngest.com/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💬 Support

For questions or issues:
- 📧 Email: sathwikmerugu45@example.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/sathwikmerugu45/AI-Help-Desk/issues)
- 💭 Discussions: [Start a discussion](https://github.com/sathwikmerugu45/AI-Help-Desk/discussions)

---

**Made with ❤️ by Sathwik Merugu**
