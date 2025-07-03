import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConst } from '../appConst';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === appConst.dev) {
          return {
            type: 'mysql',
            host: config.get('TEST_DB_HOST'),
            port: +config.get('TEST_DB_PORT'),
            username: config.get('TEST_DB_USERNAME'),
            password: config.get('TEST_DB_PASSWORD'),
            database: config.get('TEST_DB_DATABASE'),
            entities: [__dirname + './../**/*.entity{.ts,.js}'],
            dropSchema: true,
            synchronize: true,
            keepConnectionAlive: true,
          };
        }

        return {
          type: 'mysql',
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [__dirname + './../**/*.entity{.ts,.js}'],
          dropSchema: false,
          synchronize: false,
          keepConnectionAlive: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
