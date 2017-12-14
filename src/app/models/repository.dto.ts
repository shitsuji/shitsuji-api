import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

export class RepositoryDto {
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
  url: string;

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
  publicKey: string;
}
