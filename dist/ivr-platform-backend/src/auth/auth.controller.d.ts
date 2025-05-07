import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto, LoginResponseDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterUserDto): Promise<LoginResponseDto>;
    login(req: any, loginDto: LoginUserDto): Promise<LoginResponseDto>;
}
