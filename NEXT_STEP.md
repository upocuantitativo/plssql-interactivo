# Estado del proyecto — PL/SQL Interactivo / ABD

## Hecho
- App SPA estática (index.html + style.css + app.js) con 7 prácticas de PL/SQL (PR1–PR7) y modo Examen (exam_data.js / exam_catalog.json).
- **Nuevo bloque "Tema 3: Concurrencia"** añadido al menú izquierdo, basado en `ABD-EB-Chapter3.pdf` y `Ejercicios1_ABDTema3.pdf`:
  - Pestaña **Teoría**: transacciones, ACID/BASE, planificaciones, conflictos, grafo de precedencia, bloqueo en dos fases (2PL), Oracle multiversión y MongoDB.
  - Pestaña **Verdadero / Falso razonado**: 14 afirmaciones con explicación (puntúan en la barra global).
  - Pestaña **Problemas resueltos**: los 9 problemas del boletín, cada uno con solución desplegable paso a paso (grafos, matrices de bloqueo, veredictos).
- Sistema de pestañas hecho configurable por bloque (`tabs` + `tabLabels`); nuevos tipos `vf` y `problemas`; puntuación global ampliada con `vf`.
- Verificado en navegador (Playwright): renderizado, interacción V/F y despliegue de soluciones OK. Sin errores de consola (salvo favicon 404).

## Siguiente paso
- Cambios commiteados y subidos a GitHub (`origin/master` → upocuantitativo/plssql-interactivo).
- **PENDIENTE: desplegar en https://upo.digital/plssql/** — OJO: ese sitio NO es GitHub Pages, corre sobre un servidor **LiteSpeed** (hosting tipo cPanel) que se actualiza por separado (FTP/SFTP/cPanel). El push a GitHub no lo actualiza. Hay que subir manualmente a ese host los ficheros: `index.html`, `style.css`, `app.js`, `exam_data.js`, `exam_catalog.json`.
- Posible mejora futura: representar los grafos de precedencia con un dibujo SVG en lugar de lista de aristas; añadir más problemas/auto-evaluación al Tema 3.
