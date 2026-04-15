import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "src/brands/entities/brand.entity";

@Entity()
export class Car {
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ManyToOne(()=>Brand, (brand)=>brand.cars)
    brand: string;

    @Column('varchar', {unique: true})
    model: string;

    @Column('int')
    year: number;

}