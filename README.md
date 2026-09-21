1. inicializar proyecto con node
2. configurar el package (scripts, type..)
3. instalar prisma -- npm install @prisma/adapter-pg
4. npm install prisma --save-dev
5. npm install @prisma/client
6. Comando de instalacion para postgresql npm install pg
7. Inicializar npx prisma init (instala las carpetas de los agentes de IA)
8. crea la carpeta y schema.prisma: npx prisma orm init
9. crear el .env para manejar la URL de postgresql


10. migrar la base de datos: npx prisma contract infer --output ./src/prisma/contract.prisma
Esto migra y crea los modelos dentro del contracto contract.prisma


11. Genera los tipos y el cliente Una vez que termine y veas tus tablas escritas en el archivo, 
compila el contrato para actualizar tu cliente de Node.js:bash

npx prisma contract emit

Debes ejecutarlo cada vez que realices un cambio en la estructura de tus modelos o esquemas. Al actualizar tu código o tus archivos de base de datos, este comando asegura que las herramientas de planificación de migraciones tengan el JSON mapeado de manera precisa con el cual comparar los cambios (diffs) entre el estado actual y el deseado.

Con Prisma 8, ya no importas un new PrismaClient() genérico. El comando emit te habrá generado un archivo de base de datos listo para usar en la ruta src/prisma/db.ts



12. crear el archivo de conexión a la base de datos y conectar Prisma con tus rutas de Express
13. configurar el db.ts con la sintaxis para JS


14. Instalacion npm install express
npm install express


15. npm install --save-dev nodemon

16. configuracion del servidor app.js con los import de expres, db de prisma

17. instalar polyfill para inyectar la compatibilidad global
npm install temporal-polyfill
importar en db.ts
import "temporal-polyfill/full/global"; 

