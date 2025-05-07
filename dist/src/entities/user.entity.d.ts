import { IvrFlow } from './ivr-flow.entity';
import { ExternalApiCredential } from './external-api-credential.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    ivrFlows: IvrFlow[];
    externalApiCredentials: ExternalApiCredential[];
}
