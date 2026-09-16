// ============================================
// INTEGRATION TESTS
// Ye tests check karte hain ki frontend jo requests backend ko
// bhejta hai, unpar backend sahi response deta hai ya nahi —
// yaani frontend-backend components ka interaction sahi hai ya nahi.
// ============================================

const request = require('supertest');
const app = require('../backend/app');

// Har test ke baad data reset karo, taaki tests ek dusre ko affect na karein
afterEach(() => {
  app.resetTodos();
});

describe('Todo API - Integration Tests', () => {

  // ---------- POSITIVE / HAPPY PATH CASES ----------

  test('GET /api/todos -> shuru mein empty list return kare', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/todos -> naya todo successfully add ho', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Assignment complete karo' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Assignment complete karo');
    expect(res.body.completed).toBe(false);
  });

  test('POST ke baad GET call same todo dikhaye (frontend-backend sync check)', async () => {
    // Ye asli integration test hai — do alag endpoints ke beech
    // data ka flow check ho raha hai (jaise frontend add karega, fir list fetch karega)
    await request(app).post('/api/todos').send({ title: 'Test task' });

    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Test task');
  });

  test('PUT /api/todos/:id -> todo complete mark ho jaye', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Mark me done' });
    const id = createRes.body.id;

    const updateRes = await request(app).put(`/api/todos/${id}`);
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.completed).toBe(true);
  });

  test('DELETE /api/todos/:id -> todo list se hat jaye', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Delete me' });
    const id = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/todos/${id}`);
    expect(deleteRes.statusCode).toBe(204);

    const getRes = await request(app).get('/api/todos');
    expect(getRes.body.length).toBe(0);
  });

  // ---------- NEGATIVE / EDGE CASES ----------

  test('POST /api/todos -> empty title pe error return kare', async () => {
    const res = await request(app).post('/api/todos').send({ title: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/todos -> title missing hone pe error return kare', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('PUT /api/todos/:id -> non-existent id pe 404 aaye', async () => {
    const res = await request(app).put('/api/todos/999');
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/todos/:id -> non-existent id pe 404 aaye', async () => {
    const res = await request(app).delete('/api/todos/999');
    expect(res.statusCode).toBe(404);
  });

  // ---------- MULTI-STEP WORKFLOW TEST (real frontend jaisa flow) ----------

  test('Full workflow: add -> complete -> delete (jaisa frontend karega)', async () => {
    // 1. Add
    const addRes = await request(app).post('/api/todos').send({ title: 'Workflow task' });
    const id = addRes.body.id;
    expect(addRes.statusCode).toBe(201);

    // 2. Complete
    const completeRes = await request(app).put(`/api/todos/${id}`);
    expect(completeRes.body.completed).toBe(true);

    // 3. Delete
    const deleteRes = await request(app).delete(`/api/todos/${id}`);
    expect(deleteRes.statusCode).toBe(204);

    // 4. Confirm list empty
    const finalRes = await request(app).get('/api/todos');
    expect(finalRes.body.length).toBe(0);
  });

});
