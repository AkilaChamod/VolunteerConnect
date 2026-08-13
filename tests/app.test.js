const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';

const {
  db,
  initialiseDatabase
} = require('../database/database');

const app = require('../app');

beforeAll(() => {
  initialiseDatabase();
});

beforeEach(() => {
  db.exec(`
    DELETE FROM registrations;
    DELETE FROM events;
    DELETE FROM users;
  `);
});

afterAll(() => {
  db.close();
});

async function registerAgent(agent, role = 'student') {
  return agent
    .post('/register')
    .type('form')
    .send({
      name:
        role === 'student'
          ? 'Test Student'
          : 'Test Charity',
      email: `${role}@example.test`,
      password: 'SecurePassword123!',
      role
    });
}

/* =========================================================
   AUTHENTICATION TESTS
   ========================================================= */

describe('Authentication', () => {
  test('registers a student and creates a session', async () => {
    const agent = request.agent(app);

    const response = await registerAgent(agent);

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/dashboard');
  });

  test('rejects invalid email', async () => {
    const response = await request(app)
      .post('/register')
      .type('form')
      .send({
        name: 'Test Student',
        email: 'not-an-email',
        password: 'SecurePassword123!',
        role: 'student'
      });

    expect(response.statusCode).toBe(400);
  });

  test('rejects incorrect login credentials', async () => {
    const registrationAgent = request.agent(app);

    await registerAgent(registrationAgent);

    const response = await request(app)
      .post('/login')
      .type('form')
      .send({
        email: 'student@example.test',
        password: 'WrongPassword!'
      });

    expect(response.statusCode).toBe(401);
  });
});

/* =========================================================
   DASHBOARD REGRESSION TESTS
   ========================================================= */

describe('Dashboard', () => {
  test(
    'authenticated student can access dashboard without redirect loop',
    async () => {
      const agent = request.agent(app);

      await registerAgent(agent, 'student');

      const response = await agent.get('/dashboard');

      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('VolunteerConnect');
      expect(response.text).toContain('Student dashboard');
    }
  );

  test(
    'authenticated charity can access dashboard without redirect loop',
    async () => {
      const agent = request.agent(app);

      await registerAgent(agent, 'charity');

      const response = await agent.get('/dashboard');

      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('VolunteerConnect');
      expect(response.text).toContain('Charity dashboard');
    }
  );
});

/* =========================================================
   AUTHORIZATION AND EVENT TESTS
   ========================================================= */

describe('Authorization and events', () => {
  test('unauthenticated users cannot access dashboard', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  test('student cannot create an event', async () => {
    const agent = request.agent(app);

    await registerAgent(agent, 'student');

    const response = await agent
      .post('/events')
      .type('form')
      .send({
        title: 'Community clean-up',
        description: 'Help clean a local community space.',
        location: 'Local park',
        eventDate: '2099-01-01T10:00',
        capacity: 10
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/dashboard');
  });

  test('charity can create an event', async () => {
    const agent = request.agent(app);

    await registerAgent(agent, 'charity');

    const response = await agent
      .post('/events')
      .type('form')
      .send({
        title: 'Community clean-up',
        description: 'Help clean a local community space.',
        location: 'Local park',
        eventDate: '2099-01-01T10:00',
        capacity: 10
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toMatch(/^\/events\/\d+$/);
  });
});

/* =========================================================
   VOLUNTEER REGISTRATION TESTS
   ========================================================= */

describe('Registration', () => {
  test(
    'student can register once and duplicate registration is prevented',
    async () => {
      const charity = request.agent(app);

      await registerAgent(charity, 'charity');

      const created = await charity
        .post('/events')
        .type('form')
        .send({
          title: 'Food bank shift',
          description: 'Support the team with sorting donated food.',
          location: 'Community Food Bank',
          eventDate: '2099-02-01T10:00',
          capacity: 2
        });

      const eventId = Number(
        created.headers.location
          .split('/')
          .pop()
      );

      const student = request.agent(app);

      await registerAgent(student, 'student');

      const first = await student.post(
        `/events/${eventId}/register`
      );

      expect(first.statusCode).toBe(302);

      const second = await student.post(
        `/events/${eventId}/register`
      );

      expect(second.statusCode).toBe(302);

      const result = db.prepare(`
        SELECT COUNT(*) AS count
        FROM registrations
        WHERE event_id = ?
      `).get(eventId);

      expect(result.count).toBe(1);
    }
  );
});

/* =========================================================
   SQL INJECTION SECURITY TEST
   ========================================================= */

describe('Database security', () => {
  test(
    'parameterized user lookup treats SQL-like input as data',
    () => {
      const maliciousEmail = "' OR 1=1 --";

      const result = db.prepare(`
        SELECT *
        FROM users
        WHERE email = ?
      `).get(maliciousEmail);

      expect(result).toBeUndefined();
    }
  );
});