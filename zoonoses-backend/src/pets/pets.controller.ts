import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UserId } from '../auth/decorators/user.decorator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@UserId() user: number, @Body() createPetDto: CreatePetDto) {
    return this.petsService.create(user, createPetDto);
  }

  @Get()
  findAll(@UserId() user: number, @Query('me') me: string) {
    return this.petsService.findAll(user, me === 'true');
  }

  @Get(':id')
  findOne(@UserId() user: number, @Param('id', ParseIntPipe) pet: number) {
    return this.petsService.findOne(user, pet);
  }

  @Patch(':id')
  update(
    @UserId() user: number,
    @Param('id', ParseIntPipe) pet: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petsService.update(user, pet, updatePetDto);
  }

  @Delete(':id')
  async remove(@UserId() user: number, @Param('id', ParseIntPipe) pet: number) {
    await this.petsService.remove(user, pet);
  }
}
