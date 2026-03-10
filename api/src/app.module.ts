import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import securityConfig from './config/security.config'
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from './catalog/catalog.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [securityConfig]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri')!
      })
    }),
    AuthModule,
    CatalogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
