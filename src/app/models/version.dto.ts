import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommitDto } from './commit.dto';

export class VersionDto {
  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  '@rid': string;

  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  number: string;

  @ApiModelProperty({
    required: true,
    type: Date
  })
  @IsDate()
  createdAt: Date;

  @ApiModelPropertyOptional({
    type: CommitDto
  })
  @IsOptional()
  @ValidateNested()
  commit: CommitDto;
}
