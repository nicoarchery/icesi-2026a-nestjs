import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './interfaces/car.model';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
    private cars: Car[] = [
        {
            brand: "Chevrolet", 
            model: "Spark", 
            year: 2020
        },
        {
            brand: "Toyota", 
            model: "Land Cruiser", 
            year: 2025
        },
        {
            brand: "Volvo", 
            model: "xc90", 
            year: 2022
        }
    ];
    
    getAll(): Car[] {
        return this.cars;
    }

    getById(id: number): Car{
        if(!this.cars[id])
            throw new NotFoundException(`car with id ${id} not found`);
        return this.cars[id];
    }

    create(car: CreateCarDto): Car{
        this.cars.push(car); 
        return car;
    }

    update(id: number, car: UpdateCarDto): Car{
        if(!this.cars[id])
            throw new NotFoundException(`car with id ${id} not found`);
        this.cars[id] = car as CreateCarDto; 
        return this.cars[id];
    }

    delete(id: number){
        if(!this.cars[id])
            throw new NotFoundException(`car with id ${id} not found`);

        this.cars = this.cars.filter(car=> car!=this.cars[id]);
//        if(id>0)
//            this.cars = [...this.cars.slice(0,id), ...this.cars.slice(id+1,this.cars.length)];
    }

}
