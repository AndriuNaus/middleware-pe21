import type { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

function base64urlDecode(str: string): string {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  const parts = token.split('.');
  if (parts.length !== 3) return res.status(401).json({ error: 'Token malformado' });

  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];

  try {
    // Verificar que el algoritmo declarado es HS256 (nunca confiar en alg)
    const header = JSON.parse(base64urlDecode(headerB64));
    if (header.alg !== 'HS256') return res.status(401).json({ error: 'Algoritmo no permitido' });

    // Recalcular firma y comparar con tiempo constante
    const expectedSig = createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (!timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig))) {
      return res.status(401).json({ error: 'Firma invalida' });
    }

    const claims = JSON.parse(base64urlDecode(payloadB64));

    // Validar claims obligatorios
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) return res.status(401).json({ error: 'Token expirado' });
    if (!claims.sub) return res.status(401).json({ error: 'Claim sub ausente' });

    (req as Request & { user?: unknown }).user = { sub: claims.sub, scope: claims.scope ?? '' };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token malformado' });
  }
}

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-api-key'];
  if (key !== 'secreto-demo') {
    res.status(401).json({ error: 'API key inválida o ausente' });
    return;
  }
  next();
}