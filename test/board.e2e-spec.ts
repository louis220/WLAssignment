import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateBoardDto } from 'src/modules/board/dto/create_board.dto';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  createBoard,
  deleteBoard,
  getBoardList,
  updateBoard,
} from './helper/board.helper';
import { UpdateBoardDto } from 'src/modules/board/dto/update_board.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('BOARD E2E TEST', () => {
  let app: INestApplication;
  let ds: DataSource;
  let emitter: EventEmitter2;

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
  });

  afterAll(async () => {
    emitter.removeAllListeners();
    await ds.destroy();

    await app.close();
  });

  it('게시물을 조회할 수 있다', async () => {
    const payload: CreateBoardDto = {
      title: '게시물1',
      content: '게시물1의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };
    const payload2: CreateBoardDto = {
      title: '게시물2',
      content: '게시물2의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };

    const board = await createBoard(app, payload);
    const board2 = await createBoard(app, payload2);

    const result = await getBoardList(app, {});
    expect(result).toMatchObject({ list: [board2, board], total: 2 });
  });

  it('게시물을 생성할 수 있다', async () => {
    const payload: CreateBoardDto = {
      title: '게시물1',
      content: '게시물1의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };

    const result = await createBoard(app, payload);

    expect(result).toMatchObject({
      id: expect.any(Number),
      title: payload.title,
      content: payload.content,
      writer: payload.writer,
    });
  });

  it('게시물을 수정할 수 있다', async () => {
    const createPayload: CreateBoardDto = {
      title: '게시물1',
      content: '게시물1의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };

    const board = await createBoard(app, createPayload);

    const updatePayload: UpdateBoardDto = {
      title: '수정된 게시물1',
      password: 'plainpw',
    };
    const result = await updateBoard(app, board.id, updatePayload);

    expect(result).toMatchObject({
      id: expect.any(Number),
      title: updatePayload.title,
    });
  });
  it('비밀번호가 일치하지 않을시 게시물을 수정할 수 없다', async () => {
    const createPayload: CreateBoardDto = {
      title: '게시물1',
      content: '게시물1의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };

    const board = await createBoard(app, createPayload);
    const updatePayload: UpdateBoardDto = {
      title: '수정된 게시물1',
      password: 'wrong_password',
    };

    const result = await updateBoard(app, board.id, updatePayload);
    expect(result).toMatchObject({
      message: 'no match password',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('게시물을 삭제할 수 있다', async () => {
    const createPayload: CreateBoardDto = {
      title: '게시물1',
      content: '게시물1의 내용입니다.',
      writer: '테스터1',
      password: 'plainpw',
    };

    const board = await createBoard(app, createPayload);
    const result = await deleteBoard(app, board.id, createPayload.password);
    expect(result).toMatchObject({ result: 'delete complete' });
  });
});
