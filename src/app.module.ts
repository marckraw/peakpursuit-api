import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilPublicModule } from './util-public/util-public.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './utils/logger.middleware';
import { PictureModule } from './picture/picture.module';
import { TagModule } from './tag/tag.module';
import { StorageModule } from './storage/storage.module';
import { MessagesModule } from './messages/messages.module';
import { User } from './user/user.entity';
import { Report } from './reports/report.entity';
import { ReportsModule } from './reports/reports.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${
        process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
      }`,
      isGlobal: true,
    }), // helps with getting envs into the project, also have ConfigService Globally available
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: Number(process.env.DATABASE_PORT),
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: Number(configService.get<string>('POSTGRES_PORT')),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Report],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db-2.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: configService.get<string>('DB_NAME'),
    //       synchronize: true,
    //       entities: [User, Report],
    //     };
    //   },
    // }),
    UtilPublicModule,
    PictureModule,
    TagModule,
    StorageModule,
    MessagesModule,
    ReportsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
