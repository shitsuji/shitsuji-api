import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CommitCreateDto {
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
