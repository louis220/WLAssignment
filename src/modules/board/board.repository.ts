import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { ResultFindAndCount } from '../common-dto/format';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
import { GetBoardListDto } from './dto/get_board_list.dto';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  public async findBoardList(
    options: GetBoardListDto,
  ): Promise<ResultFindAndCount<Board>> {
    const { page = 0, perPage = 10, title, writer } = options;

    const where: FindOptionsWhere<Board> = {};

    if (title) {
      where.title = Like(`%${title}%`);
    }

    if (writer) {
      where.writer = Like(`%${writer}%`);
    }

    const result = await this.boardRepo.findAndCount({
      order: { id: 'DESC' },
      take: perPage,
      skip: page * perPage,
    });

    return {
      list: result[0],
      total: result[1],
    };
  }

  public async findBoard(id: number): Promise<Board | null> {
    return this.boardRepo.findOne({
      where: { id },
    });
  }

  public async createBoard(payload: CreateBoardDto): Promise<Board> {
    const board = this.boardRepo.create(payload);
    return this.boardRepo.save(board);
  }

  public async updateBoard(
    id: number,
    payload: Partial<Pick<UpdateBoardDto, 'title' | 'content'>>,
  ): Promise<Board> {
    return this.boardRepo.save({ id, ...payload });
  }

  public async deleteBoard(id: number): Promise<{ result: string }> {
    await this.boardRepo.softDelete(id);
    return { result: 'delete complete' };
  }
}
