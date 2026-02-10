# RADAR - Real-time Advanced Data Analysis & Reporting

## 📋 Project Overview

RADAR is a **medical health monitoring system** built with Next.js 16, providing real-time patient vital sign monitoring, historical tracking, AI-powered chatbot assistance, and doctor appointment booking. The application uses **Supabase** for authentication and data storage.

---

## ✨ Implemented Features

### 1. 🔐 User Authentication System

**What It Does**: Complete user registration and login system with secure authentication

**Implementation Details**:
- **Registration**: Users can create accounts with email, password, and name
- **Login**: Email/password authentication with session management
- **Session Persistence**: User sessions are maintained across page refreshes using cookies
- **Protected Routes**: Automatic redirect to login page if user tries to access protected content
- **Logout**: Users can sign out from header or sidebar, clearing their session

**User Flow**:
```
New User → Register Page → Enter Details → Account Created → Auto Login → Dashboard
Returning User → Login Page → Enter Credentials → Session Created → Dashboard
Authenticated User → Browse App → Click Logout → Session Cleared → Login Page
```

**Technical Highlights**:
- Uses Supabase Auth for secure password hashing and session management
- Server-side authentication checks on every protected route
- Cookie-based session storage for seamless user experience
- Automatic session refresh to keep users logged in

---

### 2. 📊 Real-Time Dashboard

**What It Does**: Central monitoring hub displaying patient vital signs and health metrics in real-time

**Implementation Details**:
- **Live Data Display**: Shows current heart rate, blood pressure, temperature, and oxygen levels
- **Auto-Refresh**: Data updates every 5 seconds without page reload
- **Visual Indicators**: Color-coded metrics for quick health status assessment
- **User Personalization**: Displays logged-in user's name and profile information
- **Quick Navigation**: Access to all features from central location

**Data Flow**:
```
Sensor Data API → Sensor Context → Dashboard Components → Real-time Display
    ↓
Auto Polling (every 5s) → Fetch Latest Data → Update State → Re-render UI
```

**Key Metrics Displayed**:
- Heart Rate (BPM)
- Blood Pressure (Systolic/Diastolic)
- Body Temperature (°F)
- Oxygen Saturation (%)
- Respiratory Rate
- Timestamp of last reading

---

### 3. 📝 Patient History Management

**What It Does**: Complete medical history tracking system for patients

**Implementation Details**:
- **Historical Records**: View past medical visits, diagnoses, and treatments
- **Chronological Timeline**: Records organized by date for easy reference
- **Doctor Notes**: Access to physician observations and recommendations
- **Treatment Plans**: View prescribed medications and treatment protocols
- **Search & Filter**: Find specific records by date, condition, or doctor

**User Journey**:
```
User → History Page → View Past Records → Select Specific Visit → See Details
                                          ↓
                                    Doctor Notes, Diagnosis, Treatment
```

**Information Captured**:
- Visit dates
- Diagnoses
- Treatments prescribed
- Doctor notes and observations
- Follow-up recommendations
- Test results

---

### 4. 🏥 Doctor Appointment Booking

**What It Does**: Comprehensive appointment scheduling system

**Implementation Details**:
- **Doctor Selection**: Browse available doctors by specialty
- **Date/Time Picker**: Choose convenient appointment slots
- **Appointment Reason**: Specify the purpose of visit
- **Booking Confirmation**: Receive confirmation after successful booking
- **Appointment Status**: Track scheduled, completed, and cancelled appointments
- **Modal Interface**: User-friendly booking form in popup dialog

**Booking Process Flow**:
```
Dashboard → Action Button → Booking Modal Opens
    ↓
Select Doctor → Choose Date/Time → Enter Reason → Confirm
    ↓
API Request → Save to Database → Confirmation Message → Close Modal
    ↓
View Appointments → See Scheduled Visits → Get Reminders
```

