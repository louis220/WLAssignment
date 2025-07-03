import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ParamsGetList, ResultFindAndCount } from '../common-dto/format';
import { Comment } from './entity/comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create_comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 리스트 조회
   *
   * @param options ParamsGetList
   * @returns <ResultFindAndCount<Comment>>
   */
  @Get()
  public async getCommentList(
    @Query() options: ParamsGetList,
  ): Promise<ResultFindAndCount<Comment>> {
    return this.commentService.getCommentList(options).catch((err) => {
      if (err instanceof HttpException) {
        throw err;
      }
      Logger.error(err.stack);
      throw new InternalServerErrorException('fail to get Comment list');
    });
  }

  /**
   * 댓글 등록
   *
   * @param payload CreateCommentDto
   * @returns Comment
   */
  @Post()
  public async postComment(
    @Body() payload: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.postComment(payload).catch((err) => {
      if (err instanceof HttpException) {
        throw err;
      }
      Logger.error(err.stack);
      throw new InternalServerErrorException('fail to create Comment');
    });
  }
}
