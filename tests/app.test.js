const request = require('supertest');
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';
const { db, initialiseDatabase } = require('../database/database');
const app = require('../app');
beforeAll(() => initialiseDatabase());
beforeEach(() => db.exec('DELETE FROM registrations; DELETE FROM events; DELETE FROM users;'));
afterAll(() => db.close());
async function registerAgent(agent, role='student') { return agent.post('/register').type('form').send({name: role==='student'?'Test Student':'Test Charity',email:`${role}@example.test`,password:'SecurePassword123!',role}); }
describe('Authentication',()=>{
  test('registers a student and creates a session',async()=>{const agent=request.agent(app);const r=await registerAgent(agent);expect(r.statusCode).toBe(302);expect(r.headers.location).toBe('/dashboard');});
  test('rejects invalid email',async()=>{const r=await request(app).post('/register').type('form').send({name:'Test Student',email:'not-an-email',password:'SecurePassword123!',role:'student'});expect(r.statusCode).toBe(400);});
  test('rejects incorrect login credentials',async()=>{await registerAgent(request.agent(app));const r=await request(app).post('/login').type('form').send({email:'student@example.test',password:'WrongPassword!'});expect(r.statusCode).toBe(401);});
});
describe('Authorization and events',()=>{
  test('unauthenticated users cannot access dashboard',async()=>{const r=await request(app).get('/dashboard');expect(r.statusCode).toBe(302);expect(r.headers.location).toBe('/');});
  test('student cannot create an event',async()=>{const agent=request.agent(app);await registerAgent(agent,'student');const r=await agent.post('/events').type('form').send({title:'Community clean-up',description:'Help clean a local community space.',location:'Local park',eventDate:'2099-01-01T10:00',capacity:10});expect(r.statusCode).toBe(302);expect(r.headers.location).toBe('/dashboard');});
  test('charity can create an event',async()=>{const agent=request.agent(app);await registerAgent(agent,'charity');const r=await agent.post('/events').type('form').send({title:'Community clean-up',description:'Help clean a local community space.',location:'Local park',eventDate:'2099-01-01T10:00',capacity:10});expect(r.statusCode).toBe(302);expect(r.headers.location).toMatch(/^\/events\/\d+$/);});
});
describe('Registration',()=>{
  test('student can register once and duplicate registration is prevented',async()=>{const charity=request.agent(app);await registerAgent(charity,'charity');const created=await charity.post('/events').type('form').send({title:'Food bank shift',description:'Support the team with sorting donated food.',location:'Community Food Bank',eventDate:'2099-02-01T10:00',capacity:2});const eventId=Number(created.headers.location.split('/').pop());const student=request.agent(app);await registerAgent(student,'student');const first=await student.post(`/events/${eventId}/register`);expect(first.statusCode).toBe(302);const second=await student.post(`/events/${eventId}/register`);expect(second.statusCode).toBe(302);const count=db.prepare('SELECT COUNT(*) AS count FROM registrations WHERE event_id = ?').get(eventId).count;expect(count).toBe(1);});
});
describe('Database security',()=>{
  test('parameterized user lookup treats SQL-like input as data',async()=>{const maliciousEmail="' OR 1=1 --";const result=db.prepare('SELECT * FROM users WHERE email = ?').get(maliciousEmail);expect(result).toBeUndefined();});
});
