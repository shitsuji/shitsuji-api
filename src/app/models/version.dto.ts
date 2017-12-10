import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
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

  @ApiModelPropertyOptional({
    type: CommitDto
  })
  @IsOptional()
  @ValidateNested()
  commit: CommitDto;
}
