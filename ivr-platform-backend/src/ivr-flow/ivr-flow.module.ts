import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IvrFlowController } from './ivr-flow.controller';
import { IvrFlowService } from './ivr-flow.service';
import { IvrFlow } from '../entities/ivr-flow.entity';
import { IvrFlowNode } from '../entities/ivr-flow-node.entity';
import { IvrFlowEdge } from '../entities/ivr-flow-edge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IvrFlow, IvrFlowNode, IvrFlowEdge])],
  controllers: [IvrFlowController],
  providers: [IvrFlowService],
  exports: [IvrFlowService],
})
export class IvrFlowModule {}