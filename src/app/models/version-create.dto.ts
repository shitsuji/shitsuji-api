import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommitCreateDto } from './commit-create.dto';

export class VersionCreateDto {
  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  number: string;

  @ApiModelPropertyOptional({
    type: CommitCreateDto
  })
  @IsOptional()
  @ValidateNested()
  commit?: CommitCreateDto;
}
