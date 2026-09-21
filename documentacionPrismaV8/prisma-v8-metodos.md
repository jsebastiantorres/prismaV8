# Guía de referencia — Métodos de Prisma ORM 8 (Release Candidate)

> ⚠️ **Nota importante:** Prisma ORM 8 está actualmente en fase **Release Candidate** (aún no es la versión estable final). Es un cambio grande respecto a Prisma 7: ya no existe `PrismaClient` con `findMany()`, `create({ data })`, etc. En su lugar hay un cliente nuevo (`db.orm`) con sintaxis encadenada, y el `schema.prisma` ahora se llama **"contract"**. Si tu proyecto sigue en Prisma 7, esta guía no aplica — usá `prisma@7`.
>
> Cliente creado así:
> ```js
> import postgres from '@prisma/orm-postgres/runtime';
> import contractJson from './contract.json' with { type: 'json' };
> const db = postgres({ contractJson, url: process.env.DATABASE_URL });
> // ejemplo: db.orm.public.User...
> ```

---

## 1. Métodos de construcción de consultas
Estos métodos **no ejecutan** la consulta: la van armando. Se encadenan y al final se cierra con un método de lectura o escritura.

### `where()`
**Descripción:** Restringe una consulta a las filas que cumplen un filtro. Se puede llamar varias veces (se combinan con AND).
**Ejemplos de uso:** Buscar usuarios por email, filtrar posts de un usuario específico, combinar varios filtros encadenados.
**Sintaxis:**
```js
const admins = await db.orm.public.User.where((u) => u.kind.eq('admin')).all();
const bob = await db.orm.public.User.where({ email: 'bob@example.com' }).first();
```

### `select()`
**Descripción:** Devuelve solo los campos escalares que indiques, en vez de la fila completa.
**Ejemplos de uso:** Traer solo id y email de usuarios para una lista, reducir el tamaño de la respuesta.
**Sintaxis:**
```js
const resumen = await db.orm.public.User.select('id', 'email').all();
```

### `include()`
**Descripción:** Carga una relación (uno-a-uno, uno-a-muchos) junto con la fila principal.
**Ejemplos de uso:** Traer un usuario junto con sus posts, traer un post junto con su autor.
**Sintaxis:**
```js
const usuarios = await db.orm.public.User.include('posts').where({ id: aliceId }).all();
```

### `orderBy()`
**Descripción:** Ordena el resultado por uno o varios campos, ascendente o descendente.
**Ejemplos de uso:** Ordenar posts del más nuevo al más viejo, ordenar por prioridad y luego por fecha.
**Sintaxis:**
```js
const recientes = await db.orm.public.Post.orderBy((p) => p.createdAt.desc()).all();
```

### `limit()`
**Descripción:** Limita la cantidad máxima de filas devueltas.
**Ejemplos de uso:** Paginación, traer solo los primeros N resultados.
**Sintaxis:**
```js
const primeros = await db.orm.public.Post.orderBy((p) => p.createdAt.asc()).limit(2).all();
```

### `offset()`
**Descripción:** Salta una cantidad de filas antes de empezar a devolver resultados.
**Ejemplos de uso:** Paginación combinada con `orderBy()` y `limit()`.
**Sintaxis:**
```js
const pagina2 = await db.orm.public.Post.orderBy((p) => p.createdAt.asc()).offset(2).limit(2).all();
```

### `cursor()`
**Descripción:** *(Solo PostgreSQL)* Retoma la paginación desde una posición conocida (paginación por cursor).
**Ejemplos de uso:** Paginación infinita en un feed, continuar desde el último elemento cargado.
**Sintaxis:**
```js
const pagina2 = await db.orm.public.Post.orderBy((p) => p.createdAt.asc())
  .cursor({ createdAt: last.createdAt })
  .limit(2)
  .all();
```

### `distinct()`
**Descripción:** *(Solo PostgreSQL)* Elimina filas duplicadas comparando solo los campos indicados.
**Ejemplos de uso:** Obtener una fila por cada valor distinto de una columna, como una por cada prioridad.
**Sintaxis:**
```js
const prioridades = await db.orm.public.Post.distinct('priority').all();
```

