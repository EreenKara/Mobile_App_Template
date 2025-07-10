export interface Register {
   name: string;
   email: string;
   phoneNumber: string;
   password: string;
   confirmPassword: string;
   code?: string; // Optional, used for verification
}
