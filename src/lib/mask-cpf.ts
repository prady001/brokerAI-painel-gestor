/**
 * Mascara CPF para exibição em listagens: ***.210.318-**
 * Mantém o bloco do meio (3 dígitos.3 dígitos) e mascara o resto.
 */
export function maskCpf(cpf: string | null): string {
  if (!cpf || typeof cpf !== 'string') return '—';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length < 9) return '***.***.***-**';
  const middle = `${digits.slice(3, 6)}.${digits.slice(6, 9)}`;
  return `***.${middle}-**`;
}
