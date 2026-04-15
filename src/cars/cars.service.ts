import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './entities/car.entity';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandsService } from 'src/brands/brands.service';

@Injectable()
export class CarsService {

    constructor(
        @InjectRepository(Car) private readonly carRepository: Repository<Car>,
        private readonly brandService: BrandsService,
    ){}
    
    getAll(): Promise<Car[]> {
        return this.carRepository.find();
    }

    async getById(id: string): Promise<Car>{
        let car: Car | null = await this.carRepository.findOneBy({id});

        if(car == null)
            throw new NotFoundException(`car with id ${id} not found`);
        return car;
    }

    async create(car: CreateCarDto): Promise<Car>{
        const  brand  = await this.brandService.findOne(car.brand);
        const carNew: Car =  this.carRepository.create(car); 
        return this.carRepository.save(carNew);
    }

    async update(id: string, car: UpdateCarDto): Promise<Car>{
        let result = await  this.carRepository.update(id, car);
        if (result.affected && result.affected < 1)
            throw new NotFoundException(`car with id ${id} not found`);

        return this.getById(id); 
    }

    async delete(id: string): Promise<Car[]>{
        await this.getById(id);
        let result = await this.carRepository.delete(id);

        if (result.affected && result.affected < 1)
            throw new NotFoundException(`car with id ${id} not found`);

        return this.getAll();
        
    }



}
