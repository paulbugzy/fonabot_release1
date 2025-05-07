import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterUserDto, LoginResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterUserDto): Promise<User>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: User): Promise<LoginResponseDto>;
}
