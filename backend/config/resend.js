import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resendClient = new Resend(process.env.RESEND_API_KEY);

export default resendClient;