### `distinctOn()`
**Descripción:** *(Solo PostgreSQL)* Mantiene la primera fila por cada clave, según el orden definido con `orderBy()`.
**Ejemplos de uso:** Obtener el post más reciente de cada usuario.
**Sintaxis:**
```js
const ultimoPorUsuario = await db.orm.public.Post
  .orderBy([(p) => p.userId.asc(), (p) => p.createdAt.desc()])
  .distinctOn('userId')
  .all();
```

### `variant()`
**Descripción:** Restringe un modelo a una de sus variantes declaradas con `@@base` (herencia de modelos).
**Ejemplos de uso:** Obtener solo las tareas de tipo "Bug" dentro de un modelo genérico "Task".
**Sintaxis:**
```js
const bugs = await db.orm.public.Task.variant('Bug').all();
```

---

## 2. Métodos de lectura (ejecutan la consulta)

### `all()`
**Descripción:** Resuelve la consulta a todas las filas que coinciden. Equivale a `findMany` en Prisma 7.
**Ejemplos de uso:** Listar todos los usuarios, listar todos los posts de un autor, recorrer resultados en streaming.
**Sintaxis:**
```js
const usuarios = await db.orm.public.User.all();
// o en streaming:
for await (const user of db.orm.public.User.all()) { console.log(user.email); }
```

### `first()`
**Descripción:** Resuelve la consulta a la primera fila que coincide, o `null` si no hay ninguna. Equivale a `findUnique`/`findFirst` en Prisma 7.
**Ejemplos de uso:** Buscar un usuario por email, obtener el primer post urgente.
**Sintaxis:**
```js
const alice = await db.orm.public.User.first({ email: 'alice@example.com' });
```

### `firstOrThrow()`
**Descripción:** Método sobre el resultado de `all()` que devuelve la primera fila o lanza un error si no hay coincidencias. Equivale a `findUniqueOrThrow`/`findFirstOrThrow` en Prisma 7.
**Ejemplos de uso:** Cuando necesitás garantizar que el registro existe o cortar la ejecución con un error.
**Sintaxis:**
```js
const alice = await db.orm.public.User.where({ email }).all().firstOrThrow();
```

---

## 3. Métodos de escritura

### `create()`
**Descripción:** Inserta una sola fila y la devuelve. Ya no lleva el wrapper `data:` de Prisma 7.
**Ejemplos de uso:** Crear un usuario nuevo, crear un post y conectarlo a su autor en la misma operación.
**Sintaxis:**
```js
const tag = await db.orm.public.Tag.create({ label: 'typescript-2' });

// con relación anidada (connect):
const post = await db.orm.public.Post.create({
  title: 'Conectado a Bob',
  user: (user) => user.connect({ id: bobId }),
});
```

### `createAll()`
**Descripción:** Inserta múltiples filas y las devuelve. Reemplaza a `createMany` de Prisma 7 cuando necesitás los registros creados.
**Ejemplos de uso:** Carga masiva de datos, importar un lote de registros y trabajar con ellos.
**Sintaxis:**
```js
const creados = await db.orm.public.Tag.createAll([{ label: 'alpha' }, { label: 'beta' }]);
```

### `createAndCount()`
**Descripción:** Inserta filas y devuelve cuántas se insertaron, sin leerlas de vuelta. Reemplaza a `createMany` de Prisma 7 cuando solo te interesa el conteo.
**Ejemplos de uso:** Importaciones masivas donde solo necesitás saber cuántos registros entraron.
**Sintaxis:**
```js
const insertados = await db.orm.public.Tag.createAndCount([{ label: 'epsilon' }, { label: 'zeta' }]);
```

### `update()`
**Descripción:** Actualiza la fila que coincide con el filtro previo (`where()`) y la devuelve, o `null` si ninguna coincide.
**Ejemplos de uso:** Cambiar el nombre de un usuario, actualizar el estado de una tarea.
**Sintaxis:**
```js
const actualizado = await db.orm.public.User.where({ id: bobId }).update({ displayName: 'Bob Updated' });
```

