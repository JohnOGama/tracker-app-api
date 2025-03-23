import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './app/users/users.service';
import { UsersModule } from './app/users/users.module';
import { UtangModule } from './app/utang/utang.module';
import typeormConfig from './config/database/postgres/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.getOrThrow('typeormConfig');
      },
    }),
    AuthModule,
    UsersModule,
    UtangModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
