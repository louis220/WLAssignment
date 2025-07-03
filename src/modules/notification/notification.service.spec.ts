import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';

const mockKeywords = [
  { writer: 'alice', keyword: 'NestJS' },
  { writer: 'bob', keyword: 'TypeORM' },
];

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: NotificationRepository;

  const mockNotificationRepo = {
    findNotificationKeyword: jest.fn().mockResolvedValue(mockKeywords),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepo,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<NotificationRepository>(
      NotificationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