### `updateAll()`
**Descripción:** Actualiza todas las filas que coinciden con el filtro y devuelve las filas actualizadas. Reemplaza a `updateMany` de Prisma 7.
**Ejemplos de uso:** Marcar todos los posts de un usuario como urgentes, cambiar el rol de varios usuarios a la vez.
**Sintaxis:**
```js
const actualizados = await db.orm.public.Post.where({ userId: aliceId }).updateAll({ priority: 'urgent' });
```

### `updateAndCount()`
**Descripción:** Actualiza todas las filas coincidentes y devuelve solo la cantidad modificada.
**Ejemplos de uso:** Saber cuántos registros se vieron afectados por una actualización masiva.
**Sintaxis:**
```js
const cantidad = await db.orm.public.Post.where({ userId: carolId }).updateAndCount({ priority: 'low' });
```

### `delete()`
**Descripción:** Elimina la fila que coincide con el filtro y la devuelve, o `null` si ninguna coincide.
**Ejemplos de uso:** Borrar un tag específico, eliminar un usuario por id.
**Sintaxis:**
```js
const eliminado = await db.orm.public.Tag.where({ id: tagId }).delete();
```

### `deleteAll()`
**Descripción:** Elimina todas las filas que coinciden con el filtro y devuelve las filas eliminadas. Reemplaza a `deleteMany` de Prisma 7.
**Ejemplos de uso:** Borrar todos los posts de un usuario, limpiar registros de prueba.
**Sintaxis:**
```js
const eliminados = await db.orm.public.Post.where({ userId: carolId }).deleteAll();
```

### `deleteAndCount()`
**Descripción:** Elimina todas las filas coincidentes y devuelve solo la cantidad eliminada.
**Ejemplos de uso:** Saber cuántos registros se borraron en una limpieza masiva.
**Sintaxis:**
```js
const cantidad = await db.orm.public.Post.where({ userId: carolId }).deleteAndCount();
```

### `upsert()`
**Descripción:** Inserta una fila si no existe una coincidente, o la actualiza si ya existe. En PostgreSQL usa `conflictOn` en vez de `where`.
**Ejemplos de uso:** Crear o actualizar la configuración de un usuario, sincronizar datos externos sin duplicar.
**Sintaxis:**
```js
const tag = await db.orm.public.Tag.upsert({
  create: { label: 'typescript' },
  update: { label: 'typescript-renamed' },
  conflictOn: { label: 'typescript' },
});
```

---

## 4. Agregaciones agrupadas *(solo PostgreSQL)*

### `aggregate()`
**Descripción:** Calcula agregados (count, sum, avg, min, max) sobre todas las filas que coinciden, tratándolas como un solo grupo.
**Ejemplos de uso:** Contar pedidos totales, sumar el monto de todas las órdenes de un cliente, calcular el promedio de ventas.
**Sintaxis:**
```js
const stats = await db.orm.public.Order.aggregate((agg) => ({
  total: agg.count(),
  montoTotal: agg.sum('amount'),
  promedio: agg.avg('amount'),
}));
```

### `groupBy()`
**Descripción:** Agrupa filas por uno o más campos para luego aplicar agregados por grupo. Reemplaza al `groupBy` con parámetro `by` de Prisma 7.
**Ejemplos de uso:** Total de pedidos por cliente, ventas totales por canal.
**Sintaxis:**
```js
const porCliente = await db.orm.public.Order.groupBy('customerId').aggregate((agg) => ({
  cantidadPedidos: agg.count(),
  montoTotal: agg.sum('amount'),
}));
```

### `having()`
**Descripción:** Filtra los grupos resultantes de `groupBy()` según una comparación sobre un agregado.
**Ejemplos de uso:** Encontrar clientes cuyo gasto total supera cierto monto, filtrar grupos con más de N registros.
**Sintaxis:**
```js
const grandesClientes = await db.orm.public.Order.groupBy('customerId')
  .having((h) => h.sum('amount').gt(1000))
  .aggregate((agg) => ({ montoTotal: agg.sum('amount') }));
```

---

## 5. Refinamientos dentro de `include()` *(solo PostgreSQL)*
Se usan **dentro** del callback de `include()`, sobre la relación cargada.

