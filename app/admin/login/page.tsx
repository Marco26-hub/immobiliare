import type { Metadata } from 'next';
import { AdminLoginForm } from './ui';

export const metadata: Metadata = { title: 'Accesso riservato | Maison Aurea' };

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
