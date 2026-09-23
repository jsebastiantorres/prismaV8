# Guía: Vistas y funciones de PostgreSQL en Prisma ORM 8 (RC)

> ⚠️ Prisma ORM 8 sigue en **Release Candidate**. Esta guía complementa a `prisma-v8-metodos.md` (métodos generales del ORM client) enfocándose específicamente en **vistas** y **funciones de PostgreSQL**.

---

## Mapa mental: 3 formas de traer datos que no son una tabla simple

| Necesidad                                              | Herramienta                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Vista que consultás seguido, forma parte de tu dominio | **Mapearla en el contrato** con `@@control(external)`                         |
| Vista puntual, exploratoria, de un solo uso            | **`db.raw.sql`** sin tocar el contrato                                        |
| Función de PostgreSQL (built-in o tuya)                | **`fns.raw` / `db.raw.sql`** — no hay superficie tipada nativa para funciones |

---

# Parte 1 — Vistas

## 1.1 Mapear una vista en el contrato

Se declara como un `model` normal, apuntando al nombre real de la vista con `@@map`, y usando `@@control` para que Prisma nunca intente gestionarla con migraciones.

```prisma
// src/prisma/contract.prisma
// use prisma-8

enum MpaaRating {
  @@type("pg/text@1")
  G     = "G"
  PG    = "PG"
  PG_13 = "PG-13"
  R     = "R"
  NC_17 = "NC-17"
}

model FilmList {
  fid         Int             @id
  title       VarChar(255)
  description String?
  category    VarChar(25)?
  price       Numeric(4, 2)?
  length      SmallInt?
  rating      MpaaRating?
  actors      String?

  @@map("film_list")
  @@control(external)
}
```

### Las 4 opciones de `@@control`

| Valor               | `db verify`                                                            | Migraciones                       | Uso típico                            |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------- | ------------------------------------- |
| `managed` (default) | Debe coincidir exacto                                                  | Crea/altera/borra                 | Tablas normales de tu app             |
| `tolerated`         | Columnas declaradas deben coincidir; extra se acepta                   | Crea si falta; nunca altera/borra | Tablas semi-externas                  |
| **`external`**      | Columnas declaradas deben coincidir; ignora extra columnas/constraints | **Nunca la toca**                 | ✅ Vistas estables                    |
| **`observed`**      | Cualquier cosa vale; mismatch = warning, no error                      | **Nunca la toca**                 | ✅ Vistas inestables o de otro equipo |

### Consultarla como cualquier modelo

```js
// Filtrando
const accion = await db.orm.public.FilmList.where((f) =>
  f.category.eq("Action"),
).all();

// Sin filtro, eligiendo columnas
const resumen = await db.orm.public.FilmList.select("title", "rating", "actors")
  .orderBy((f) => f.title.asc())
  .all();

// Sin filtro, todas las columnas
const todas = await db.orm.public.FilmList.all();
```

**Ventajas:** tipado end-to-end, se integra con `where()`/`select()`/`orderBy()`/`limit()`, `db verify` te avisa si la vista cambió de forma, un solo lugar de verdad si varias partes del código la consultan.

**Limitación importante:** una vista normalmente no admite `.create()`/`.update()`/`.delete()` (salvo que sea una vista simple y actualizable de Postgres) — tratala como solo lectura y evitá esos métodos.

## 1.2 Consultar una vista sin mapearla (raw)

Para algo puntual, sin declarar nada en el contrato:

```js
const plan = db.raw.sql`
  SELECT * FROM film_list WHERE category = ${"Action"}
`
  .returnsRow({
    fid: "pg/int4@1",
    title: "pg/text@1",
    rating: "pg/text@1",
  })
  .build();

const rows = await runtime.query(plan);
```

Útil para scripts, debugging o reportes que no vas a repetir. Si te encontrás copiando el mismo `db.raw.sql` en más de un lugar, es la señal de pasar a mapearla en el contrato.

## 1.3 Inferir el contrato desde una base ya existente

Si no estás seguro de los tipos exactos de columnas de la vista:

```bash
npx prisma contract infer
```

Esto lee la estructura real de la base y genera un `contract.prisma` de arranque. **Ojo:** probablemente infiera la vista como `managed` por default (porque no distingue vistas de tablas físicas) — tenés que agregarle `@@control(external)` a mano después.

---

# Parte 2 — Funciones de PostgreSQL

Prisma 8 **no tiene una superficie tipada para llamar funciones** (ni built-in de Postgres, como `now()` o `extract()`, ni funciones propias / stored procedures). Siempre se llaman a través de raw SQL: `fns.raw` (dentro de un builder) o `db.raw.sql` (statement completo).

## 2.1 Llamar una función built-in dentro de un `select()`

`fns.raw` es un tagged template disponible en el callback de `select()`. Se usa junto con `.returns(typeId)` para declarar el tipo del resultado.

```js
const plan = db.sql.public.user
  .select("id")
  .select("upperEmail", (f, fns) =>
    fns.raw`UPPER(${f.email})`.returns("pg/text@1"),
  )
  .where((f, fns) => fns.eq(f.id, userId))
  .build();

const rows = await runtime.query(plan);
// rows[0].upperEmail === 'ALICE@EXAMPLE.COM'
```

**Ejemplo con `extract()`** (un caso clásico que el ORM client no cubre nativamente):

```js
const plan = db.sql.public.appointment
  .select("id")
  .where((f, fns) =>
    fns.raw`EXTRACT(MONTH FROM ${f.timestamp}) = ${2}`.returns("pg/bool@1"),
  )
  .build();

const rows = await runtime.query(plan);
// citas del mes de febrero
```

