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
  - Versión limpia y autocontenida: tabla HTML con r/w por celda (schedule del Problema 1) + un **grafo SVG** dibujado con nodos y flechas (T5→T2/T4/T1, T4→T1/T3, T2→T1, T7 aislado).
  - **Las fotos de pizarra se RETIRARON a petición del usuario** (no se publican en la app). Las imágenes `PXL_*.jpg` quedan en local pero están en `.gitignore` y NO se trackean ni se suben.
  - Nuevo campo `guia` en el bloque `tema3`; `renderProblemas` lo pinta antes de la lista. Nuevo CSS: `.metodo-card`, `.svg-graph` (se eliminaron `.bb-photo`/`.bb-cap`).
  - Verificado en navegador (Playwright): tarjeta abierta, SVG (6 nodos/6 aristas), tabla (7 filas), 0 imágenes. Sin errores de consola salvo favicon 404.

## Siguiente paso
- **DESPLEGAR en https://upo.digital/plssql/ por PuTTY/SSH (SCP)**. Ese sitio NO es GitHub Pages; corre sobre **LiteSpeed** (tipo cPanel) y se actualiza por separado. El push a GitHub NO lo actualiza.
  - Método acordado con el usuario: subir por **PuTTY** (pscp/psftp/scp por SSH) a la carpeta `/plssql/` del host. **SIN las fotos.**
  - Ficheros a subir: `index.html`, `style.css`, `app.js`, `exam_data.js`, `exam_catalog.json`.
  - Falta confirmar credenciales/host SSH (no hay sesión PuTTY ni clave guardada localizada todavía).
- Posible mejora futura: añadir más problemas/auto-evaluación al Tema 3; aplicar el mismo grafo SVG a los Problemas 1–7.
