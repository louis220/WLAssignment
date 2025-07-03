import { IsOptional, IsString } from 'class-validator';
import { ParamsGetList } from '../../common-dto/format';

export class GetBoardListDto extends ParamsGetList {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  writer?: string;
}
