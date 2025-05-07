import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IvrFlowService } from './ivr-flow.service';
import { CreateFonaBotIvrFlowDto, UpdateFonaBotIvrFlowDto } from './dto/ivr-flow.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('ivr-flows')
@UseGuards(JwtAuthGuard)
export class IvrFlowController {
  constructor(private readonly ivrFlowService: IvrFlowService) {}

  @Post()
  create(@Body() createDto: CreateFonaBotIvrFlowDto, @GetUser() userId: string) {
    return this.ivrFlowService.create(createDto, userId);
  }

  @Get()
  findAll(@GetUser() userId: string) {
    return this.ivrFlowService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() userId: string) {
    return this.ivrFlowService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFonaBotIvrFlowDto,
    @GetUser() userId: string,
  ) {
    return this.ivrFlowService.update(id, updateDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() userId: string) {
    return this.ivrFlowService.remove(id, userId);
  }
}