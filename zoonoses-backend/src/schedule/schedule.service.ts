import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly usersService: UsersService,
    private readonly petsService: PetsService,
  ) {}

  async create(userId: number, createScheduleDto: CreateScheduleDto) {
    const user = await this.usersService.findOne(userId);
    const pet = await this.petsService.findOne(userId, createScheduleDto.petId);

    if (!pet || user.id !== pet.user.id) {
      throw new UnauthorizedException();
    }

    const schedule = this.scheduleRepository.create(createScheduleDto);

    schedule.user = user;
    schedule.pet = pet;

    return this.scheduleRepository.save(schedule);
  }

  async findAll(userId: number, petId?: number) {
    let where = {};

    if (!petId) {
      const user = await this.usersService.findOne(userId);

      if (!user.roles.includes('admin')) {
        throw new UnauthorizedException();
      }
    } else {
      const pet = await this.petsService.findOne(userId, petId);
      where = { pet: { id: pet.id } };
    }

    return this.scheduleRepository.find({ relations: ['user', 'pet'], where });
  }

  async findOne(userId: number, id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['user', 'pet'],
    });

    if (schedule?.user?.id === userId) {
      return schedule;
    }

    const user = await this.usersService.findOne(userId);

    if (!user.roles.includes('admin')) {
      throw new UnauthorizedException();
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    await this.scheduleRepository.update(id, { ...updateScheduleDto });
    return this.scheduleRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.scheduleRepository.delete(id);
  }
}
