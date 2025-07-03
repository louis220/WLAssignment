import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Board } from './entities/board.entity';
import { BoardService } from './board.service';
import { ResultFindAndCount } from '../common-dto/format';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
import { DeleteBoardDto } from './dto/delete_board.dto';
import { GetBoardListDto } from './dto/get_board_list.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * 게시물 리스트 조회
   *
   * @param options GetBoardListDto
   * @returns <ResultFindAndCount<Board>>
   */
  @Get()
  public async getBoardList(
    @Query() options: GetBoardListDto,
  ): Promise<ResultFindAndCount<Board>> {
    return this.boardService.getBoardList(options).catch((err) => {
      if (err instanceof HttpException) {
        throw err;
      }
      Logger.error(err.stack);
      throw new InternalServerErrorException('fail to get board list');
    });
  }

  /**
   * 게시물 생성
   *
   * @param payload CreateBoardDto
   * @returns Board
   */
  @Post()
  public async postBoard(@Body() payload: CreateBoardDto): Promise<Board> {
    return this.boardService.postBoard(payload).catch((err) => {
      if (err instanceof HttpException) {
        throw err;
      }
      Logger.error(err.stack);
      throw new InternalServerErrorException('fail to create Board');
    });
  }

  /**
   * 게시물 수정
   *
   * @param id 게시물 id
   * @param payload UpdateBoardDto
   * @returns Board
   */
  @Patch(':id')
  public async patchBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.patchBoard(id, payload).catch((err) => {
      if (err instanceof HttpException) {
        throw err;
      }
      Logger.error(err.stack);
      throw new InternalServerErrorException('fail to update Board');
    });
  }

  /**
   * 게시물 삭제
   *
   * @param id 게시물 id
   * @param payload DeleteBoardDto
   * @returns { result: string }
   */
  @Delete(':id')
  public async deleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DeleteBoardDto,
  ): Promise<{ result: string }> {
    return this.boardService.deleteBoard(id, payload).catch((err) => {
      if (err instanceof HttpException) {
        throw err;
      }
      Logger.error(err.stack);
      throw new InternalServerErrorException('fail to delete Board');
    });
  }
}
