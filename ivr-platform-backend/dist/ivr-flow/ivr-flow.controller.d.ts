import { IvrFlowService } from './ivr-flow.service';
import { CreateFonaBotIvrFlowDto, UpdateFonaBotIvrFlowDto } from './dto/ivr-flow.dto';
export declare class IvrFlowController {
    private readonly ivrFlowService;
    constructor(ivrFlowService: IvrFlowService);
    create(createDto: CreateFonaBotIvrFlowDto, userId: string): Promise<import("../entities/ivr-flow.entity").IvrFlow>;
    findAll(userId: string): Promise<import("../entities/ivr-flow.entity").IvrFlow[]>;
    findOne(id: string, userId: string): Promise<import("../entities/ivr-flow.entity").IvrFlow>;
    update(id: string, updateDto: UpdateFonaBotIvrFlowDto, userId: string): Promise<import("../entities/ivr-flow.entity").IvrFlow>;
    remove(id: string, userId: string): Promise<void>;
}
