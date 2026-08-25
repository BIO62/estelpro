import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';

export async function writeAudit(input: {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  meta?: Record<string, unknown>;
}) {
  if (!isSupabaseConfigured()) return;
  const db = supabaseAdmin();
  if (!db) return;
  await db.from('audit_logs').insert({
    actor_id: input.actorId || null,
    actor_email: input.actorEmail || null,
    actor_role: input.actorRole || null,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId || null,
    summary: input.summary,
    meta: input.meta || {},
  });
}

export async function listAuditLogs(opts?: { limit?: number; offset?: number }) {
  const db = supabaseAdmin();
  if (!db) return { items: [], total: 0 };
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const { data, error, count } = await db
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return {
    items: (data || []).map((row) => ({
      id: row.id as number,
      actorId: row.actor_id as string | null,
      actorEmail: row.actor_email as string | null,
      actorRole: row.actor_role as string | null,
      action: row.action as string,
      entityType: row.entity_type as string,
      entityId: row.entity_id as string | null,
      summary: row.summary as string,
      meta: (row.meta || {}) as Record<string, unknown>,
      createdAt: row.created_at as string,
    })),
    total: count ?? 0,
  };
}
