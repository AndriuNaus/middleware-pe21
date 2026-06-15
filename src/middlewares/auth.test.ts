import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { requireApiKey } from './auth.js';
import type { Request, Response, NextFunction } from 'express';

describe('Pruebas para el Middleware de Verificación de API Key', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;

    next = jest.fn();
  });

  // ESCENARIO A y B (Tu middleware maneja ambos casos con el mismo error)
  test('Debe responder con 401 si la cabecera x-api-key está ausente o es incorrecta', () => {
    req.headers = { 'x-api-key': 'clave-incorrecta' };

    requireApiKey(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'API key inválida o ausente' });
    expect(next).not.toHaveBeenCalled();
  });

  // ESCENARIO C
  test('Debe invocar next() sin emitir respuesta si la clave es válida', () => {
    req.headers = { 'x-api-key': 'secreto-demo' };

    requireApiKey(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});