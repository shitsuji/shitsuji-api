import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ProjectDto {
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
  @IsString()
  createdAt: Date;

  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  name: string;
}
