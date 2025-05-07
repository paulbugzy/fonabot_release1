import { User } from './user.entity';
export declare class ExternalApiCredential {
    id: string;
    userId: string;
    serviceName: string;
    description: string;
    credentialsEncrypted: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
