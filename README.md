# VivahaLuxe

VivahaLuxe is a next-generation, premium autonomous AI wedding invitation platform. It allows users to quickly convert traditional wedding cards into digital, dynamic, and thematic web experiences with comprehensive guest tracking, WhatsApp automation, and cloud media integrations.

## 🚀 Key Features & Functions

### 1. 🤖 AI Card Scanner (Google Gemini Pro)
Upload a photo of a physical wedding card, and the platform utilizes `@google/generative-ai` to automatically extract the Bride's name, Groom's name, venues, dates, and event timelines to instantly populate a digital invitation template.

### 2. 🎨 Premium Theming Engine & Custom Fonts
Offers over 18+ custom royal fonts and 12 distinct luxury themes (e.g., Alabaster, Velvet, Emerald, Rose, Mysore, Banarasi) to match the cultural and aesthetic vibe of any wedding. Includes options for both Image and Video background covers.

### 3. 💬 OpenWA WhatsApp Integration
VivahaLuxe features a deeply integrated WhatsApp Engine powered by OpenWA (WAHA):
* **Session Management**: Each user can connect their own WhatsApp session directly within the dashboard.
* **Automated Invites**: Send digital invitations, map links, and customized messages directly to guest contacts.
* **Webhooks & Tracking**: Real-time delivery tracking (Sent, Delivered, Read, Failed) mapped directly to the `WhatsappLog` Prisma table using WAHA message IDs.
* **Contact Syncing**: Read and sync contacts to easily broadcast invites to selected groups.

### 4. 💌 RSVP & Guest Management
Guests can digitally RSVP specifying attendance, guest count, event-specific attendance (e.g., Haldi, Reception), and dietary restrictions. The platform aggregates this data on the admin dashboard for seamless event planning.

### 5. 💳 Razorpay Payment Gateway (PRO Plans)
Monetization is handled seamlessly through the Razorpay integration. Users can upgrade to "PRO" plans to unlock custom slugs (e.g., `vivahaluxe.com/invite/arjun-weds-sneha`), remove branding, and enable advanced WhatsApp sending features. 

### 6. 🔒 Authentication & Role-Based Access
* **Credentials & OAuth**: Supports standard email/OTP login as well as Google OAuth via `google-auth-library`.
* **Security**: Uses `bcryptjs` for secure password hashing and `jose` for robust JWT session management.
* **Roles**: Segregates capabilities between `USER` and `SUPER_ADMIN`.

### 7. 👑 Super Admin Dashboard
A robust internal tool to govern the platform:
* **System Metrics**: Track transactions, active users, and system-wide page views.
* **Global Broadcasts**: Update a real-time global alert banner pushed instantly to all active clients.
* **Maintenance Mode**: Toggle platform maintenance windows on/off with database-driven state (`SystemConfig` model).
* **System Diagnostics**: Built-in monitoring for email logs and backend system errors (`SystemError` model).

### 8. ☁️ S3 Cloud Media & Uploads
Integrates with AWS S3 (`@aws-sdk/client-s3`) to handle secure uploads for hero background images, gallery photos, and custom background music tracks.

### 9. 🗄️ Multi-Adapter Prisma ORM
Designed with flexibility in mind, the backend leverages Prisma 7.x with Edge adapters. It natively supports **PostgreSQL** (`@prisma/adapter-pg` via Aiven/Neon), but includes configurations for **LibSQL/Turso** and **Better-SQLite3**.

### 10. 📧 Email Delivery system
Integrates with `nodemailer` to dispatch Welcome emails, RSVP confirmations, and password reset OTPs.

## 🛠️ Tech Stack
* **Frontend**: Next.js 14+ (App Router), React 19, TailwindCSS v4, Lucide React, Framer Motion
* **Backend**: Next.js API Routes, Prisma ORM, Node.js
* **Database**: PostgreSQL (Aiven)
* **Integrations**: Razorpay, AWS S3, NodeMailer, OpenWA, Google Generative AI

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Configure your `.env.local` with your PostgreSQL `DATABASE_URL`, Razorpay Keys, AWS S3 Keys, and WhatsApp API endpoints.
3. **Database Sync**:
   ```bash
   npm run db:push
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start using the platform!
