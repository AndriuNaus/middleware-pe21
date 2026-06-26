import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireJwt }   from './middlewares/auth.js';       // reemplaza requireApiKey
import { rateLimiter }  from './middlewares/rateLimiter.js'; // nuevo
import v1Inscripciones  from './routes/v1/inscripciones.js';
import v2Inscripciones  from './routes/v2/inscripciones.js';

const app = express();

app.use(express.json());   // 1. Parseo del cuerpo
app.use(requestLogger);    // 2. Logger
app.use(requireJwt);       // 3. Autenticacion JWT
app.use(rateLimiter);      // 4. Rate limiting

app.use('/v1/inscripciones', v1Inscripciones);
app.use('/v2/inscripciones', v2Inscripciones);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));