**Appointment Management**:
- Create new appointments
- View upcoming appointments
- Track appointment status (scheduled/completed/cancelled)
- Store appointment details (doctor, date, reason)
- Future enhancement: Email/SMS reminders

---

### 5. 🤖 AI-Powered Medical Chatbot

**What It Does**: Intelligent conversational assistant for medical queries and guidance

**Implementation Details**:
- **Natural Language Processing**: Understands medical questions in plain English
- **Context-Aware Responses**: Maintains conversation history for coherent dialogue
- **Medical Knowledge Base**: Powered by GROQ AI with medical training
- **Real-Time Responses**: Instant answers to health-related questions
- **Conversation History**: Tracks previous messages in current session
- **User-Friendly Interface**: Chat widget accessible from any page

**Chat Interaction Flow**:
```
User Types Question → Send to Chatbot Page
    ↓
Message → Chat Context → API Request to GROQ
    ↓
GROQ AI Processing → Generate Response → Return Answer
    ↓
Display in Chat Widget → Add to History → Ready for Next Question
```

**Capabilities**:
- Answer medical terminology questions
- Explain vital sign meanings
- Provide general health information
- Guide users through app features
- Maintain conversation context
- Clear chat history option

**Example Interactions**:
- "What is a normal blood pressure?"
- "What do my heart rate readings mean?"
- "How do I book a doctor appointment?"
- "What should I do if my oxygen level is low?"

---

### 6. 🫀 Medical Monitoring Sections

**What It Does**: Specialized monitoring pages for different body systems

**Implementation Details**:

#### **Cardiovascular Monitoring**
- Heart rate tracking
- Blood pressure monitoring
- ECG data visualization (future enhancement)
- Heart health indicators
- Trend analysis over time

#### **Respiratory Monitoring**
- Oxygen saturation levels
- Respiratory rate tracking
- Breathing pattern analysis
- Lung function metrics

#### **Metabolic Monitoring**
- Blood glucose levels
- BMI tracking
- Metabolic rate indicators
- Nutritional metrics

#### **Renal (Kidney) Monitoring**
- Kidney function markers
- Hydration levels
- Electrolyte balance

#### **Autonomic System Monitoring**
- Body temperature regulation
- Blood pressure variability
- Heart rate variability
- Stress indicators

**Monitoring Flow**:
```
User → Select Body System → View Specific Metrics
    ↓
Real-time Data → System-Specific Display → Historical Trends
    ↓
Abnormal Values → Visual Alerts → Recommendations
```

---

### 7. ℹ️ RTAR Information System

**What It Does**: Educational resource about the RADAR system

**Implementation Details**:
- **System Overview**: What RADAR does and why it's important
- **Feature Explanations**: Detailed descriptions of each capability
- **User Guides**: How to use different features effectively
- **FAQ Section**: Common questions and answers
- **Contact Information**: Support resources

---

### 8. 🔄 Real-Time Data Synchronization

**What It Does**: Keeps all data fresh and synchronized across the application

**Implementation Details**:
- **Automatic Polling**: Data fetched every 5 seconds
- **Context-Based State**: Global state management using React Context
- **Efficient Updates**: Only re-renders components with changed data
- **Error Handling**: Graceful fallback if API fails
- **Loading States**: Visual feedback during data fetch

**Synchronization Architecture**:
```
Sensor Context Provider (Root Level)
    ↓
Automatic Interval (5 seconds)
    ↓
Fetch Data from API → Update Global State
    ↓
All Consuming Components Re-render with New Data
    ↓
Dashboard, Monitoring Pages, Widgets Updated
```

---

### 9. 🎨 Responsive User Interface

**What It Does**: Modern, accessible interface that works on all devices

**Implementation Details**:
- **Component Library**: Built with shadcn/ui for consistency
- **Tailwind CSS**: Utility-first styling for rapid development
- **Responsive Design**: Adapts to desktop, tablet, and mobile
- **Dark Mode Support**: Theme provider for light/dark modes
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Skeleton screens and spinners for better UX

