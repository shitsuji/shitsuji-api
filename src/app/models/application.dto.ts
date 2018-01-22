import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

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
}
