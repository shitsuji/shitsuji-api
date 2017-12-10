import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RepositoryDto } from './repository.dto';

export class ApplicationDto {
  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  '@rid': string;

  @ApiModelProperty({
    required: true,
    type: Date
  })
  @IsDate()
  createdAt: Date;

  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  name: string;

  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  key: string;

  @ApiModelPropertyOptional({
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  isGenerated: boolean;

  @ApiModelPropertyOptional({
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  isLegacy: boolean;

  @ApiModelPropertyOptional({
    type: RepositoryDto
  })
  @IsOptional()
  @ValidateNested()
  repository: RepositoryDto;
}
