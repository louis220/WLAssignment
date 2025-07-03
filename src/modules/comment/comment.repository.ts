import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ParamsGetList, ResultFindAndCount } from '../common-dto/format';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create_comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  public async findCommentList(
    options: ParamsGetList,
  ): Promise<ResultFindAndCount<Comment>> {
    const { page = 0, perPage = 10 } = options;

    const result = await this.commentRepo.findAndCount({
      where: { parentId: IsNull() },
      relations: ['children'],
      order: { id: 'ASC' },
      take: perPage,
      skip: page * perPage,
    });

    return {
      list: result[0],
      total: result[1],
    };
  }

  public async findCommentWithParentId(id: number): Promise<Comment | null> {
    return this.commentRepo.findOne({ where: { id }, relations: ['children'] });
  }

  public async createComment(payload: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepo.create(payload);
    return this.commentRepo.save(comment);
  }
}
