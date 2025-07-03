import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { ParamsGetList, ResultFindAndCount } from '../common-dto/format';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create_comment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContentType } from '../notification/dto/notification.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private emitter: EventEmitter2,
  ) {}

  /**
   * 댓글 리스트 조회
   *
   * @param options ParamsGetList
   * @returns <ResultFindAndCount<Comment>>
   */
  public async getCommentList(
    options: ParamsGetList,
  ): Promise<ResultFindAndCount<Comment>> {
    return await this.commentRepository.findCommentList(options);
  }

  /**
   * 댓글 생성
   *
   * @param payload CreateCommentDto
   * @returns Comment
   */
  public async postComment(payload: CreateCommentDto): Promise<Comment> {
    if (payload.parentId) {
      const parentComment =
        await this.commentRepository.findCommentWithParentId(payload.parentId);
      if (!parentComment) {
        throw new NotFoundException('no parent comment');
      }

      if (parentComment.children.length > 0) {
        throw new BadRequestException('this comment already has child comment');
      }
    }

    const result = await this.commentRepository.createComment(payload);

    this.emitter.emit('content.created', {
      type: ContentType.Comment,
      content: result.content,
      id: result.id,
    });

    return result;
  }
}
