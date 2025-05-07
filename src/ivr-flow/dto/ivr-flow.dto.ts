import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FonaBotIVRNodeDto {
  @IsString()
  node_client_id: string;

  @IsString()
  type: string;

  @IsNumber()
  position_x: number;

  @IsNumber()
  position_y: number;

  @IsOptional()
  properties: Record<string, any>;
}

export class FonaBotIVREdgeDto {
  @IsString()
  edge_client_id: string;

  @IsString()
  source_node_client_id: string;

  @IsString()
  target_node_client_id: string;

  @IsString()
  @IsOptional()
  source_handle?: string;

  @IsString()
  @IsOptional()
  target_handle?: string;

  @IsOptional()
  properties: Record<string, any>;
}

export class CreateFonaBotIvrFlowDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  trigger_phone_number?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FonaBotIVRNodeDto)
  nodes: FonaBotIVRNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FonaBotIVREdgeDto)
  edges: FonaBotIVREdgeDto[];
}

export class UpdateFonaBotIvrFlowDto extends CreateFonaBotIvrFlowDto {
  @IsOptional()
  name: string;
}

export class FonaBotIvrFlowResponseDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  trigger_phone_number?: string;
  nodes: FonaBotIVRNodeDto[];
  edges: FonaBotIVREdgeDto[];
  created_at: Date;
  updated_at: Date;
}