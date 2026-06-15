import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { requestLogger } from './logger.js'; // Ajusta la ruta a tu archivo
import type { Request, Response, NextFunction } from 'express';

describe('Pruebas para el Request Logger Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // 1. Creamos los mocks limpios antes de cada test
    req = {
      method: 'GET',
      path: '/productos'
    };
    
    // El mock de res necesita registrar el evento 'finish'
    res = {
      statusCode: 200,
      on: jest.fn()
    };

    next = jest.fn();
  });

  // CASO A
  test('Debe invocar next() inmediatamente al recibir una petición', () => {
    requestLogger(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  // CASO B
  test('Debe registrar el método y la ruta correctamente cuando finaliza la petición', () => {
    // Espiamos el console.log para ver qué escribe
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Ejecutamos el middleware
    requestLogger(req as Request, res as Response, next);

    // Recuperamos la función callback que se le pasó a res.on('finish', callback)
    const mockOn = res.on as any;
    const eventoAsignado = mockOn.mock.calls[0][0]; 
    const callbackAsignado = mockOn.mock.calls[0][1];

    expect(eventoAsignado).toBe('finish');

    // Ejecutamos manualmente el callback para simular que la petición terminó
    callbackAsignado();

    // Verificamos que el console.log se llamó con los datos del req
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /productos -> 200')
    );

    // Limpiamos el espía de la consola
    consoleSpy.mockRestore();
  });
});