**UI Components**:
- Buttons with multiple variants (primary, secondary, outline, ghost)
- Form inputs with validation styling
- Cards for content organization
- Modals/Dialogs for focused interactions
- Badges for status indicators
- Charts for data visualization

---

### 10. 🗺️ Location Services (Map Integration)

**What It Does**: Displays user location and nearby medical facilities

**Implementation Details**:
- **Map Component**: Interactive map showing current location
- **Doctor Locations**: Shows nearby doctors and hospitals
- **Navigation Integration**: Can direct users to medical facilities
- **Emergency Services**: Quick access to nearest emergency rooms

---

## 🔄 Complete User Journey Flow

### First-Time User Experience:
```
1. Land on Homepage → Learn about RADAR
2. Click "Sign Up" → Register with Email/Password/Name
3. Auto-Login → Redirected to Dashboard
4. View Welcome Tour → Introduction to Features
5. See Mock Data → Vital signs displayed
6. Explore Features:
   - Check History Tab (empty for new user)
   - Try Chatbot → Ask health questions
   - View Monitoring Sections → See different body systems
   - Book Appointment → Schedule with doctor
7. Logout → Return to Login Page
```

### Returning User Experience:
```
1. Visit App → Login Page
2. Enter Credentials → Authentication
3. Dashboard Opens → See Latest Vitals
4. Auto-Refresh Data → Real-time updates every 5s
5. Navigate Features:
   - View History → Past medical records
   - Check Appointments → Upcoming visits
   - Use Chatbot → Quick questions
   - Monitor Systems → Specific body system data
6. Logout When Done → Session Cleared
```

### Medical Professional Workflow:
```
1. Login → Professional Dashboard
2. View Patient List → Select Patient
3. Access Patient Data:
   - Current vital signs
   - Medical history
   - Scheduled appointments
4. Review Trends → Analyze health patterns
5. Add Notes → Document observations
6. Schedule Follow-up → Book next appointment
7. Logout → Secure session end
```

---

## 📱 Feature Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                    RADAR Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Authentication Layer (All Routes Protected)                 │
│  ├── Login System                                            │
│  ├── Registration System                                     │
│  └── Session Management                                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Main Dashboard (Hub)                       │ │
│  │  ├── Real-time Vitals Display                          │ │
│  │  ├── Quick Stats Overview                              │ │
│  │  └── Navigation to All Features                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Connected Features:                                          │
│  ├── Patient History ──────────┐                            │
│  │   └── Medical Records       │                            │
│  │                              │                            │
│  ├── Appointment Booking ──────┤──→ Backend API             │
│  │   └── Doctor Scheduling     │                            │
│  │                              │                            │
│  ├── AI Chatbot ───────────────┤──→ GROQ API                │
│  │   └── Medical Q&A           │                            │
│  │                              │                            │
│  ├── Medical Monitoring ───────┤──→ Sensor Data API         │
│  │   ├── Cardiovascular        │                            │
│  │   ├── Respiratory           │                            │
│  │   ├── Metabolic             │                            │
│  │   ├── Renal                 │                            │
│  │   └── Autonomic             │                            │
│  │                              │                            │
│  └── Location Services ────────┘──→ Map Integration          │
│      └── Nearby Facilities                                   │
│                                                               │
│  Data Layer:                                                  │
│  ├── Supabase (Auth + Database)                             │
│  ├── Context Providers (State Management)                    │
│  └── Real-time Polling (Data Sync)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16.0.7 (App Router + Turbopack)
- **Language**: TypeScript
- **Authentication**: Supabase Auth (Email/Password)
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: GROQ API (for chatbot)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Package Manager**: pnpm

### Application Type
**Full-Stack Monolith** - Frontend and backend in one Next.js application:
- **Frontend**: React Server Components + Client Components
- **Backend**: Next.js API Routes (`/api/*`)
- **Database**: Cloud-hosted Supabase (no local database needed)

---

## 📁 Project Structure

