"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_2 = require("@nestjs/core");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const validation_interceptor_1 = require("./common/interceptors/validation.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use(helmet());
    app.enableCors({
        origin: configService.get('ALLOWED_ORIGINS', '').split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: process.env.NODE_ENV === 'production',
    }), new logging_interceptor_1.LoggingInterceptor(), new validation_interceptor_1.ValidationInterceptor());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(config_1.ConfigService)));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const httpAdapter = app.get(core_2.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapter));
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map