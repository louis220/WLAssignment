import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create_comment.dto';
import { BadRequestException } from '@nestjs/common';

const comment = new Comment();
Object.assign<Comment, Partial<Comment>>(comment, {
  id: 1,
  boardId: 1,
  content: '댓글입니다',
  writer: '작성자2',
  children: [],
});

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: CommentRepository;

  const mockCommentRepo = {
    findCommentList: jest.fn(),
    createComment: jest.fn(),
    findCommentWithParentId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepo,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('댓글 조회 테스트', () => {
    it('댓글 리스트 조회를 할 수 있다', async () => {
      const comment2: Comment = JSON.parse(JSON.stringify(comment));
      const commentList = { list: [comment, comment2], total: 2 };

      jest
        .spyOn(commentRepository, 'findCommentList')
        .mockResolvedValue(commentList);

      const result = await service.getCommentList({});
      expect(result).toEqual(commentList);
    });
  });

  describe('댓글 등록 테스트', () => {
    it('댓글 등록을 할 수 있다', async () => {
      const payload: CreateCommentDto = {
        boardId: 1,
        content: '내용입니다',
        writer: '작성자2',
      };
      jest.spyOn(commentRepository, 'createComment').mockResolvedValue(comment);

      const result = await service.postComment(payload);
      expect(commentRepository.createComment).toHaveBeenCalledTimes(1);
      expect(commentRepository.createComment).toHaveBeenCalledWith(payload);

      expect(result).toEqual(comment);
    });

    it('댓글의 대댓글 등록을 할 수 있다', async () => {
      const comment2: Comment = JSON.parse(JSON.stringify(comment));

      comment2.parentId = 1;
      const payload: CreateCommentDto = {
        boardId: 1,
        parentId: 1,
        content: '내용입니다',
        writer: '작성자2',
      };

      jest
        .spyOn(commentRepository, 'findCommentWithParentId')
        .mockResolvedValue(comment);
      jest
        .spyOn(commentRepository, 'createComment')
        .mockResolvedValue(comment2);

      const result = await service.postComment(payload);
      expect(commentRepository.createComment).toHaveBeenCalledTimes(1);
      expect(commentRepository.createComment).toHaveBeenCalledWith(payload);

      expect(result).toEqual(comment2);
    });

    it('댓글의 대댓글까지만 등록할 수 있다', async () => {
      const comment2: Comment = JSON.parse(JSON.stringify(comment));
      comment2.parentId = 1;
      comment.children = [comment2];

      const payload: CreateCommentDto = {
        boardId: 1,
        parentId: 1,
        content: '내용입니다',
        writer: '작성자2',
      };

      jest
        .spyOn(commentRepository, 'findCommentWithParentId')
        .mockResolvedValue(comment);

      await expect(service.postComment(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
