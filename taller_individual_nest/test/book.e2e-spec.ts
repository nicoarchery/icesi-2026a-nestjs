import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';


/**
 * BookController (e2e)
 * for create a token, create a user and login and put the token in the Authorization header
 */

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let createdBookId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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

  it('/book (POST) → should create a new book', async () => {
    const createBookDto = {
      title: 'El Principito',
      author: 'Antoine de Saint-Exupéry',
      price: 25,
      isSold: false,
    };

    const response = await request(app.getHttpServer())
      .post('/book')
      .set('Authorization', `Bearer ${token}`)
      .send(createBookDto)
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'El Principito',
      author: 'Antoine de Saint-Exupéry',
      isSold: false,
    });

    createdBookId = response.body.id;
    expect(createdBookId).toBeDefined();
  });

  it('/book (POST) → should failed to create a book', async () => {
    const createBookDto = {
      title: 'Invalid Book',
      author: 'Invalid Author',
      price: -10,
      isSold: false,
    };

    const response = await request(app.getHttpServer())
      .post('/book')
      .set('Authorization', `Bearer ${token}`)
      .send(createBookDto)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  it('/book (GET) → should return all books', async () => {
    const response = await request(app.getHttpServer())
      .get('/book')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/book/:id (GET) → should return one book by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/book/${createdBookId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdBookId);
  });

  it('/book/:id (GET) → should fail to return one book by ID inexistent ', async () => {
    const response = await request(app.getHttpServer())
      .get(`/book/invalid-id`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body).toHaveProperty('message');
  });

  it('/book/author/:author (GET) → should return books by author', async () => {
    const response = await request(app.getHttpServer())
      .get('/book/author/Antoine de Saint-Exupéry')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].author).toBe('Antoine de Saint-Exupéry');
  });

  it('/book/status/available (GET) → should return available books', async () => {
    const response = await request(app.getHttpServer())
      .get('/book/status/available')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((b) => b.isSold === false)).toBe(true);
  });

  it('/book/:id (PATCH) → should update book', async () => {
    const updateDto = { price: 30 };
    const response = await request(app.getHttpServer())
      .patch(`/book/${createdBookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateDto)
      .expect(200);

    expect(response.body.price).toBe(30);
  });

  it('/book/:id (DELETE) → should delete book', async () => {
    await request(app.getHttpServer())
      .delete(`/book/${createdBookId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/book/${createdBookId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
