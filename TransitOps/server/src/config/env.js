import dotenv from 'dotenv'

dotenv.config()

export const env = {
    PORT: Number(process.env.PORT) || 5000,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
}
