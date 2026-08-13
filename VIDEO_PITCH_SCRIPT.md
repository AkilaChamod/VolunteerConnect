# VolunteerConnect — 10-Minute Individual Video Pitch & Demo

> Important: the assessment brief says both co-founders must speak. Because this project is being completed individually, confirm with the lecturer/supervisor that the individual format is approved and ask whether a single-speaker video is accepted.

## 0:00–0:45 — Opening

Hello, my name is Akila, and this is my Startup Studio final project, VolunteerConnect.

VolunteerConnect is a Community Volunteer Board designed to connect university students with local charities. The prototype allows charities to publish volunteer opportunities and allows students to browse and register for available shifts.

The design deliberately follows the assessment scope limit of three core screens and three database entities.

## 0:45–2:00 — Problem and users

The problem is straightforward. Charities need a simple way to advertise volunteer opportunities, while students need an accessible place to discover opportunities that match their availability.

The prototype has two user roles. Students can browse upcoming events and register for them. Charity users can create events and view registrations for their own events.

The objective was not to build a large social network or complex management platform. The objective was to build a small, functional and secure prototype that solves the core problem.

## 2:00–3:15 — Architecture

The system uses Node.js and Express on the server, EJS for the user interface, and SQLite for the database.

The application follows a lightweight MVC structure. Routes receive HTTP requests, controllers implement application logic, models handle database operations, and the SQLite database stores the three entities: users, events and registrations.

The three-screen design is authentication, dashboard and event details. Keeping the scope small makes the system easier to test, secure and maintain.

## 3:15–4:30 — Security

Security was a major design responsibility because the assessment specifically requires an audit for SQL injection.

The database layer uses parameterized queries. For example, instead of concatenating an email into a SQL statement, the application uses a question-mark parameter and passes the email separately.

The application also hashes passwords with bcrypt, uses session-based authentication, validates server-side input, applies role-based authorization, uses secure cookie settings and enables common HTTP security headers through Helmet.

The automated test suite also checks SQL-like input to confirm that it is treated as data rather than executable SQL.

## 4:30–5:30 — Ethics

The application also considers social responsibility. It collects only the information required for the prototype: name, email, password hash and role.

It does not intentionally collect unnecessary location, identity or demographic information, and it does not sell volunteer data or use it for targeted advertising.

Charity users can only see registrations for their own events, while students cannot create charity events. These controls support privacy, confidentiality and fairness and are consistent with relevant ACM Code of Ethics principles.

## 5:30–6:30 — Demo: charity workflow

Now I will demonstrate the charity workflow.

First, I log in using a charity account. The charity dashboard provides the event creation form.

I enter the event title, description, location, future date and volunteer capacity, then publish the event.

The application redirects to the event details screen. The event now exists in the database and the registration count is initially zero.

## 6:30–8:00 — Demo: student workflow

Next, I log out and use a student account.

The student dashboard shows upcoming volunteer opportunities. I select the event that was just created.

The event details page displays the charity, date, location, description and available capacity.

I select Register for this event. The application creates a registration and displays a confirmation message.

If I attempt to register again, the application detects the existing registration and prevents a duplicate registration.

## 8:00–9:15 — Demo: charity registration view and code audit

I return to the charity account and open the same event. The charity can now see the registered student's details for its own event.

Finally, I will show the database code used for authentication. The query uses a parameterized placeholder rather than string concatenation. This is important because user input is treated as data rather than SQL code.

This implementation was manually reviewed as part of the mandatory AI auditing process.

## 9:15–10:00 — Conclusion

VolunteerConnect demonstrates a complete core workflow while remaining within the required scope.

The prototype addresses a real community problem, uses a clear MVC architecture, contains three database entities, provides authentication and role-based authorization, and includes an explicit SQL injection audit and social responsibility considerations.

The key engineering decision was to prioritise a small, secure and testable system rather than adding unnecessary features.

Thank you.
