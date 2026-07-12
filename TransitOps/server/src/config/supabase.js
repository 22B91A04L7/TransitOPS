import { createClient } from '@supabase/supabase-js'
import WebSocket from 'ws'
import { env } from './env.js'

if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = WebSocket
}

const clientOptions = {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
    },
}

export const createSupabaseClient = () => createClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    clientOptions,
)

export const supabase = createSupabaseClient()

export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, clientOptions)
    : supabase
