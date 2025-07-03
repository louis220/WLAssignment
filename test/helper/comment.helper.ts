import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  ParamsGetList,
  ResultFindAndCount,
} from 'src/modules/common-dto/format';
import { CreateCommentDto } from 'src/modules/comment/dto/create_comment.dto';
import { Comment } from 'src/modules/comment/entity/comment.entity';

export const getCommentList = async (
  app: INestApplication,
  query: ParamsGetList,
): Promise<ResultFindAndCount<Comment>> => {
  const result = await request(app.getHttpServer())
    .get('/comments')
    .query(query);
  return result.body;
};

export const createComment = async (
  app: INestApplication,
  payload: CreateCommentDto,
): Promise<Comment> => {
  const result = await request(app.getHttpServer())
    .post('/comments')
    .send(payload);
  return result.body;
};
