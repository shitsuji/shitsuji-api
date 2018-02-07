import { ApiModelProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ApplicationDto } from './application.dto';
import { VersionDto } from './version.dto';

export class DependencyDto {
  @ApiModelProperty({
    required: true,
    type: ApplicationDto
  })
  @ValidateNested()
  application: ApplicationDto;

  @ApiModelProperty({
    required: true,
    type: VersionDto
  })
  @ValidateNested()
  version: VersionDto;
}
