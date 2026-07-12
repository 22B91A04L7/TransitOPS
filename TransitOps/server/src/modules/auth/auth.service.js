import bcrypt from 'bcryptjs'
import { supabase } from '../../config/supabase.js'

export const loginUser = async ({ email, password }) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, password_hash, is_active, role_id, roles(name)')
        .eq('email', email.toLowerCase())
        .maybeSingle()

    if (error) {
        throw new Error('Database error during login')
    }

    if (!data) {
        return null
    }

    if (!data.is_active) {
        throw new Error('User account is inactive')
    }

    const isPasswordValid = await bcrypt.compare(password, data.password_hash)

    if (!isPasswordValid) {
        return null
    }

    return {
        id: data.id,
        email: data.email,
        roleId: data.role_id,
        roleName: data.roles?.name || null,
    }
}