### `count()`
**Descripción:** Reduce una relación a la cantidad de filas relacionadas.
**Ejemplos de uso:** Mostrar cuántos posts tiene cada usuario.
**Sintaxis:**
```js
const usuarios = await db.orm.public.User.include('posts', (posts) => posts.count()).all();
```

### `sum()` / `avg()`
**Descripción:** Reduce una relación numérica a su suma o promedio.
**Ejemplos de uso:** Total gastado por cliente, promedio de monto por pedido dentro de la relación de un cliente.
**Sintaxis:**
```js
const clientes = await db.orm.public.Customer.include('orders', (orders) => orders.sum('amount')).all();
```

### `min()` / `max()`
**Descripción:** Reduce una relación a su valor mínimo o máximo (funciona con números, fechas, texto, etc.).
**Ejemplos de uso:** Fecha del post más antiguo de un usuario, monto máximo pedido por un cliente.
**Sintaxis:**
```js
const usuarios = await db.orm.public.User.include('posts', (posts) => posts.max('createdAt')).all();
```

### `combine()`
**Descripción:** Devuelve varios resultados a la vez (subconjuntos y agregados combinados) bajo una misma clave de relación.
**Ejemplos de uso:** Traer al mismo tiempo el total de posts y los 3 más recientes de un usuario.
**Sintaxis:**
```js
const usuarios = await db.orm.public.User.include('posts', (posts) =>
  posts.combine({
    recientes: posts.orderBy((p) => p.createdAt.desc()).limit(3),
    total: posts.count(),
  })
).all();
```

---

## 6. Operadores de filtro (PostgreSQL)
Se usan dentro del callback de `where()`, sobre un campo.

### `eq()` / `neq()`
**Descripción:** Igualdad y desigualdad exacta.
**Ejemplos de uso:** Buscar por email exacto, excluir un valor específico.
**Sintaxis:**
```js
const alice = await db.orm.public.User.where((u) => u.email.eq('alice@example.com')).first();
```

### `gt()` / `lt()` / `gte()` / `lte()`
**Descripción:** Comparaciones de orden (mayor, menor, mayor o igual, menor o igual).
**Ejemplos de uso:** Posts creados después de cierta fecha, productos con precio menor a un límite.
**Sintaxis:**
```js
const recientes = await db.orm.public.Post.where((p) => p.createdAt.gt(fecha)).all();
```

### `like()` / `ilike()`
**Descripción:** Coincidencia de patrón tipo SQL LIKE. `like` distingue mayúsculas, `ilike` no.
**Ejemplos de uso:** Buscar usuarios cuyo email termine en un dominio, búsqueda de texto parcial.
**Sintaxis:**
```js
const gmail = await db.orm.public.User.where((u) => u.email.like('%@gmail.com')).all();
```

### `in()` / `notIn()`
**Descripción:** Pertenece o no pertenece a una lista de valores.
**Ejemplos de uso:** Filtrar posts con prioridad "baja" o "alta", excluir ciertos estados.
**Sintaxis:**
```js
const filtrados = await db.orm.public.Post.where((p) => p.priority.in(['low', 'high'])).all();
```

### `isNull()` / `isNotNull()`
**Descripción:** Verifica si un campo es nulo o no.
**Ejemplos de uso:** Encontrar tareas sin descripción, usuarios con biografía completa.
**Sintaxis:**
```js
const sinDescripcion = await db.orm.public.Task.where((t) => t.description.isNull()).all();
```

### `and()` / `or()` / `not()` / `all()`
**Descripción:** Combinan o niegan condiciones (se importan desde el paquete del cliente, no son métodos de campo).
**Ejemplos de uso:** Combinar dos filtros con AND, buscar filas que cumplan una condición u otra, negar una condición.
**Sintaxis:**
```js
import { and, or, not, all } from '@prisma/orm-postgres/orm-client';

const ambas = await db.orm.public.Post.where((p) => and(p.priority.eq('low'), p.userId.eq(id))).all();
const cualquiera = await db.orm.public.Post.where((p) => or(p.priority.eq('urgent'), p.priority.eq('high'))).all();
const negado = await db.orm.public.Post.where((p) => not(p.priority.eq('low'))).all();
```

