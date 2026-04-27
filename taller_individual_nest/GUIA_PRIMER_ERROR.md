# Guía mínima para resolver errores `Cannot find module` paso a paso

## Paso 1: primer error (mínimo cambio)

### Error inicial
Al correr `npm run test` aparecía:

`Cannot find module './user.service' from 'user/user.service.spec.ts'`

Esto significa que el test `src/user/user.service.spec.ts` intenta importar `./user.service`, pero ese archivo no existe.

### Cambio mínimo
Crear el archivo faltante:

- [src/user/user.service.ts](src/user/user.service.ts)

Con contenido mínimo:

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {}
```

### Verificación
Ejecutar de nuevo:

`npm run test`

---

## Paso 2: aparecen nuevos `Cannot find module` (normal)

Después de arreglar el primero, Jest sigue avanzando y reporta los siguientes imports faltantes.
Esto es esperado en proyectos donde faltan varios archivos base.

### Importante
`UserService` y `UserController` deben ir en archivos separados:

- [src/user/user.service.ts](src/user/user.service.ts)
- [src/user/user.controller.ts](src/user/user.controller.ts)

Si ambos están pegados en un solo archivo, los specs no podrán resolver los paths correctos.

### Archivos mínimos a crear para eliminar errores de módulo

#### User
- [src/user/user.controller.ts](src/user/user.controller.ts)
- [src/user/entities/user.entity.ts](src/user/entities/user.entity.ts)
- [src/user/dto/create-user.dto.ts](src/user/dto/create-user.dto.ts)
- [src/user/dto/update-user.dto.ts](src/user/dto/update-user.dto.ts)

#### Book
- [src/book/book.service.ts](src/book/book.service.ts)
- [src/book/book.controller.ts](src/book/book.controller.ts)
- [src/book/entities/book.entity.ts](src/book/entities/book.entity.ts)
- [src/book/dto/create-book.dto.ts](src/book/dto/create-book.dto.ts)
- [src/book/dto/update-book.dto.ts](src/book/dto/update-book.dto.ts)

### Stubs mínimos recomendados

#### Service
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleService {}
```

#### Controller
```ts
import { Controller } from '@nestjs/common';

@Controller('example')
export class ExampleController {}
```

#### DTO / Entity
```ts
export class ExampleDto {}
```

```ts
export class ExampleEntity {}
```

---

## ¿Qué sigue después?

Cuando ya no haya errores `Cannot find module`, lo siguiente será implementar métodos y lógica para pasar tests de comportamiento.

## Resumen rápido

1. Arregla el primer import faltante.
2. Corre tests.
3. Crea los demás archivos faltantes (en rutas correctas).
4. Repite hasta eliminar todos los `Cannot find module`.
