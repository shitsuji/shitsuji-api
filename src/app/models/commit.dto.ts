import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CommitDto {
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
  author: string;

  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  hash: string;

  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  message: string;
}
