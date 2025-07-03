import { INestApplication } from '@nestjs/common';
import { CreateBoardDto } from '../../src/modules/board/dto/create_board.dto';
import { GetBoardListDto } from '../../src/modules/board/dto/get_board_list.dto';
import { UpdateBoardDto } from '../../src/modules/board/dto/update_board.dto';
import * as request from 'supertest';
import { Board } from 'src/modules/board/entities/board.entity';
import { ResultFindAndCount } from 'src/modules/common-dto/format';

export const getBoardList = async (
  app: INestApplication,
  query: GetBoardListDto,
): Promise<ResultFindAndCount<Board>> => {
  const result = await request(app.getHttpServer()).get('/boards').query(query);
  return result.body;
};

export const createBoard = async (
  app: INestApplication,
  payload: CreateBoardDto,
): Promise<Board> => {
  const result = await request(app.getHttpServer())
    .post('/boards')
    .send(payload);
  return result.body;
};

export const updateBoard = async (
  app: INestApplication,
  id: number,
  payload: UpdateBoardDto,
): Promise<Board> => {
  const result = await request(app.getHttpServer())
    .patch(`/boards/${id}`)
    .send(payload);
  return result.body;
};

export const deleteBoard = async (
  app: INestApplication,
  id: number,
  password: string,
): Promise<{ result: string }> => {
  const result = await request(app.getHttpServer())
    .delete(`/boards/${id}`)
    .send({ password });
  return result.body;
};
