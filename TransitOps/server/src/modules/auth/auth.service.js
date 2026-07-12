import { createSupabaseClient, supabaseAdmin } from '../../config/supabase.js'

const mapUser = (user) => ({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    roleId: user.role_id,
    roleName: user.roles?.name || null,
    isActive: user.is_active,
})

export const getUserById = async (id) => {
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, full_name, is_active, role_id, roles(name)')
        .eq('id', id)
        .maybeSingle()

    if (error) {
        throw new Error(error.message || 'Database error while loading user')
    }

    return user ? mapUser(user) : null
}

export const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const supabase = createSupabaseClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
    })

    if (authError) {
        if (authError.message === 'Invalid login credentials') {
            return null
        }

        const error = new Error(`Supabase authentication failed: ${authError.message}`)
        error.statusCode = authError.message === 'Email not confirmed' ? 403 : 502
        throw error
    }

    const authUser = authData?.user

    if (!authUser) {
        return null
    }

    const user = await getUserById(authUser.id)

    if (!user) {
        const error = new Error(
            'Account profile was not found. Add this Auth user to public.users and confirm its read policy.',
        )
        error.statusCode = 403
        throw error
    }

    if (!user.is_active) {
        const error = new Error('This account is inactive')
        error.statusCode = 403
        throw error
    }

    return mapUser(user)
}