## 2.2 Llamar una función como statement completo con `db.raw.sql`

Cuando la función es lo único que necesitás correr (no es parte de una consulta sobre una tabla):

```js
const serverNow = db.raw.sql`now()`.returns("pg/timestamptz-temporal@1");

const plan = db.sql.public.user
  .select((f) => ({ id: f.id, serverNow }))
  .where((f, fns) => fns.eq(f.id, userId))
  .build();

const rows = await runtime.query(plan);
```

## 2.3 Llamar una función propia (custom function / stored procedure)

Si tenés una función definida en la base, se invoca igual que cualquier expresión SQL — Prisma no distingue entre función nativa y función tuya:

```sql
-- función ya creada en la base
CREATE FUNCTION full_name(first text, last text) RETURNS text AS $$
  SELECT first || ' ' || last;
$$ LANGUAGE sql IMMUTABLE;
```

```js
const plan = db.sql.public.user
  .select("id")
  .select("fullName", (f, fns) =>
    fns.raw`full_name(${f.firstName}, ${f.lastName})`.returns("pg/text@1"),
  )
  .build();

const rows = await runtime.query(plan);
```

Para una función que **devuelve filas** (`RETURNS TABLE` o `RETURNS SETOF`), usás `db.raw.sql` con `.returnsRow(spec)`:

```js
const plan = db.raw.sql`SELECT * FROM get_top_films(${10})`
  .returnsRow({
    fid: "pg/int4@1",
    title: "pg/text@1",
    rentalCount: "pg/int8@1",
  })
  .build();

const rows = await runtime.query(plan);
```

Para un procedimiento que **no devuelve filas** (un `CALL`, o una función que solo modifica datos):

```js
const plan = db.raw.sql`CALL refresh_film_stats()`.affectedCount().build();
const stats = await runtime.execute(plan);
```

## 2.4 Reglas de seguridad al interpolar (repaso)

- Un valor interpolado con `${...}` va como **parámetro vinculado**, nunca como texto pegado en el SQL — así te protegés de SQL injection.
- Un **nombre de columna o función no se puede interpolar como string** — si el nombre de la función es dinámico, resolvelo vos mismo desde una lista fija en tu código, nunca lo metas directo del input del usuario.
- Para tipos no básicos (fechas, decimales con codec específico), usá `param(valor, { codecId })` importado de `@prisma/orm-postgres/relational-core/expression`.

```js
import { param } from "@prisma/orm-postgres/relational-core/expression";

const cutoff = param(Temporal.Instant.from("2024-01-01T00:00:00Z"), {
  codecId: "pg/timestamptz-temporal@1",
});
const plan = db.sql.public.user
  .where((f, fns) => fns.raw`${f.createdAt} > ${cutoff}`.returns("pg/bool@1"))
  .build();
```

---

# Parte 3 — Filtros y operadores (repaso de referencia)

Se usan dentro del callback de `.where()` sobre un campo (`f`), en el query builder de PostgreSQL.

| Método                                  | Qué hace                                                  |
| --------------------------------------- | --------------------------------------------------------- |
| `.eq()` / `.neq()`                      | Igual / distinto                                          |
| `.gt()` / `.lt()` / `.gte()` / `.lte()` | Mayor, menor, mayor o igual, menor o igual                |
| `.like()` / `.ilike()`                  | Coincidencia de patrón (con/sin distinción de mayúsculas) |
| `.in()` / `.notIn()`                    | Pertenece / no pertenece a una lista                      |
| `.isNull()` / `.isNotNull()`            | Es nulo / no es nulo                                      |
| `and()` / `or()` / `not()`              | Combinan o niegan condiciones (se importan aparte)        |
| `.some()` / `.every()` / `.none()`      | Filtran por filas relacionadas (relaciones uno-a-muchos)  |

```js
import { and, or, not } from "@prisma/orm-postgres/orm-client";

const filtradas = await db.orm.public.FilmList.where((f) =>
  and(f.category.eq("Action"), f.rating.in(["PG", "PG-13"])),
).all();
```

---

# Parte 4 — Métodos de consulta y ejecución (repaso de referencia)

| Método                                | Función                                     |
| ------------------------------------- | ------------------------------------------- |
| `.select(...)`                        | Elige columnas específicas                  |
| `.where(...)`                         | Filtra filas                                |
| `.orderBy(...)`                       | Ordena resultado                            |
| `.limit(n)` / `.offset(n)`            | Paginación clásica                          |
| `.cursor(...)`                        | Paginación por cursor (PostgreSQL)          |
| `.distinct(...)` / `.distinctOn(...)` | Elimina duplicados                          |
| `.all()`                              | Ejecuta y devuelve todas las filas          |
| `.first()`                            | Ejecuta y devuelve la primera fila o `null` |
| `.all().firstOrThrow()`               | Primera fila o lanza error                  |

---

# Parte 5 — Árbol de decisión rápido

```
¿Es una tabla normal de tu app?
├─ Sí → model con @@control(managed) (default) + métodos del ORM client
└─ No, es una VISTA
   ├─ ¿La consultás seguido / es parte del dominio?
   │  └─ Sí → mapeala con @@control(external) u observed
   │  └─ No, es puntual/exploratoria → db.raw.sql sin mapear
   └─ ¿Necesitás llamar una FUNCIÓN de Postgres (nativa o propia)?
      └─ Siempre → fns.raw (dentro de un builder) o db.raw.sql (statement suelto)
```

---

**Fuente:** Documentación oficial de Prisma (docs.prisma.io/orm/v8), consultada el 22 de septiembre de 2026. Prisma 8 sigue en RC — revisá cambios antes de usar en producción.