```
RADAR-APP/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (radar)/                  # Protected routes group
│   │   │   ├── layout.tsx            # Protected layout with auth check
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── history/              # Patient history
│   │   │   ├── action/               # Doctor appointment booking
│   │   │   ├── doctor/               # Doctor management
│   │   │   ├── chatbot/              # AI chatbot interface
│   │   │   ├── cardiovascular/       # Cardiovascular monitoring
│   │   │   ├── respiratory/          # Respiratory monitoring
│   │   │   ├── metabolic/            # Metabolic monitoring
│   │   │   ├── renal/                # Renal monitoring
│   │   │   ├── autonomic/            # Autonomic monitoring
│   │   │   └── rtar-info/            # RTAR info page
│   │   │
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── register/page.tsx     # Registration page
│   │   │   └── callback/route.ts     # OAuth callback handler
│   │   │
│   │   ├── api/                      # Backend API routes
│   │   │   ├── data/route.ts         # Sensor data API
│   │   │   ├── chat/route.ts         # AI chatbot API
│   │   │   └── analysis/route.ts     # Data analysis API
│   │   │
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx            # App header with user info
│   │   │   └── sidebar.tsx           # Navigation sidebar
│   │   │
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx            # Button component
│   │   │   ├── input.tsx             # Input component
│   │   │   ├── card.tsx              # Card component
│   │   │   ├── dialog.tsx            # Modal dialog
│   │   │   └── ...                   # Other UI components
│   │   │
│   │   ├── chat/                     # Chat components
│   │   │   ├── chat-widget.tsx       # Chat UI widget
│   │   │   └── chat-context.tsx      # Chat state management
│   │   │
│   │   ├── data/                     # Data components
│   │   │   └── sensor-context.tsx    # Sensor data state
│   │   │
│   │   ├── map/                      # Map components
│   │   │   └── Map.tsx               # Location map
│   │   │
│   │   ├── action/                   # Action components
│   │   │   └── BookingModal.tsx      # Appointment booking modal
│   │   │
│   │   └── providers/
│   │       └── provider.tsx          # Global providers (Theme)
│   │
│   ├── lib/
│   │   ├── supabase/                 # Supabase utilities
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   └── middleware.ts         # Session management
│   │   │
│   │   ├── utils.ts                  # Utility functions
│   │   └── data-utils.ts             # Data processing utilities
│   │
│   └── proxy.ts                      # Next.js 16 proxy/middleware
│
├── .env                              # Environment variables
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── components.json                   # shadcn/ui config
```

---

## 🔐 Authentication System

### Technology: Supabase Auth

**Location**: `src/lib/supabase/`

### How It Works

#### 1. **Client-Side Authentication** (`src/lib/supabase/client.ts`)

**Purpose**: Creates a Supabase client using `createBrowserClient` from `@supabase/ssr` for use in client components (pages with `"use client"`).

**Used in**:
- Login page (`src/app/auth/login/page.tsx`)
- Register page (`src/app/auth/register/page.tsx`)
- Header logout (`src/components/layout/header.tsx`)

#### 2. **Server-Side Authentication** (`src/lib/supabase/server.ts`)

**Purpose**: Creates a Supabase client using `createServerClient` from `@supabase/ssr` for server components with automatic session management via cookies. Handles cookie operations (get, set, remove) using Next.js cookies API.

**Used in**:
- Protected layout (`src/app/(radar)/layout.tsx`)
- API routes that need authentication

#### 3. **Session Management** (`src/lib/supabase/middleware.ts`)

**Purpose**: Keeps user sessions fresh by checking authentication on every request. Calls `supabase.auth.getUser()` to refresh the session if needed.

**Used in**: `src/proxy.ts` (Next.js 16 middleware pattern)

### Authentication Flow

#### Registration Flow:
```
User fills form → /auth/register
    ↓
supabase.auth.signUp({ email, password, name })
    ↓
Account created in Supabase
    ↓
Auto-redirect to /dashboard
```

