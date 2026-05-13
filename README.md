# PL/SQL Interactivo — Arquitectura de Bases de Datos

Aplicación web estática para estudiar y repasar los conceptos de **PL/SQL** cubiertos en las EPDs 5–11 de la asignatura Arquitectura de Bases de Datos.

## Cómo usar

Abre `index.html` directamente en el navegador — no necesita servidor ni instalación.

Para publicar en GitHub Pages: sube los tres archivos (`index.html`, `style.css`, `app.js`) a un repositorio público y activa Pages desde `Settings → Pages → Branch: main / root`.

## Bloques de contenido

| Bloque | Tema |
|--------|------|
| EPD5 | Introducción — bloques, tipos de datos, variables, `%TYPE`, `%ROWTYPE`, `SELECT INTO` |
| EPD6 | Control de flujo — `IF/ELSIF/ELSE`, `CASE`, `LOOP`, `WHILE`, `FOR` |
| EPD7 | Funciones SQL y cursores — funciones predefinidas, cursores explícitos/implícitos |
| EPD8 | Tratamiento de errores — excepciones predefinidas, `RAISE`, `RAISE_APPLICATION_ERROR` |
| EPD9 | Procedimientos y funciones — `CREATE PROCEDURE/FUNCTION`, modos `IN/OUT/IN OUT` |
| EPD10 | Paquetes — especificación, cuerpo, ámbitos, sobrecarga, matrices asociativas |
| EPD11 | Repaso integrado — ejercicios completos sobre la librería `ST_PK_BOOKS` |

## Tipos de ejercicio

- **Teoría** — tarjetas con explicaciones, tablas y código con resaltado de sintaxis
- **Test** — preguntas de opción múltiple con feedback inmediato
- **Rellena** — fragmentos de código con huecos para completar
- **¿Qué falta?** — identifica la línea o cláusula incorrecta/ausente
- **Ordena** — construye el bloque PL/SQL colocando líneas en el orden correcto
- **¿Qué cambiarías?** — analiza cómo adaptar el código ante un nuevo requisito

## Estructura del proyecto

```
index.html   — estructura HTML (SPA shell)
style.css    — tema oscuro, componentes UI
app.js       — lógica, datos de los 7 bloques y motor de ejercicios
```
