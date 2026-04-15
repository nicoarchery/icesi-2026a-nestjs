import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Car } from "src/cars/entities/car.entity";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column('varchar', {unique: true})
    name: string;

    @Column('varchar', {unique: true})
    slug: string;

    @OneToMany(()=> Car, (car)=>car.brand)
    cars: Car[];

    @BeforeInsert()
    checkSlug(): void {
        if(!this.slug)
            this.slug  = this.name; 
        this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll('"',"");
    }
    
}
