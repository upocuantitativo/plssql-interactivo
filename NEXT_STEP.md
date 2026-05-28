# Estado del proyecto — PL/SQL Interactivo / ABD

## Hecho
- App SPA estática (index.html + style.css + app.js) con 7 prácticas de PL/SQL (PR1–PR7) y modo Examen (exam_data.js / exam_catalog.json).
- **Nuevo bloque "Tema 3: Concurrencia"** añadido al menú izquierdo, basado en `ABD-EB-Chapter3.pdf` y `Ejercicios1_ABDTema3.pdf`:
  - Pestaña **Teoría**: transacciones, ACID/BASE, planificaciones, conflictos, grafo de precedencia, bloqueo en dos fases (2PL), Oracle multiversión y MongoDB.
  - Pestaña **Verdadero / Falso razonado**: 14 afirmaciones con explicación (puntúan en la barra global).
  - Pestaña **Problemas resueltos**: los 9 problemas del boletín, cada uno con solución desplegable paso a paso (grafos, matrices de bloqueo, veredictos).
- Sistema de pestañas hecho configurable por bloque (`tabs` + `tabLabels`); nuevos tipos `vf` y `problemas`; puntuación global ampliada con `vf`.
- Verificado en navegador (Playwright): renderizado, interacción V/F y despliegue de soluciones OK. Sin errores de consola (salvo favicon 404).

## Hecho (cont.)
- **Guía "paso a paso" en Problemas resueltos del Tema 3**: tarjeta destacada (abierta por defecto) al inicio de la pestaña que explica, paso a paso, cómo construir la **tabla de accesos** (transacción × dato) y el **grafo de precedencia**.
  - Incluye una versión limpia: tabla HTML con r/w por celda (schedule del Problema 1) + un **grafo SVG** dibujado con nodos y flechas (T5→T2/T4/T1, T4→T1/T3, T2→T1, T7 aislado).
  - Incluye las **dos fotos de pizarra** como referencia real: `PXL_20260511_153437008.jpg` (tabla, schedule del Problema 5) y `PXL_20260511_152023812.jpg` (grafo, schedule del Problema 1).
  - Nuevo campo `guia` en el bloque `tema3`; `renderProblemas` lo pinta antes de la lista. Nuevo CSS: `.metodo-card`, `.bb-photo`, `.bb-cap`, `.svg-graph`.
  - Verificado en navegador (Playwright): tarjeta abierta, SVG (6 nodos/6 aristas), tabla (7 filas) y ambas fotos cargan. Sin errores de consola salvo favicon 404.

## Siguiente paso
- **PENDIENTE: desplegar en https://upo.digital/plssql/** — ese sitio NO es GitHub Pages; corre sobre **LiteSpeed** (hosting tipo cPanel) que se actualiza por separado (FTP/SFTP/cPanel). El push a GitHub NO lo actualiza. Faltan credenciales/método de subida (no hay nada guardado en el repo ni en `~/.ssh`).
  - Ficheros a subir a ese host (raíz `/plssql/`): `index.html`, `style.css`, `app.js`, `exam_data.js`, `exam_catalog.json` **y AHORA TAMBIÉN las 2 imágenes** `PXL_20260511_153437008.jpg` y `PXL_20260511_152023812.jpg` (si no, los `<img>` darán 404 en producción).
- Posible mejora futura: añadir más problemas/auto-evaluación al Tema 3; aplicar el mismo grafo SVG a los Problemas 1–7.
