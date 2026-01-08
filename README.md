# Cal.com Clone

A simplified Cal.com-style scheduling application built with **Next.js (App Router)**, **Prisma**, and **PostgreSQL**.  
The app allows users to create event types, define availability, share public booking links, accept bookings, and manage them via a dashboard.

## 🔗 Live Demo

👉 https://cal-clone-nu.vercel.app/

---

## ✨ Features

- Create and manage **event types** with custom durations
- Define **weekly availability**
- Public **booking page** (`/username/event-slug`)
- Calendar-based date & time slot selection
- Booking confirmation flow
- Prevents **double booking per event**
- **Bookings dashboard** with:
  - Upcoming bookings
  - Past bookings
  - Cancelled bookings
- Cancel bookings and update status
- Clean Cal.com-inspired UI

---

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/cal-clone.git
cd cal-clone

````

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Example (local Postgres):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cal_clone"
```

---

### 4️⃣ Setup the database

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

---

### 5️⃣ Run the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## 🧭 App Routes Overview

* `/` → Home
* `/event-types` → Manage event types
* `/availability` → Set weekly availability
* `/dashboard/bookings` → Bookings dashboard
* `/:username/:eventSlug` → Public booking page

---

## 📌 Assumptions

* Single-user system (no authentication)
* One availability configuration per user (to be extended to have multiple configurations)
* All bookings are timezone-aware via stored timezone
* Focus is on correctness and clarity over advanced edge cases

---

## 🚧 Current Status

* Core functionality complete
* UI closely inspired by Cal.com
* Project structured for easy future enhancements

