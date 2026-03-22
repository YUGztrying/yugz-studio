---

## **YECARS**

[https://yecars.vercel.app/](https://yecars.vercel.app/) 

A **Next.js 15 \+ Supabase** web app for a **mobile car wash service** based in **Abidjan, Côte d'Ivoire**.

### **What It Does**

Clients can book a professional car wash that comes to their location, choosing between:

* **One-time reservations** — pick a service, date, time, and location  
* **Monthly subscriptions** — recurring plans with multiple washes per month

### **Key Pages**

| Route | Purpose |
| ----- | ----- |
| `/` | Homepage / landing |
| `/reservation` | Book a one-time wash |
| `/abonnements` | Browse subscription plans |
| `/souscription-abonnement` | Subscribe to a plan |
| `/mes-reservations` | Client's booking history |
| `/mes-abonnements` | Client's active subscriptions |
| `/admin` | Admin dashboard |

### **Tech Stack**

* **Frontend**: Next.js 15 (App Router), Tailwind CSS, Radix UI  
* **Backend**: Supabase (PostgreSQL \+ Auth \+ RLS)  
* **Auth**: Supabase Auth (email/password)  
* **Deployment**: Vercel

### **Admin Features**

* Unified dashboard with revenue from both reservations and subscriptions  
* Deduplicated client count across both services  
* Reservation management with status tracking

