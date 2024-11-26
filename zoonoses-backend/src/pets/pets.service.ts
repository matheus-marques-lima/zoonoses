import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createPetDto: CreatePetDto) {
    const user = await this.usersService.findOne(userId);
    const pet = this.petsRepository.create(createPetDto);

    pet.user = user;

    return this.petsRepository.save(pet);
  }

  async findAll(userId: number, me?: boolean) {
    let where = {};

    if (!me) {
      const user = await this.usersService.findOne(userId);

      if (!user.roles.includes('admin')) {
        throw new UnauthorizedException();
      }
    } else {
      where = { user: { id: userId } };
    }

    return this.petsRepository.find({ relations: ['user'], where });
  }

  async findOne(userId: number, id: number) {
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (pet?.user?.id === userId) {
      return pet;
    }

    const user = await this.usersService.findOne(userId);

    if (!user.roles.includes('admin')) {
      throw new UnauthorizedException();
    }

    return pet;
  }

  async update(userId: number, id: number, updatePetDto: UpdatePetDto) {
    const pet = await this.petsRepository.findOne({
      relations: ['user'],
      where: { id },
    });

    const user = await this.usersService.findOne(userId);

    if (!user.roles.includes('admin') && pet?.user?.id !== userId) {
      throw new UnauthorizedException();
    }

    await this.petsRepository.update({ id }, { ...updatePetDto });

    return this.petsRepository.findOneBy({ id });
  }

  async remove(userId: number, id: number) {
    const pet = await this.petsRepository.findOne({
      relations: ['user'],
      where: { id },
    });

    const user = await this.usersService.findOne(userId);

    if (!user.roles.includes('admin') && pet?.user?.id !== userId) {
      throw new UnauthorizedException();
    }

    await this.petsRepository.delete({ id });
  }
}
