import { IsInt, IsOptional, Min } from 'class-validator';

export class ParamsGetList {
  @IsInt()
  @IsOptional()
  @Min(0)
  page?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  perPage?: number;
}

export class ResultFindAndCount<T> {
  list: Array<T>;

  total: number;
}
