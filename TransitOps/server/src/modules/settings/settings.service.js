import { supabaseAdmin } from '../../config/supabase.js'

const userSelect = 'id, email, full_name, is_active, role_id, roles(name)'

const mapProfile = (user) => ({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    roleId: user.role_id,
    roleName: user.roles?.name || null,
    isActive: user.is_active,
})

export const getProfile = async (userId) => {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select(userSelect)
        .eq('id', userId)
        .maybeSingle()

    if (error) throw new Error(error.message || 'Failed to load profile')
    return data ? mapProfile(data) : null
}

export const updateProfile = async (userId, { fullName }) => {
    const { data, error } = await supabaseAdmin
        .from('users')
        .update({ full_name: fullName.trim() })
        .eq('id', userId)
        .select(userSelect)
        .maybeSingle()

    if (error) throw new Error(error.message || 'Failed to update profile')
    return data ? mapProfile(data) : null
}
