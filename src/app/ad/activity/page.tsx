'use client';

import { useEffect, useState } from 'react';

type LogItem = {
  id: number;
  actorEmail: string | null;
  actorRole: string | null;
  action: string;
  entityType: string;
  summary: string;
  createdAt: string;
};

export default function AdActivityPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/ad/activity?limit=80')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      })
      .catch(() => setError('Ачаалж чадсангүй'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 text-foreground">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Үйлдлийн түүх</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Хэн менежер / оператор юу хийсэн — бүртгэл, баталгаажуулалт, салон код гэх мэт ({total})
        </p>
      </div>

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-muted-foreground">Ачаалж байна...</p>
      ) : logs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Түүх хоосон
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {logs.map((log) => (
            <li key={log.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium">{log.summary}</p>
                <p className="text-xs text-muted-foreground">
                  {log.actorEmail || '—'} · {log.actorRole || '—'} · {log.action} · {log.entityType}
                </p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {new Date(log.createdAt).toLocaleString('mn-MN')}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
