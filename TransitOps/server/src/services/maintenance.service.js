import { supabaseAdmin } from '../config/supabase.js'

const TABLE = 'maintenance_logs'

export const maintenanceService = {
  async createMaintenance(data, userId) {
    const payload = {
      ...data,
      created_by: userId,
      updated_by: userId,
    }

    const { data: record, error } = await supabaseAdmin
      .from(TABLE)
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return record
  },

  async getMaintenanceById(id) {
    const { data: record, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return record
  },

  async getAllMaintenance() {
    const { data: records, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .order('scheduled_date', { ascending: false })

    if (error) throw error
    return records
  },

  async updateMaintenance(id, data, userId) {
    const payload = {
      ...data,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }

    const { data: record, error } = await supabaseAdmin
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return record
  },

  async deleteMaintenance(id) {
    const { error } = await supabaseAdmin.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },
}
