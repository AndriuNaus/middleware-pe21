# API Middleware - Anderson

Este proyecto contiene una API en Node.js con TypeScript enfocada en la implementación y validación de middlewares personalizados para el manejo de logs y restricciones de seguridad mediante API Key.

## Instalar Dependencias

Para instalar las dependencias de desarrollo necesarias para el entorno de pruebas, ejecute:

```bash
npm install

Testing
Para ejecutar la suite de pruebas unitarias con Jest y ts-jest sin necesidad de compilar previamente, ejecute el siguiente comando en la terminal:
Bash
npm test
Resultado de la ejecución de los Tests:
Plaintext
PASS  src/middlewares/auth.test.ts
PASS  src/middlewares/logger.test.ts

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.098 s
Ran all test suites


## Validación OpenAPI
validating openapi.yaml...
openapi.yaml: validated in 23ms

Woohoo! Your API description is valid. 🎉
## Reflexión: si otro equipo consumiera esta API


Si un equipo externo empezara a integrar esta API mañana, el principal cambio que realizaría en el contrato OpenAPI (`openapi.yaml`) sería endurecer las validaciones dentro de los Schemas de respuesta y definir un formato estándar para los errores, como el RFC 7807 (Problem Details). 

Actualmente, aunque se indica que un Payload es inválido (Error 400), no se estandariza cómo se devuelve ese error. Además, agregaría restricciones de longitud y formato en los schemas (por ejemplo, definir que el arreglo de `materias` no puede estar vacío, o que `periodoId` debe cumplir una expresión regular específica). Esto beneficiaría enormemente a un consumidor externo, ya que reduciría la fricción de integración: en lugar de adivinar por qué su petición falló mediante prueba y error, el propio contrato OpenAPI les generaría clientes automáticos que validarían los datos incluso antes de hacer la petición a mi servidor.

## Seguridad JWT (PE-2.3)

### Generar un token de prueba

```bash
# Con el secreto por defecto del laboratorio:
TOKEN=$(node generate-token.mjs)

# Con secreto personalizado:
JWT_SECRET=mi-secreto-largo TOKEN=$(node generate-token.mjs)
```

### Probar el servicio

```bash
# Peticion valida (esperado: 201)
curl -X POST http://localhost:3000/v2/inscripciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estudianteId":"uuid-123","materias":["LTI_05A_458"],"periodoId":"2026-1","payment_method":"scholarship"}'

# Token invalido (esperado: 401)
curl -X POST http://localhost:3000/v2/inscripciones \
  -H "Authorization: Bearer token.invalido.xxx"
```

### Variables de entorno

Copia `.env.example` a `.env` y configura `JWT_SECRET` con un valor secreto largo.