import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { ResultFindAndCount } from '../common-dto/format';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
import { DeleteBoardDto } from './dto/delete_board.dto';
import { GetBoardListDto } from './dto/get_board_list.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContentType } from '../notification/dto/notification.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private emitter: EventEmitter2,
  ) {}

  /**
   * 게시물 리스트 조회
   *
   * @param options GetBoardListDto
   * @returns <ResultFindAndCount<Board>>
   */
  public async getBoardList(
    options: GetBoardListDto,
  ): Promise<ResultFindAndCount<Board>> {
    return this.boardRepository.findBoardList(options);
  }

  /**
   * 게시물 생성
   *
   * @param payload CreateBoardDto
   * @returns Board
   */
  public async postBoard(payload: CreateBoardDto): Promise<Board> {
    const result = await this.boardRepository.createBoard(payload);

    this.emitter.emit('content.created', {
      type: ContentType.Board,
      content: `${result.title}\n\n${result.content}`,
      id: result.id,
    });

    return result;
  }

  /**
   * 게시물 수정
   *
   * @param id 게시물 id
   * @param payload UpdateBoardDto
   * @returns Board
   */
  public async patchBoard(id: number, payload: UpdateBoardDto): Promise<Board> {
    const { password, ...updateData } = payload;

    const board = await this.boardRepository.findBoard(id);

    if (!board) {
      throw new NotFoundException('no exist board');
    }

    await this.verifyPassword(payload.password, board.password);

    return this.boardRepository.updateBoard(id, updateData);
  }

  /**
   * 게시물 삭제
   *
   * @param id 게시물 id
   * @param payload DeleteBoardDto
   * @returns { result: string }
   */
  public async deleteBoard(
    id: number,
    payload: DeleteBoardDto,
  ): Promise<{ result: string }> {
    const board = await this.boardRepository.findBoard(id);

    if (!board) {
      throw new NotFoundException('no exist board');
    }

    await this.verifyPassword(payload.password, board.password);

    return this.boardRepository.deleteBoard(id);
  }

  /**
   * 비밀번호 검증
   *
   * @param payloadPassword string
   * @param boardPassword string
   * @returns boolean
   */
  private async verifyPassword(
    payloadPassword: string,
    boardPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(payloadPassword, boardPassword);

    if (!match) {
      throw new BadRequestException('no match password');
    }
    return match;
  }
}
