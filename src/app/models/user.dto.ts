import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UserDto {
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
  login: string;

  @ApiModelProperty({
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  password: string;
}
