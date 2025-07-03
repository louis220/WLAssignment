import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContentCreatedDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  /**
   * 키워드 알림
   *
   * @param payload ContentCreatedDto
   */
  @OnEvent('content.created')
  public async handleContendCreated(payload: ContentCreatedDto) {
    const keywords = await this.notificationRepo.findNotificationKeyword();

    for (const { writer, keyword } of keywords) {
      if (payload.content.includes(keyword)) {
        const message = `"${keyword}" 키워드가 포함된 새 ${payload.type}가 등록되었습니다.`;
        const link = `/${payload.type}s/${payload.id}`;
        this.sendAlert(writer, message, link);
      }
    }
  }

  private sendAlert(writer: string, message: string, link: string) {
    console.log(`alert to ${writer}: ${message} (${link})`);
  }
}
