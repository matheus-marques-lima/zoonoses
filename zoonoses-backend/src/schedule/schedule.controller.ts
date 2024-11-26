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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UserId } from '../auth/decorators/user.decorator';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@UserId() user: number, @Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(user, createScheduleDto);
  }

  @Get()
  findAll(@UserId() user: number, @Query('pet') pet: string) {
    return this.scheduleService.findAll(user, pet ? parseInt(pet) : undefined);
  }

  @Get(':id')
  findOne(@UserId() user: number, @Param('id', ParseIntPipe) schedule: number) {
    return this.scheduleService.findOne(user, schedule);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.remove(id);
  }
}
