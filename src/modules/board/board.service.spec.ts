import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
import { BadRequestException } from '@nestjs/common';

const board = new Board();
Object.assign<Board, Partial<Board>>(board, {
  id: 1,
  title: '제목',
  content: '내용입니다',
  writer: '작성자1',
  password: 'hashed-password',
  comments: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('BoardService', () => {
  let service: BoardService;
  let boardRepository: BoardRepository;

  const mockBoardRepo = {
    createBoard: jest.fn(),
    findBoardList: jest.fn(),
    findBoard: jest.fn(),
    updateBoard: jest.fn(),
    deleteBoard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        BoardService,
        {
          provide: BoardRepository,
          useValue: mockBoardRepo,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게시물 조회 테스트', () => {
    it('게시물 리스트 조회를 할 수 있다', async () => {
      const board2: Board = JSON.parse(JSON.stringify(board));
      const boardList = { list: [board, board2], total: 2 };

      jest.spyOn(boardRepository, 'findBoardList').mockResolvedValue(boardList);

      const result = await service.getBoardList({});
      expect(result).toEqual(boardList);
    });
  });

  describe('게시물 등록 테스트', () => {
    it('게시물 등록을 할 수 있다', async () => {
      const payload: CreateBoardDto = {
        title: '제목',
        content: '내용입니다',
        writer: '작성자1',
        password: '비밀번호',
      };

      jest.spyOn(boardRepository, 'createBoard').mockResolvedValue(board);

      const result = await service.postBoard(payload);
      expect(boardRepository.createBoard).toHaveBeenCalledTimes(1);
      expect(boardRepository.createBoard).toHaveBeenCalledWith(payload);

      expect(result).toEqual(board);
    });

    it('비밀번호가 암호화되어 저장된다', async () => {
      board.password = 'password';
      await board.hashPassword();

      expect(board.password).toEqual('hashed-password');
    });
  });

  describe('게시물 수정 테스트', () => {
    it('게시물 수정을 할 수 있다', async () => {
      const payload: UpdateBoardDto = {
        content: '수정내용입니다',
        password: 'password',
      };

      const updatedBoard = new Board();
      Object.assign(updatedBoard, board, payload);

      jest.spyOn(boardRepository, 'findBoard').mockResolvedValue(board);
      jest
        .spyOn(boardRepository, 'updateBoard')
        .mockResolvedValue(updatedBoard);

      const result = await service.patchBoard(board.id, payload);

      expect(result).toEqual(updatedBoard);
    });

    it('비밀번호가 일치하지 않을 시 수정불가 하다', async () => {
      const payload: UpdateBoardDto = {
        content: '수정내용입니다',
        password: 'password11',
      };

      jest.spyOn(boardRepository, 'findBoard').mockResolvedValue(board);
      const bcrypt = jest.requireMock('bcrypt');
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(service.patchBoard(board.id, payload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('게시글을 삭제할 수 있다', async () => {
      jest.spyOn(boardRepository, 'findBoard').mockResolvedValue(board);
      jest
        .spyOn(boardRepository, 'deleteBoard')
        .mockResolvedValue({ result: 'delete complete' });

      const result = await service.deleteBoard(board.id, {
        password: 'password',
      });
    });
  });
});