#### Login Flow:
```
User enters credentials → /auth/login
    ↓
supabase.auth.signInWithPassword({ email, password })
    ↓
Session cookie created
    ↓
Redirect to /dashboard
```

#### Logout Flow:
```
User clicks logout → Header/Sidebar
    ↓
supabase.auth.signOut()
    ↓
Session cleared
    ↓
Redirect to /auth/login
```

#### Protected Route Check:
```
User visits /dashboard
    ↓
Layout checks: supabase.auth.getUser()
    ↓
If no user → Redirect to /auth/login
If user exists → Show dashboard
```

---

## 🎨 Component Architecture

### Layout Components

#### Header (`src/components/layout/header.tsx`)
**Purpose**: Top navigation bar with user info and logout

**Key Features**:
- Displays user initial (first letter of name using `charAt(0).toUpperCase()`)
- Notification bell icon
- Logout button (calls `supabase.auth.signOut()` then redirects to login)
- Responsive mobile menu toggle

#### Sidebar (`src/components/layout/sidebar.tsx`)
**Purpose**: Left navigation menu with route links

**Key Features**:
- Activity/Home link
- History tracking
- Doctor appointments
- Medical monitoring sections (Cardiovascular, Respiratory, etc.)
- AI Chatbot
- RTAR Info
- Logout at bottom

**Navigation**: Uses Next.js Link component for client-side navigation between pages.

### Protected Layout (`src/app/(radar)/layout.tsx`)
**Purpose**: Wrapper for all authenticated pages

**Authentication Logic**:
1. Creates server-side Supabase client
2. Calls `supabase.auth.getUser()` to check if user is authenticated
3. If no user found, redirects to `/auth/login`
4. If user exists, renders layout with Sidebar, Header (passing user name), and page content

**Why This Works**:
- Runs on **server** before page renders
- Checks authentication **before** user sees page
- Automatically redirects if not logged in
- Passes user data to Header component

---

## 🔌 API Routes

### 1. Data API (`src/app/api/data/route.ts`)
**Purpose**: Fetch sensor/patient monitoring data

**Endpoint**: `GET /api/data`

**Current Implementation**: Returns mock sensor data including heart rate, blood pressure, temperature, oxygen level, and timestamp.

**How to Make It Real**: Connect to Supabase using `createClient()`, query the `sensor_readings` table with filters and ordering, then return the JSON data.

### 2. Chat API (`src/app/api/chat/route.ts`)
**Purpose**: AI chatbot using GROQ API

**Endpoint**: `POST /api/chat`

