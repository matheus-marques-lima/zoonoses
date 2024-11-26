import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Checking user's email

    const oldUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (oldUser)
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);

    // Encrypting user's password

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    // Saving user's data

    const newUser = await this.userRepository.save(user);

    delete newUser.password;

    return newUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneBy(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({ id }, { ...updateUserDto });
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.userRepository.delete({ id });
  }
}
