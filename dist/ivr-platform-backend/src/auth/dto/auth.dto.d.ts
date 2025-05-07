export declare class RegisterUserDto {
    email: string;
    password: string;
}
export declare class LoginUserDto {
    email: string;
    password: string;
}
export declare class LoginResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
    };
}
