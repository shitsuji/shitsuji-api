import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { RepositoryDto } from './repository.dto';

export class RepositoryModel extends RepositoryDto {
  @ApiModelProperty({
    required: true,
    type: String
  })
  @IsString()
  privateKey: string;
}
