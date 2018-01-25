import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ApplicationCreateDto {
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
}