### `some()` / `every()` / `none()`
**Descripción:** Filtran filas "padre" según sus filas relacionadas (relaciones uno-a-muchos o uno-a-uno).
**Ejemplos de uso:** Usuarios que tienen al menos un post urgente, usuarios donde todos sus posts son de baja prioridad, usuarios sin ningún post urgente.
**Sintaxis:**
```js
const conUrgente = await db.orm.public.User.where((u) => u.posts.some((p) => p.priority.eq('urgent'))).all();
```

---

## 7. Filtros específicos de MongoDB

### `MongoFieldFilter` (`.eq`, `.neq`, `.gt`, `.lt`, `.gte`, `.lte`, `.in`, `.nin`, `.isNull`, `.isNotNull`, `.of`)
**Descripción:** Helpers para construir condiciones de filtro en MongoDB, ya que ahí `where()` no acepta callbacks como en PostgreSQL.
**Ejemplos de uso:** Buscar documentos por igualdad de campo, filtrar por rango de fechas, usar un operador nativo de MongoDB como `$regex`.
**Sintaxis:**
```js
import { MongoFieldFilter } from '@prisma/orm-mongo/query-ast/execution';

const alice = await db.orm.users.where(MongoFieldFilter.eq('email', 'alice@example.com')).first();
const recientes = await db.orm.posts.where(MongoFieldFilter.gte('createdAt', new Date('2024-01-02'))).all();
const conRegex = await db.orm.posts.where(MongoFieldFilter.of('title', '$regex', '^Hello')).all();
```

### `MongoAndExpr` / `MongoOrExpr` / `.and()` / `.not()`
**Descripción:** Combinan condiciones de MongoDB con AND/OR o las niegan.
**Ejemplos de uso:** Combinar dos condiciones con AND, buscar por nombre A o nombre B.
**Sintaxis:**
```js
import { MongoAndExpr, MongoOrExpr, MongoFieldFilter } from '@prisma/orm-mongo/query-ast/execution';

const ambas = await db.orm.users.where(
  MongoFieldFilter.eq('role', 'author').and(MongoFieldFilter.eq('name', 'Alice'))
).all();

const cualquiera = await db.orm.users.where(
  MongoOrExpr.of([MongoFieldFilter.eq('name', 'Alice'), MongoFieldFilter.eq('name', 'Bob')])
).all();
```

### `MongoExistsExpr` (`.exists`, `.notExists`)
**Descripción:** Verifica si un campo está presente en el documento (independientemente de si es nulo).
**Ejemplos de uso:** Encontrar usuarios que tienen el campo "bio" definido.
**Sintaxis:**
```js
import { MongoExistsExpr } from '@prisma/orm-mongo/query-ast/execution';
const conBio = await db.orm.users.where(MongoExistsExpr.exists('bio')).all();
```

---

## 8. Operaciones de actualización de campo (solo MongoDB)
Se usan dentro del callback de `update()`, `updateAll()`, `updateAndCount()` o `upsert()` en MongoDB.

### `set()`
**Descripción:** Asigna un valor a un campo.
**Ejemplos de uso:** Cambiar la biografía de un usuario, actualizar un título.
**Sintaxis:**
```js
await db.orm.users.where({ _id: id }).update((u) => [u.bio.set('Nueva bio')]);
```

### `unset()`
**Descripción:** Elimina un campo del documento.
**Ejemplos de uso:** Borrar la biografía de un usuario sin dejarla en null.
**Sintaxis:**
```js
await db.orm.users.where({ _id: id }).update((u) => [u.bio.unset()]);
```

### `inc()`
**Descripción:** Incrementa un campo numérico en la cantidad indicada.
**Ejemplos de uso:** Sumar puntos a un contador, incrementar la duración de un tutorial.
**Sintaxis:**
```js
await db.orm.posts.where({ _id: id }).update((u) => [u.duration.inc(10)]);
```

### `mul()`
**Descripción:** Multiplica un campo numérico por el valor indicado.
**Ejemplos de uso:** Duplicar un precio, aplicar un descuento porcentual sobre un campo.
**Sintaxis:**
```js
await db.orm.posts.where({ _id: id }).update((u) => [u.duration.mul(3)]);
```

