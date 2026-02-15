'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function authenticate(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Email atau password salah' };
    }
    return { success: false, error: 'Terjadi kesalahan' };
  }
}
