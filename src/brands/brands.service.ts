import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>
  ){}

  create(createBrandDto: CreateBrandDto) {
    try {
      const brand = this.brandRepository.create(createBrandDto); 
      return this.brandRepository.save(brand);
    } catch (error) {
      throw new InternalServerErrorException('error creating brand');
    }

  }

  findAll() {
    return this.brandRepository.find();
  }

  async findOne(id: string) {
        let brand: Brand | null = await this.brandRepository.findOneBy({id});

        if(brand === null)
            throw new NotFoundException(`brand with id ${id} not found`);
        return brand;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
