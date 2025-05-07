"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonaBotIvrFlowResponseDto = exports.UpdateFonaBotIvrFlowDto = exports.CreateFonaBotIvrFlowDto = exports.FonaBotIVREdgeDto = exports.FonaBotIVRNodeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class FonaBotIVRNodeDto {
}
exports.FonaBotIVRNodeDto = FonaBotIVRNodeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonaBotIVRNodeDto.prototype, "node_client_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonaBotIVRNodeDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FonaBotIVRNodeDto.prototype, "position_x", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FonaBotIVRNodeDto.prototype, "position_y", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FonaBotIVRNodeDto.prototype, "properties", void 0);
class FonaBotIVREdgeDto {
}
exports.FonaBotIVREdgeDto = FonaBotIVREdgeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonaBotIVREdgeDto.prototype, "edge_client_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonaBotIVREdgeDto.prototype, "source_node_client_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonaBotIVREdgeDto.prototype, "target_node_client_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FonaBotIVREdgeDto.prototype, "source_handle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FonaBotIVREdgeDto.prototype, "target_handle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FonaBotIVREdgeDto.prototype, "properties", void 0);
class CreateFonaBotIvrFlowDto {
}
exports.CreateFonaBotIvrFlowDto = CreateFonaBotIvrFlowDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFonaBotIvrFlowDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFonaBotIvrFlowDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateFonaBotIvrFlowDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFonaBotIvrFlowDto.prototype, "trigger_phone_number", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FonaBotIVRNodeDto),
    __metadata("design:type", Array)
], CreateFonaBotIvrFlowDto.prototype, "nodes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FonaBotIVREdgeDto),
    __metadata("design:type", Array)
], CreateFonaBotIvrFlowDto.prototype, "edges", void 0);
class UpdateFonaBotIvrFlowDto extends CreateFonaBotIvrFlowDto {
}
exports.UpdateFonaBotIvrFlowDto = UpdateFonaBotIvrFlowDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFonaBotIvrFlowDto.prototype, "name", void 0);
class FonaBotIvrFlowResponseDto {
}
exports.FonaBotIvrFlowResponseDto = FonaBotIvrFlowResponseDto;
//# sourceMappingURL=ivr-flow.dto.js.map