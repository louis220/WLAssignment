import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CreateBoardDto } from 'src/modules/board/dto/create_board.dto';
import { CreateCommentDto } from 'src/modules/comment/dto/create_comment.dto';
import { DataSource } from 'typeorm';
import { createBoard } from './helper/board.helper';
import { Board } from 'src/modules/board/entities/board.entity';
import { createComment } from './helper/comment.helper';

describe('COMMENT E2E TEST', () => {
  let app: INestApplication;
  let ds: DataSource;
  let emitter: EventEmitter2;
  let board: Board;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    ds = app.get(DataSource);
    emitter = app.get(EventEmitter2);

    const boardPayload: CreateBoardDto = {
      title: '게시물1222',
      content: '게시물1의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };

    board = await createBoard(app, boardPayload);
  });

  afterAll(async () => {
    emitter.removeAllListeners();
    await ds.destroy();

    await app.close();
  });

  it('댓글을 생성할 수 있다', async () => {
    const payload: CreateCommentDto = {
      boardId: board.id,
      content: '댓글내용',
      writer: '작성자1',
    };

    const result = await createComment(app, payload);

    expect(result).toMatchObject({
      id: expect.any(Number),
      content: payload.content,
      writer: payload.writer,
      boardId: payload.boardId,
    });
  });

  it('댓글의 댓글을 생성할 수 있다', async () => {
    const payload: CreateCommentDto = {
      boardId: board.id,
      content: '댓글내용',
      writer: '작성자1',
    };

    const comment = await createComment(app, payload);
    const payload2: CreateCommentDto = {
      boardId: board.id,
      content: '댓글내용',
      writer: '작성자1',
      parentId: comment.id,
    };

    const result = await createComment(app, payload2);
    expect(result).toMatchObject({
      id: expect.any(Number),
      content: payload2.content,
      writer: payload2.writer,
      boardId: payload.boardId,
      parentId: result.parentId,
    });
  });

  it('댓글의 댓글의 댓글을 달려고 하면 에러가 발생한다', async () => {
    const payload: CreateCommentDto = {
      boardId: board.id,
      content: '댓글내용',
      writer: '작성자1',
    };

    const comment = await createComment(app, payload);
    const payload2: CreateCommentDto = {
      boardId: board.id,
      content: '댓글내용',
      writer: '작성자1',
      parentId: comment.id,
    };
    await createComment(app, payload2);

    const payload3: CreateCommentDto = {
      boardId: board.id,
      content: '추가댓글내용',
      writer: '작성자2',
      parentId: comment.id,
    };

    const result = await createComment(app, payload2);

    expect(result).toMatchObject({
      message: 'this comment already has child comment',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
