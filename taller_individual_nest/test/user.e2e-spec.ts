import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * UserController (e2e)
 * for create a token, create a user and login and put the token in the Authorization header
 */

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Habilita validación global (igual que en main.ts)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();

    const loginUserDto = {
        email: 'leobusta@example.com',
        password: 'Hola123456',
      };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserDto);

     token = response.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (POST) → should create a new user', async () => {
    const createUserDto = {
      name: 'Mateo Silva',
      email: 'mateo@example.com',
      password: 'Hola123456',
    };

    const response = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(createUserDto)
      .expect(201);

    expect(response.body).toMatchObject({
      name: 'Mateo Silva',
      email: 'mateo@example.com',
    });

    createdUserId = response.body.id;
  });

  it('/user (POST) → should failed to create user (Bad Request)', () => {
    const createUserDto = {
      name: 'User',
      email: 'user@example.com',
      password: '123456',
    };

    request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(createUserDto)
      .expect(400);

  });

  it('/user (GET) → should return all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/user/:id (GET) → should return a specific user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdUserId,
      name: 'Mateo Silva',
      email: 'mateo@example.com',
    });
  });

  it('/user/email/:email (GET) → should find user by email', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/email/mateo@example.com')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      name: 'Mateo Silva',
      email: 'mateo@example.com',
    });
  });

  it('/user/:id (PATCH) → should update user info', async () => {
    const updateUserDto = { name: 'Mateo Updated' };

    const response = await request(app.getHttpServer())
      .patch(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdUserId,
      name: 'Mateo Updated',
    });
  });

  it('/user/:id (DELETE) → should delete user', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Confirma que ya no existe
    await request(app.getHttpServer())
      .get(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect("");
  });
});
