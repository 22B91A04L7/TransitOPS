import { createClient } from '@supabase/supabase-js'
<<<<<<< HEAD
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
=======
import { env } from './env.js'

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
>>>>>>> origin/person-cMaintenance
