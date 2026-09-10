'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Gem, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError('Password non valida. Riprova.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-panel">
        <span className="brand-mark"><Gem className="h-5 w-5" /></span>
        <p className="eyebrow mt-8">Area riservata</p>
        <h1 className="display-type mt-3 text-4xl">Maison Aurea Admin</h1>
        <p className="mt-3 text-[#6a6155]">Accedi per gestire immobili, immagini e appuntamenti.</p>
        <form className="mt-8 grid gap-4" onSubmit={submit}>
          <label className="form-field">
            <span>Password</span>
            <Input autoComplete="current-password" className="h-12" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button className="h-12 gap-2 bg-[#171511] text-[#fff7ea]" disabled={loading} type="submit">
            <LockKeyhole className="h-4 w-4" /> {loading ? 'Accesso...' : 'Entra nel pannello'}
          </Button>
        </form>
        <Link className="mt-7 inline-flex items-center gap-2 text-sm font-semibold" href="/"><ArrowLeft className="h-4 w-4" /> Torna al sito</Link>
      </div>
    </main>
  );
}
