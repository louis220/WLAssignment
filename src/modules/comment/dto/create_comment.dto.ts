import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  boardId: number;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  content: string;

  @IsString()
  writer: string;
}
