import { IsString } from 'class-validator';

export class DeleteBoardDto {
  @IsString()
  password: string;
}
