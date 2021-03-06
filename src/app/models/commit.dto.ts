import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { CommitCreateDto } from './commit-create.dto';

export class CommitDto extends CommitCreateDto {
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
}
