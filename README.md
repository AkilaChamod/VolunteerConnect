# VolunteerConnect

VolunteerConnect is a web-based Community Volunteer Board prototype developed for the Startup Studio final project.

The application connects university students with local charities. Charity users can create volunteering opportunities, while students can browse available opportunities and register for suitable volunteer shifts.

The prototype deliberately follows the assessment scope limit of:

- **Maximum 3 core screens**
- **Maximum 3 database entities**

---

## 1. Problem

Local charities often need a simple way to advertise upcoming volunteering opportunities.

At the same time, university students need an easy way to discover opportunities, view event details and register for available shifts.

VolunteerConnect addresses this problem through two user roles:

### Student

Students can:

- Create an account
- Log in
- Browse upcoming volunteer opportunities
- View event details
- Register for volunteer shifts

### Charity

Charity users can:

- Create an account
- Log in
- Create volunteer events
- View their existing events
- View student registrations for their own events

The objective is not to build a large-scale social platform. The goal is to provide a small, secure and functional prototype that solves the core Community Volunteer Board problem.

---

## 2. Scope

### Core screens

The system uses exactly three core screens:

1. **Authentication**
   - Login
   - Registration

2. **Dashboard**
   - Student opportunity browsing
   - Charity event management

3. **Event Details**
   - Event information
   - Student registration
   - Charity registration view

### Database entities

The application uses exactly three database entities:

1. `users`
2. `events`
3. `registrations`

No additional database entities are required for the prototype.

---

## 3. Technology Stack

VolunteerConnect uses the following technologies:

- Node.js
- Express.js
- EJS
- SQLite
- `better-sqlite3`
- `express-session`
- `bcryptjs`
- `helmet`
- `express-validator`
- Jest
- Supertest
- Git
- GitHub

---

## 4. System Architecture

VolunteerConnect follows a lightweight MVC-style architecture.

```text
Browser / EJS Views
        |
        | HTTP Requests
        v
Express Routes
        |
        v
Controllers
        |
        v
Models
        |
        v
SQLite Database