### `push()`
**Descripción:** Agrega un elemento al final de un campo tipo arreglo.
**Ejemplos de uso:** Añadir una etiqueta a la lista de tags de un usuario.
**Sintaxis:**
```js
await db.orm.users.where({ _id: id }).update((u) => [u.tags.push('admin')]);
```

### `addToSet()`
**Descripción:** Agrega un elemento a un arreglo solo si todavía no está presente.
**Ejemplos de uso:** Agregar un rol sin duplicarlo si ya existe.
**Sintaxis:**
```js
await db.orm.users.where({ _id: id }).update((u) => [u.tags.addToSet('admin')]);
```

### `pull()`
**Descripción:** Elimina de un arreglo todos los elementos que coincidan con el valor dado.
**Ejemplos de uso:** Quitar una etiqueta específica de la lista de tags.
**Sintaxis:**
```js
await db.orm.users.where({ _id: id }).update((u) => [u.tags.pull('draft')]);
```

### `pop()`
**Descripción:** Elimina el primer o el último elemento de un arreglo (`1` para el último, `-1` para el primero).
**Ejemplos de uso:** Quitar el último ítem agregado a una cola.
**Sintaxis:**
```js
await db.orm.users.where({ _id: id }).update((u) => [u.tags.pop(1)]);
```

---

## 9. Relaciones anidadas (dentro de `create()` / `update()`, PostgreSQL)

### `connect()`
**Descripción:** Vincula una fila existente como relacionada, en lugar de crear una nueva.
**Ejemplos de uso:** Asignar un post a un autor ya existente, vincular un pedido a un cliente existente.
**Sintaxis:**
```js
const post = await db.orm.public.Post.create({
  title: 'Nuevo post',
  user: (user) => user.connect({ id: bobId }),
});
```

### `disconnect()`
**Descripción:** Elimina el vínculo entre dos filas relacionadas sin borrar ninguna de las dos (útil en relaciones muchos-a-muchos).
**Ejemplos de uso:** Quitar un tag de un post sin eliminar el tag.
**Sintaxis:**
```js
const actualizado = await db.orm.public.Post.where({ id: postId })
  .update({ tags: (tag) => tag.disconnect([{ id: tagId }]) });
```

---

## 10. Utilidades de resultado

### `toArray()`
**Descripción:** Convierte un `AsyncIterableResult` (lo que devuelven `all()`, `createAll()`, `updateAll()`, `deleteAll()`) a un arreglo. Equivale a hacer `await` sobre el resultado.
**Ejemplos de uso:** Obtener todos los resultados como array después de haber iniciado la consulta.
**Sintaxis:**
```js
const resultado = db.orm.public.User.all();
const usuarios = await resultado.toArray();
```

---

## Tabla resumen: equivalencias con Prisma ORM 7

| Prisma ORM 7 | Prisma ORM 8 |
|---|---|
| `findMany()` | `.all()` |
| `findUnique()` / `findFirst()` | `.first()` |
| `findUniqueOrThrow()` / `findFirstOrThrow()` | `.all().firstOrThrow()` |
| `create({ data })` | `.create({...})` (sin wrapper `data`) |
| `createMany()` | `.createAll()` o `.createAndCount()` |
| `update({ where, data })` | `.where(...).update({...})` |
| `updateMany()` | `.updateAll()` o `.updateAndCount()` |
| `delete({ where })` | `.where(...).delete()` |
| `deleteMany()` | `.deleteAll()` o `.deleteAndCount()` |
| `upsert()` | `.upsert({ create, update, conflictOn })` |
| `count()` | `.aggregate((a) => ({ n: a.count() }))` |
| `aggregate()` (`_sum`, `_avg`...) | `.aggregate((agg) => ({...}))` |
| `groupBy({ by: [...] })` | `.groupBy(...).aggregate(...)` |
| `is` / `isNot` en relación uno-a-uno | `.some()` / `.none()` |

---

**Fuente:** Documentación oficial de Prisma (docs.prisma.io/orm/v8/reference/orm-client), consultada el 15 de septiembre de 2026. Como Prisma 8 sigue en RC, algunos detalles pueden cambiar antes de la versión estable final.
