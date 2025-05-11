export interface ITelephonyService {
  makeTestCall(userId: string, toPhoneNumber: string, message: string): Promise<string>;
}

export interface TelephonyCredentials {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}