import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationMiddleware } from './common/middlewares/authentication.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Furniture } from './services/furniture/furniture.entity';
import { ScanModule } from './services/scan/scan.module';

@Module({
  imports: [
    ScanModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'test',
      entities: [Furniture],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
