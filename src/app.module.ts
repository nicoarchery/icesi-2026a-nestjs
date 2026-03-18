import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1', //process.env.DB_HOST, 
      port: 5432,//parseInt(process.env.DB_PORT || '5432'),
      database: 'car_dealership', //process.env.DB_NAME, 
      username: 'postgres', //process.env.DB_USERNAME, 
      password: 'postgres', //process.env.DB_PASSWORD,
      synchronize: true, 
      //entities: [], 
      autoLoadEntities: true
    }),

    CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
