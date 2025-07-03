import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  writer: string;

  @IsString()
  password: string;
}
