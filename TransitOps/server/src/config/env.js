import dotenv from 'dotenv'

dotenv.config()

export const env = {
    PORT: Number(process.env.PORT) || 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'change-me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
}