**Request Body**: Accepts `message` (user's question) and `history` (previous conversation)

**Logic**: 
1. Extracts message and history from request body
2. Calls GROQ API at `https://api.groq.com/openai/v1/chat/completions`
3. Uses model `mixtral-8x7b-32768`
4. Sends system message (medical assistant role), conversation history, and user message
5. Returns AI response as JSON

### 3. Analysis API (`src/app/api/analysis/route.ts`)
**Purpose**: Analyze patient data and provide insights

**Endpoint**: `POST /api/analysis`

**Logic**: Process vital signs and return health status

---

## 🎯 Context & State Management

### Chat Context (`src/components/chat/chat-context.tsx`)
**Purpose**: Global chat state management using React Context API

**Provides**:
- Chat messages array
- `sendMessage()` function
- `isLoading` state
- `clearChat()` function

**Usage**: Import `useChatContext()` hook in any component to access chat state and call `sendMessage()` to interact with the chatbot.

### Sensor Context (`src/components/data/sensor-context.tsx`)
**Purpose**: Real-time sensor data management using React Context API

**Provides**:
- Latest sensor readings
- `refreshData()` function
- Auto-polling every 5 seconds

**Usage**: Import `useSensorContext()` hook to access current sensor data like heart rate, blood pressure, temperature, etc.

---

## 🔧 Key Features & Logic

### 1. Real-Time Data Polling
**Location**: `src/components/data/sensor-context.tsx`

**Implementation**: Uses `useEffect` with `setInterval` to call `fetchSensorData()` every 5 seconds. Cleans up interval on component unmount.

**Purpose**: Keeps dashboard data fresh without manual refresh

### 2. Protected Routes
**Location**: `src/app/(radar)/layout.tsx`

**Logic**:
- Every page inside `(radar)` folder is protected
- Layout checks authentication before rendering
- Automatic redirect to `/auth/login` if not authenticated

### 3. Suspense Boundary for Search Params
**Location**: `src/app/auth/login/page.tsx`

**Problem**: `useSearchParams()` causes build errors without Suspense during static generation

**Solution**: Wrap the component that uses `useSearchParams()` in a `<Suspense>` boundary with a loading fallback. The main `LoginPage` returns the Suspense wrapper, and `LoginForm` (which uses `useSearchParams()`) is rendered inside it.

### 4. Hydration Warning Suppression
**Location**: `src/components/ui/input.tsx`, `src/components/ui/button.tsx`

**Problem**: Browser password managers inject attributes (`fdprocessedid`) causing hydration mismatches between server and client rendering

**Solution**: Add `suppressHydrationWarning` prop to input and button elements to tell React to ignore attribute differences.

---

## 🌐 Environment Variables

### Required Variables (`.env`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# GROQ API (for chatbot)
GROQ_API_KEY=your_groq_api_key_here
```

### Variable Usage

| Variable | Purpose | Access |
|----------|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key | Client & Server |
| `GROQ_API_KEY` | AI chatbot API key | Server only |

**Note**: Variables with `NEXT_PUBLIC_` prefix are exposed to the browser.

---

## 🚀 How to Add New Features

### Adding a New Protected Page

1. **Create page inside `(radar)` folder** at `src/app/(radar)/my-feature/page.tsx` with your component
2. **Add link to sidebar** in `src/components/layout/sidebar.tsx` using Link component pointing to `/my-feature`
3. **It's automatically protected** - no auth code needed! The layout handles authentication.

### Adding a New API Route

1. **Create route file** at `src/app/api/my-endpoint/route.ts`
2. **Export GET and/or POST functions** that accept Request and return `Response.json()`
3. **Call from frontend** using `fetch('/api/my-endpoint')` with appropriate method and headers

### Adding Supabase Tables

1. **Create table in Supabase dashboard** using SQL Editor with proper schema, foreign keys, and default values
2. **Enable Row Level Security** with policies to control access (e.g., users can only see their own data)
3. **Query from code** using server-side createClient(), then use `.from('table_name').select()`, `.insert()`, `.update()`, etc.

### Adding a New Context Provider

1. **Create context file** at `src/components/my-feature/my-context.tsx` with `createContext`, provider component, and custom hook
2. **Add to root providers** in `src/components/providers/provider.tsx` by wrapping children with your new provider

---

## 📊 Database Schema (Recommended)

### Users Table (Handled by Supabase Auth)
- Automatically created by Supabase
- Stores: `id`, `email`, `encrypted_password`, `user_metadata`

### Sensor Readings Table (You should create)
**Columns**: 
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `heart_rate` (INTEGER)
- `blood_pressure_systolic` (INTEGER)
- `blood_pressure_diastolic` (INTEGER)
- `temperature` (DECIMAL)
- `oxygen_level` (INTEGER)
- `respiratory_rate` (INTEGER)
- `created_at` (TIMESTAMP)

### Patient History Table
**Columns**:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `diagnosis` (TEXT)
- `treatment` (TEXT)
- `doctor_notes` (TEXT)
- `visit_date` (DATE)
- `created_at` (TIMESTAMP)

### Appointments Table
**Columns**:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `doctor_name` (TEXT)
- `appointment_date` (TIMESTAMP)
- `reason` (TEXT)
- `status` (TEXT) - values: 'scheduled', 'completed', 'cancelled'
- `created_at` (TIMESTAMP)

---

## 🛠️ Development Commands

**Install dependencies**: `pnpm install`

**Run development server**: `npm run dev` (Server runs on http://localhost:3000)

**Build for production**: `npm run build`

**Start production server**: `npm start`

**Type checking**: `npx tsc --noEmit`

**Lint code**: `npx eslint .`

---

## 🐛 Common Issues & Solutions

### Issue: "Email not confirmed" error on login

**Solution**:
1. Go to Supabase dashboard
2. Authentication → Providers → Email
3. Uncheck "Confirm email"
4. Save
5. Delete existing user and register again

### Issue: Hydration errors in browser console

**Solution**: Already fixed! `suppressHydrationWarning` added to Input and Button components.

### Issue: Build fails with "useSearchParams() should be wrapped in suspense"

**Solution**: Already fixed! Login page wrapped in `<Suspense>` boundary.

### Issue: TypeScript errors about missing Prisma files

**Solution**: Already removed! All Prisma code deleted, using only Supabase now.

---

## 📈 Performance Optimizations

### 1. Server Components by Default
- Most pages are Server Components (no `"use client"`)
- Reduces JavaScript bundle size
- Faster initial page load

### 2. Route Groups
- `(radar)` folder groups protected routes without URL path
- Shared layout loads once, not per page

### 3. Turbopack Dev Server
- Faster hot module replacement
- Quicker builds in development

### 4. Static Pre-rendering
- Login and register pages are static
- Built at compile time, served instantly

---

## 🔒 Security Best Practices

### 1. Row Level Security (RLS)
Always enable RLS on Supabase tables using `ALTER TABLE your_table ENABLE ROW LEVEL SECURITY` and create policies to restrict access.

### 2. API Keys
- Never commit `.env` to git
- Use `NEXT_PUBLIC_` only for public keys
- Keep sensitive keys (GROQ_API_KEY) server-side only

### 3. Input Validation
Always validate user input on both client and server side. Check for required fields, email format, password strength, etc.

### 4. Server-Side Auth Checks
Never trust client-side auth alone. Always verify authentication on the server using `supabase.auth.getUser()` before returning sensitive data or performing operations.

---

## 🚧 Future Improvements

### Recommended Enhancements

1. **Real-Time Subscriptions**: Use Supabase real-time subscriptions to listen for database changes and update UI automatically when new sensor data is inserted.

2. **User Profiles**: Add profile page where users can update name, photo, and preferences. Store additional data in `user_metadata` or create a separate profiles table.

3. **Email Notifications**: Send appointment reminders and alerts for abnormal vitals using Supabase email templates or third-party services like SendGrid.

4. **Data Visualization**: Add interactive charts using libraries like Recharts to show vital sign trends over time and compare historical data.

5. **Mobile Responsive**: Improve mobile experience with drawer-style sidebar, touch-friendly buttons, and better small screen layouts.

6. **Testing**: Add Jest for unit tests, Playwright for end-to-end tests, and test critical authentication flows.

7. **Error Boundaries**: Implement React error boundaries to catch errors gracefully, show user-friendly messages, and log errors to monitoring services.

---

## 📝 Code Style Guidelines

### TypeScript Best Practices
- Use explicit interface types instead of `any`
- Define proper interfaces for props and data structures
- Leverage TypeScript's type checking for safer code

### Component Naming
- Use PascalCase for components (e.g., `DashboardPage`)
- Use camelCase for functions (e.g., `fetchUserData`)
- Be descriptive and consistent with naming

### File Organization
- Order imports before types, then component definition, then exports
- Group related imports together
- Keep components focused on single responsibility

---

## 🆘 Support & Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn)
- [Supabase YouTube](https://www.youtube.com/@Supabase)
- [React Docs](https://react.dev)

---

## 📄 License

This project is for educational purposes. Modify and extend as needed for your Docathon project!

---

**Last Updated**: February 9, 2026  
**Version**: 1.0.0  
**Author**: RADAR Development Team
