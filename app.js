'use strict';

// ============================================================
// SYNTAX HIGHLIGHTER
// ============================================================
const KWS = new Set(['DECLARE','BEGIN','END','IF','THEN','ELSIF','ELSE','CASE','WHEN',
  'LOOP','EXIT','WHILE','FOR','IN','RETURN','PROCEDURE','FUNCTION','PACKAGE','BODY',
  'EXCEPTION','RAISE','CURSOR','IS','AS','OF','SELECT','INTO','FROM','WHERE','AND','OR',
  'NOT','NULL','INSERT','UPDATE','DELETE','SET','VALUES','COMMIT','ROLLBACK','SAVEPOINT',
  'OPEN','FETCH','CLOSE','CREATE','DROP','TYPE','RECORD','TABLE','INDEX','BY','REVERSE',
  'CONTINUE','OTHERS','CONSTANT','DEFAULT','HAVING','GROUP','ORDER','REPLACE','TRUE','FALSE',
  'NUMBER','VARCHAR2','CHAR','DATE','BOOLEAN','BLOB','CLOB','LONG','RAW','NATURAL','POSITIVE',
  'BINARY_INTEGER','PLS_INTEGER','FLOAT','SIGNTYPE','ROWTYPE','FOUND','NOTFOUND','ISOPEN',
  'ROWCOUNT','OUT','ROWNUM','BETWEEN','LIKE','DISTINCT','ALL','COUNT','SUM','AVG','MIN','MAX']);

const FNS = new Set(['DBMS_OUTPUT','PUT_LINE','UPPER','LOWER','LENGTH','SUBSTR','REPLACE',
  'CONCAT','INITCAP','RTRIM','LTRIM','TRIM','ABS','POWER','LOG','ROUND','TRUNC','MOD',
  'TO_CHAR','TO_DATE','TO_NUMBER','ADD_MONTHS','LAST_DAY','CURRENT_DATE','SYSDATE',
  'NVL','NVL2','DECODE','GREATEST','LEAST','COALESCE','RAISE_APPLICATION_ERROR',
  'SQLCODE','SQLERRM']);

function hl(raw){
  if(!raw)return '';
  const esc=raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let out='',i=0;
  while(i<esc.length){
    // single-line comment
    if(esc[i]==='-'&&esc[i+1]==='-'){
      const nl=esc.indexOf('\n',i);
      const t=nl<0?esc.slice(i):esc.slice(i,nl);
      out+=`<span class="cmt">${t}</span>`;i+=t.length;continue;
    }
    // block comment
    if(esc[i]==='/'&&esc[i+1]==='*'){
      const end=esc.indexOf('*/',i+2);
      const t=end<0?esc.slice(i):esc.slice(i,end+2);
      out+=`<span class="cmt">${t}</span>`;i+=t.length;continue;
    }
    // string literal
    if(esc[i]==="'"){
      let j=i+1;
      while(j<esc.length){if(esc[j]==="'"&&esc[j+1]==="'")j+=2;else if(esc[j]==="'"){j++;break;}else j++;}
      out+=`<span class="str">${esc.slice(i,j)}</span>`;i=j;continue;
    }
    // word
    if(/[A-Za-z_%$#@]/.test(esc[i])){
      let j=i;
      while(j<esc.length&&/[\w$#%@.]/.test(esc[j]))j++;
      const w=esc.slice(i,j);
      const wu=w.toUpperCase().replace('%TYPE','').replace('%ROWTYPE','');
      if(w.includes('%'))out+=`<span class="tp">${w}</span>`;
      else if(FNS.has(wu))out+=`<span class="fn">${w}</span>`;
      else if(KWS.has(wu))out+=`<span class="kw">${w}</span>`;
      else out+=w;
      i=j;continue;
    }
    // number
    if(/\d/.test(esc[i])&&(i===0||!/\w/.test(esc[i-1]))){
      let j=i;while(j<esc.length&&/[\d.]/.test(esc[j]))j++;
      out+=`<span class="num">${esc.slice(i,j)}</span>`;i=j;continue;
    }
    out+=esc[i];i++;
  }
  return out;
}

function codeBlock(src){
  return `<pre>${hl(src)}</pre>`;
}

// Fill-in-the-blank: marks {1},{2}... → input fields
function fillTemplate(tpl,idx){
  return tpl.replace(/\{(\d+)\}/g,(_,n)=>
    `<input class="fill-inp" data-ex="${idx}" data-b="${n}" size="10" autocomplete="off" spellcheck="false">`);
}

// ============================================================
// DATA — 7 BLOCKS
// ============================================================
const BLOCKS = [

// ─────────────────────────────────────────────────────────────
// EPD5: INTRODUCCIÓN A PL/SQL
// ─────────────────────────────────────────────────────────────
{id:'epd5',tag:'PR 1',title:'Introducción a PL/SQL',
 desc:'Bloques, tipos de datos, variables, %TYPE, %ROWTYPE, SELECT INTO y salida',
 teoria:[
  {title:'¿Qué es PL/SQL?',html:`
<p>PL/SQL es el lenguaje <strong>procedural de Oracle</strong> que extiende el SQL estándar añadiendo estructuras de programación de tercera generación: variables, condicionales, bucles, subprogramas y gestión de errores.</p>
<p>Los módulos de PL/SQL se dividen en tres categorías:</p>
<ul>
  <li><strong>Subprogramas:</strong> Procedimientos (no devuelven valor) y Funciones (devuelven un valor).</li>
  <li><strong>Paquetes:</strong> Conjunto de subprogramas agrupados como una biblioteca.</li>
  <li><strong>Triggers:</strong> Código que se invoca automáticamente ante un evento (INSERT, UPDATE, DELETE…). No se pueden invocar explícitamente.</li>
</ul>
<p>Una vez creados, estos módulos se almacenan <strong>compilados</strong> en el diccionario de datos de Oracle.</p>`},
  {title:'Estructura del bloque PL/SQL',html:`
<p>La unidad básica de PL/SQL es el <strong>bloque</strong>. Los bloques pueden anidarse.</p>
${codeBlock(`[<<etiqueta>>]       -- opcional
DECLARE              -- Sección declarativa (opcional)
  -- variables, cursores, tipos...
BEGIN                -- Sección ejecutable (OBLIGATORIA)
  -- instrucciones
[EXCEPTION           -- Sección de errores (opcional)
  WHEN ... THEN ...]
END;
/`)}
<div class="tag-info">💡 La barra <code>/</code> al final ejecuta el bloque desde un script SQL. Todas las sentencias terminan en punto y coma <code>;</code>. Hay dos tipos de comentarios: <code>-- línea</code> y <code>/* bloque */</code>.</div>`},
  {title:'Tipos de datos en PL/SQL',html:`
<table>
  <tr><th>Tipo</th><th>Descripción</th></tr>
  <tr><td><strong>NUMBER(s,p)</strong></td><td>Numérico entero o decimal. Precisión de 1 a 38.</td></tr>
  <tr><td><strong>VARCHAR2(n)</strong></td><td>Cadena de longitud variable (máx. n caracteres).</td></tr>
  <tr><td><strong>CHAR(n)</strong></td><td>Cadena de longitud fija.</td></tr>
  <tr><td><strong>DATE</strong></td><td>Fecha y hora.</td></tr>
  <tr><td><strong>BOOLEAN</strong></td><td>Solo en PL/SQL. Valores: TRUE, FALSE, NULL.</td></tr>
  <tr><td><strong>BLOB</strong></td><td>Datos binarios hasta 4 GB.</td></tr>
  <tr><td><strong>BINARY_INTEGER</strong></td><td>Entero optimizado para índices de bucle FOR.</td></tr>
</table>
<p>Los <strong>literales booleanos</strong> (TRUE/FALSE/NULL) solo se usan en PL/SQL, no en SQL estándar.</p>`},
  {title:'Declaración de variables',html:`
<p>Las variables se declaran en la sección <code>DECLARE</code>:</p>
${codeBlock(`DECLARE
  v_salary    NUMBER(8,2);
  v_name      VARCHAR2(20) := 'SMITH';  -- con valor inicial
  v_activo    BOOLEAN := TRUE;
  MAX_SIZE    CONSTANT NUMBER := 100;   -- constante
  v_x         NUMBER NOT NULL := 0;    -- no puede ser NULL`)}
<p>El operador de asignación es <code>:=</code>. Las variables no inicializadas reciben <strong>NULL</strong> por defecto.</p>
<p><strong>%TYPE</strong> — hereda el tipo de una columna de tabla:</p>
${codeBlock(`v_sal   emp.sal%TYPE := 0;    -- mismo tipo que emp.sal
v_name  emp.ename%TYPE;`)}
<p><strong>%ROWTYPE</strong> — hereda toda la estructura de una fila:</p>
${codeBlock(`v_emp   emp%ROWTYPE;          -- campo: v_emp.empno, v_emp.ename...`)}
<p><strong>TYPE IS RECORD</strong> — tipo compuesto personalizado:</p>
${codeBlock(`DECLARE
  TYPE t_persona IS RECORD (
    nombre VARCHAR2(30),
    edad   NUMBER
  );
  v_p t_persona;
BEGIN
  v_p.nombre := 'ANA';
END;`)}
`},
  {title:'SELECT INTO y sentencias DML',html:`
<p>En PL/SQL solo se permiten DML (SELECT, INSERT, UPDATE, DELETE) y control de transacciones (COMMIT, ROLLBACK, SAVEPOINT).</p>
<p><strong>SELECT INTO</strong> almacena el resultado en variables. <em>Solo debe devolver exactamente 1 fila.</em></p>
${codeBlock(`DECLARE
  v_sal emp.sal%TYPE;
BEGIN
  SELECT sal INTO v_sal
  FROM emp
  WHERE ename = 'SMITH';   -- 1 fila exacta

  -- Si 0 filas → NO_DATA_FOUND (ORA-1403)
  -- Si >1 fila → TOO_MANY_ROWS (ORA-1422)
  DBMS_OUTPUT.PUT_LINE('Salario: ' || v_sal);
END;`)}
<p>Una variable cuyo nombre coincide con una columna de tabla puede causar ambigüedad: PL/SQL interpretará el nombre como la columna (borrando todos los registros). Nombra las variables con prefijo <code>v_</code>.</p>`},
  {title:'Entrada y Salida',html:`
<p><strong>Salida:</strong> Activa primero <code>SET SERVEROUTPUT ON</code>.</p>
${codeBlock(`SET SERVEROUTPUT ON;
BEGIN
  DBMS_OUTPUT.PUT_LINE('Hola mundo');
  DBMS_OUTPUT.PUT_LINE('Valor: ' || 42);
END;`)}
<p><strong>Entrada</strong> (variables de sustitución de SQL*Plus):</p>
${codeBlock(`SET VERIFY OFF;
DECLARE
  v_num NUMBER := &numero;  -- pide valor al ejecutar
BEGIN
  DBMS_OUTPUT.PUT_LINE('Has introducido: ' || v_num);
END;`)}
`}
 ],
 test:[
  {q:'¿Cuál es la ÚNICA sección obligatoria de un bloque PL/SQL?',
   opts:['DECLARE','BEGIN','EXCEPTION','END'],ans:1,
   exp:'BEGIN es la sección ejecutable y la única obligatoria. DECLARE y EXCEPTION son opcionales.'},
  {q:'¿Qué tipo de dato PL/SQL puede almacenar los valores TRUE, FALSE y NULL?',
   opts:['NUMBER','CHAR','BOOLEAN','VARCHAR2'],ans:2,
   exp:'BOOLEAN es exclusivo de PL/SQL y admite TRUE, FALSE y NULL. No existe en SQL estándar.'},
  {q:'Si declaramos  v_sal emp.sal%TYPE,  ¿qué tipo tendrá v_sal?',
   opts:['NUMBER(38) siempre','El mismo tipo que la columna sal de la tabla emp','VARCHAR2','DATE'],ans:1,
   exp:'%TYPE hereda el tipo exacto de la columna en tiempo de compilación.'},
  {q:'¿Qué excepción se lanza cuando SELECT INTO no encuentra NINGUNA fila?',
   opts:['TOO_MANY_ROWS','CURSOR_ALREADY_OPEN','NO_DATA_FOUND','VALUE_ERROR'],ans:2,
   exp:'NO_DATA_FOUND (ORA-1403) se lanza cuando SELECT INTO no devuelve ninguna fila. TOO_MANY_ROWS si devuelve más de una.'},
  {q:'¿Cuál es el operador de CONCATENACIÓN de cadenas en PL/SQL?',
   opts:['+','&','CONCAT','||'],ans:3,
   exp:'|| es el operador de concatenación. CONCAT es una función, no un operador.'},
  {q:'¿Qué valor tienen las variables declaradas SIN inicializar?',
   opts:['0','Cadena vacía \'\'','NULL','FALSE'],ans:2,
   exp:'En PL/SQL, toda variable no inicializada recibe NULL por defecto. Para NUMBER no es 0.'}
 ],
 fill:[
  {title:'Declara una variable con el mismo tipo que emp.sal, inicializada a 0',
   tpl:`DECLARE\n  v_sal emp.sal{1}TYPE {2}= 0;\nBEGIN\n  NULL;\nEND;`,
   ans:['%',':'],
   hint:'Usa el operador de tipo (%TYPE) y el operador de asignación (:=)'},
  {title:'Completa el bloque SELECT INTO para obtener el nombre del empleado con empno=7369',
   tpl:`DECLARE\n  v_name emp.ename{1}TYPE;\n{2}\n  SELECT ename {3} v_name\n  FROM emp\n  WHERE empno = 7369;\n  DBMS_OUTPUT.PUT_LINE(v_name);\n{4}`,
   ans:['%','BEGIN','INTO','END;'],
   hint:'Secciones del bloque: DECLARE, BEGIN, END. SELECT usa INTO para guardar en variable.'},
  {title:'Declara un TYPE IS RECORD con nombre y salario',
   tpl:`DECLARE\n  {1} t_info {2} RECORD (\n    nombre VARCHAR2(30),\n    salario NUMBER\n  );\n  v_dato t_info;\nBEGIN\n  v_dato.nombre {3}= 'SMITH';\n  DBMS_OUTPUT.PUT_LINE(v_dato.nombre);\nEND;`,
   ans:['TYPE','IS',':'],
   hint:'La sintaxis es: TYPE nombre IS RECORD (...); La asignación usa :='}
 ],
 missing:[
  {title:'¿Qué palabra clave falta para que SELECT almacene el resultado?',
   code:`DECLARE
  v_sal NUMBER;
BEGIN
  SELECT sal
  _______ v_sal        -- ¿qué falta aquí?
  FROM emp
  WHERE ename = 'SMITH';
  DBMS_OUTPUT.PUT_LINE(v_sal);
END;`,
   opts:['INTO','FROM','WHERE','USING'],ans:0,
   exp:'SELECT en PL/SQL SIEMPRE necesita INTO para almacenar el resultado en una o más variables.'},
  {title:'¿Qué sección del bloque falta?',
   code:`DECLARE
  v_x NUMBER := 5;
_______              -- ¿qué sección falta aquí?
  DBMS_OUTPUT.PUT_LINE('x = ' || v_x);
END;`,
   opts:['BEGIN','EXECUTE','RUN','START'],ans:0,
   exp:'BEGIN marca el inicio de la sección ejecutable, que es obligatoria.'}
 ],
 order:[
  {title:'Ordena las líneas para formar un bloque PL/SQL correcto',
   lines:["END;"," DBMS_OUTPUT.PUT_LINE('Hola ' || v_name);","DECLARE","BEGIN","  v_name VARCHAR2(20) := 'SMITH';"],
   correct:[2,4,3,1,0]}
 ],
 change:[
  {title:'Análisis de adaptación',
   scenario:'El siguiente código obtiene el salario del empleado SMITH y lo muestra por pantalla.',
   code:`DECLARE
  v_sal emp.sal%TYPE;
BEGIN
  SELECT sal INTO v_sal
  FROM emp
  WHERE ename = 'SMITH';
  DBMS_OUTPUT.PUT_LINE('Salario: ' || v_sal);
END;`,
   q:'¿Qué cambiarías si quisieras procesar TODOS los empleados de la tabla?',
   opts:['Añadir ORDER BY al SELECT','Usar un cursor con LOOP para iterar fila a fila','Cambiar INTO por FROM','Añadir GROUP BY ename'],
   ans:1,exp:'SELECT INTO solo admite exactamente 1 fila. Para múltiples filas necesitas un cursor (EPD7).'},
  {title:'Análisis de adaptación',
   scenario:'El código obtiene todos los datos del PRESIDENT con %ROWTYPE.',
   code:`DECLARE
  my_emp emp%ROWTYPE;
BEGIN
  SELECT * INTO my_emp
  FROM emp WHERE job = 'PRESIDENT';
  DBMS_OUTPUT.PUT_LINE(my_emp.ename);
END;`,
   q:'¿Qué cambiarías para mostrar TAMBIÉN el salario junto al nombre?',
   opts:["Cambiar %ROWTYPE por %TYPE","Añadir SELECT sal INTO otra variable","Modificar PUT_LINE: DBMS_OUTPUT.PUT_LINE(my_emp.ename || ' ' || my_emp.sal)","Añadir un segundo bloque BEGIN"],
   ans:2,exp:'%ROWTYPE ya contiene todos los campos. Solo hay que añadir my_emp.sal a la instrucción PUT_LINE.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// EPD6: ESTRUCTURAS DE CONTROL
// ─────────────────────────────────────────────────────────────
{id:'epd6',tag:'PR 2',title:'Estructuras de Control',
 desc:'IF/ELSIF/ELSE, CASE, LOOP, WHILE, FOR y CONTINUE',
 teoria:[
  {title:'Condicional IF / ELSIF / ELSE',html:`
<p>La estructura condicional básica evalúa una condición booleana. Si la condición es <strong>NULL o FALSE</strong>, el bloque THEN no se ejecuta.</p>
${codeBlock(`IF condicion THEN
  ...instrucciones...
ELSIF otra_condicion THEN
  ...instrucciones...
ELSE
  ...instrucciones...
END IF;`)}
<p>Ejemplo completo:</p>
${codeBlock(`IF v_sal < 1000 THEN
  UPDATE emp SET sal = sal + 150 WHERE ename = v_name;
  COMMIT;
ELSIF v_sal >= 1000 AND v_sal < 2000 THEN
  DBMS_OUTPUT.PUT_LINE('Salario normal');
ELSE
  DELETE FROM emp WHERE ename = v_name;
  COMMIT;
END IF;`)}
<div class="tag-info">⚠️ Si v_Number2 = NULL, la comparación v_Number1 &lt; v_Number2 devuelve NULL (no TRUE), por lo que se ejecuta el ELSE.</div>`},
  {title:'Estructura CASE',html:`
<p>CASE evalúa una expresión o condiciones múltiples:</p>
${codeBlock(`-- CASE simple (compara variable con valores)
CASE v_TestVar
  WHEN 1 THEN DBMS_OUTPUT.PUT_LINE('Uno');
  WHEN 2 THEN DBMS_OUTPUT.PUT_LINE('Dos');
  ELSE        DBMS_OUTPUT.PUT_LINE('Otro');
END CASE;

-- CASE buscado (condiciones booleanas)
CASE
  WHEN score BETWEEN 80 AND 100 THEN ...
  WHEN score BETWEEN 65 AND 79  THEN ...
  ELSE DBMS_OUTPUT.PUT_LINE('No match');
END CASE;`)}
<div class="tag-info">⚠️ Si no hay ELSE y ningún WHEN coincide → excepción <strong>CASE_NOT_FOUND</strong> (ORA-6592).</div>
<p>CASE también puede usarse como expresión de asignación:</p>
${codeBlock(`v_CourseName := CASE v_Major
  WHEN 'Computer Science' THEN 'CS 101'
  WHEN 'History'          THEN 'HIS 101'
  ELSE 'Unknown'
END;`)}
`},
  {title:'LOOP simple y EXIT WHEN',html:`
${codeBlock(`-- Bucle simple (sin condición de parada → infinito)
LOOP
  v_sal := v_sal + v_extra;
  EXIT WHEN v_sal > 3000;   -- forma elegante
  -- equivalente: IF v_sal > 3000 THEN EXIT; END IF;
END LOOP;`)}
<p>El <code>EXIT WHEN</code> se coloca <strong>antes</strong> del procesamiento de datos para no procesar una iteración extra.</p>`},
  {title:'WHILE y FOR',html:`
${codeBlock(`-- WHILE: evalúa condición ANTES de ejecutar
WHILE v_sal <= 3000 LOOP
  v_sal := v_sal + v_extra;
END LOOP;
-- Si la condición es FALSE desde el principio, no se ejecuta.

-- FOR numérico: contador implícito BINARY_INTEGER
FOR i IN 1..10 LOOP
  DBMS_OUTPUT.PUT_LINE('Contador: ' || i);
END LOOP;

-- FOR inverso
FOR i IN REVERSE 10..1 LOOP
  DBMS_OUTPUT.PUT_LINE(i);
END LOOP;

-- CONTINUE WHEN: salta iteración
FOR i IN 1..10 LOOP
  v_total := v_total + i;
  CONTINUE WHEN i > 5;     -- salta el resto si i>5
  DBMS_OUTPUT.PUT_LINE('Total parcial: ' || v_total);
END LOOP;`)}
<div class="tag-info">💡 El índice del FOR se declara implícitamente dentro del bucle. No se puede modificar su valor dentro del cuerpo.</div>`}
 ],
 test:[
  {q:'Si v_Number2 = NULL, ¿qué ejecuta  IF v_Number1 < v_Number2 THEN ... ELSE ... END IF?',
   opts:['El bloque THEN','El bloque ELSE','Nada, error de compilación','Se lanza VALUE_ERROR'],ans:1,
   exp:'NULL no es TRUE, por lo que la condición falla silenciosamente y se ejecuta el ELSE.'},
  {q:'¿Qué excepción se lanza en un CASE sin ELSE cuando ningún WHEN coincide?',
   opts:['NO_DATA_FOUND','VALUE_ERROR','CASE_NOT_FOUND','INVALID_CURSOR'],ans:2,
   exp:'CASE_NOT_FOUND (ORA-6592) se lanza cuando no hay cláusula ELSE y ningún WHEN coincide.'},
  {q:'En  FOR i IN 1..10 LOOP, ¿cómo se declara la variable i?',
   opts:['Como NUMBER en DECLARE','Como BINARY_INTEGER en DECLARE','Implícitamente dentro del FOR','Como VARCHAR2'],ans:2,
   exp:'El índice de un FOR se declara implícitamente como BINARY_INTEGER. No hace falta declararlo.'},
  {q:'¿Cuál es la diferencia entre EXIT y EXIT WHEN?',
   opts:['No hay diferencia','EXIT siempre sale del bucle; EXIT WHEN solo si se cumple la condición','EXIT WHEN siempre sale','EXIT solo funciona en LOOP simple'],ans:1,
   exp:'EXIT sale incondicionalmente. EXIT WHEN condicion es equivalente a IF condicion THEN EXIT; END IF;'},
  {q:'¿Qué hace CONTINUE WHEN i > 5 dentro de un FOR?',
   opts:['Sale del bucle cuando i > 5','Salta el resto de la iteración actual y va a la siguiente','Repite la iteración','Genera un error de compilación'],ans:1,
   exp:'CONTINUE devuelve el control al inicio del siguiente ciclo del bucle. Las instrucciones que siguen al CONTINUE no se ejecutan.'}
 ],
 fill:[
  {title:'Completa la estructura IF / ELSIF / ELSE',
   tpl:`DECLARE
  v_creditos NUMBER := 5;
BEGIN
  {1} v_creditos < 3 {2}
    DBMS_OUTPUT.PUT_LINE('Primero');
  {3} v_creditos < 6 {4}
    DBMS_OUTPUT.PUT_LINE('Segundo');
  {5}
    DBMS_OUTPUT.PUT_LINE('Avanzado');
  {6} {7};
END;`,
   ans:['IF','THEN','ELSIF','THEN','ELSE','END','IF'],
   hint:'IF ... THEN / ELSIF ... THEN / ELSE / END IF'},
  {title:'Completa el bucle FOR con CONTINUE',
   tpl:`DECLARE
  v_total NUMBER := 0;
BEGIN
  {1} i {2} 1..10 {3}
    v_total := v_total + i;
    {4} {5} i = 6 OR i = 8;
    DBMS_OUTPUT.PUT_LINE('i=' || i);
  END {6};
  DBMS_OUTPUT.PUT_LINE('Total: ' || v_total);
END;`,
   ans:['FOR','IN','LOOP','CONTINUE','WHEN','LOOP'],
   hint:'FOR variable IN rango LOOP ... CONTINUE WHEN condicion ... END LOOP'},
  {title:'Completa el CASE como expresión de asignación',
   tpl:`DECLARE
  v_major VARCHAR2(30) := 'History';
  v_course VARCHAR2(10);
BEGIN
  v_course := {1}  v_major
    {2} 'Computer Science' {3} 'CS 101'
    {4} 'History'          {5} 'HIS 101'
    {6} 'Unknown'
  END;
  DBMS_OUTPUT.PUT_LINE(v_course);
END;`,
   ans:['CASE','WHEN','THEN','WHEN','THEN','ELSE'],
   hint:'CASE var WHEN val1 THEN res1 WHEN val2 THEN res2 ELSE res END'}
 ],
 missing:[
  {title:'¿Qué le falta a este LOOP para no ser infinito?',
   code:`DECLARE
  v_sal NUMBER := 800;
  v_extra NUMBER := 100;
BEGIN
  LOOP
    v_sal := v_sal + v_extra;
    -- ¿qué instrucción falta aquí?
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('Final: ' || v_sal);
END;`,
   opts:['EXIT WHEN v_sal > 3000;','RETURN;','BREAK;','STOP LOOP;'],ans:0,
   exp:'Sin EXIT (o EXIT WHEN) el bucle LOOP es infinito. La forma elegante es EXIT WHEN condicion.'},
  {title:'¿Qué falta para cerrar correctamente la estructura CASE?',
   code:`BEGIN
  CASE v_dia
    WHEN 1 THEN DBMS_OUTPUT.PUT_LINE('Lunes');
    WHEN 2 THEN DBMS_OUTPUT.PUT_LINE('Martes');
    ELSE        DBMS_OUTPUT.PUT_LINE('Otro día');
  _______ _______;   -- ¿qué falta?
END;`,
   opts:['END CASE;','CLOSE CASE;','END;','FINISH CASE;'],ans:0,
   exp:'Las estructuras CASE deben cerrarse con END CASE;'}
 ],
 order:[
  {title:'Ordena las líneas para un bucle WHILE correcto',
   lines:["END LOOP;"," v_sal := v_sal + 100;","WHILE v_sal <= 3000 LOOP","DECLARE","BEGIN","  v_sal NUMBER := 500;","END;"],
   correct:[3,5,4,2,1,0,6]}
 ],
 change:[
  {title:'Análisis de adaptación',
   scenario:'Este bucle FOR imprime los números del 1 al 10.',
   code:`BEGIN
  FOR i IN 1..10 LOOP
    DBMS_OUTPUT.PUT_LINE('Contador: ' || i);
  END LOOP;
END;`,
   q:'¿Qué cambiarías para que imprima del 10 al 1 (orden inverso)?',
   opts:['Cambiar 1..10 por 10..1','Añadir ORDER BY DESC','Añadir REVERSE entre IN y el rango','Usar un WHILE decrementando'],
   ans:2,exp:'FOR i IN REVERSE 1..10 LOOP → el rango sigue siendo 1..10 pero REVERSE invierte el orden.'},
  {title:'Análisis de adaptación',
   scenario:'El siguiente IF convierte una nota numérica en calificación textual.',
   code:`IF v_nota >= 9 THEN  v_cal := 'Sobresaliente';
ELSIF v_nota >= 7 THEN  v_cal := 'Notable';
ELSIF v_nota >= 5 THEN  v_cal := 'Aprobado';
ELSE                    v_cal := 'Suspenso';
END IF;`,
   q:'¿Cómo reescribirías esto con CASE como expresión de asignación (en una instrucción)?',
   opts:[
    "v_cal := CASE WHEN v_nota>=9 THEN 'Sobresaliente' WHEN v_nota>=7 THEN 'Notable' WHEN v_nota>=5 THEN 'Aprobado' ELSE 'Suspenso' END;",
    "v_cal := IF(v_nota>=9,'Sobresaliente','Suspenso');",
    "CASE v_nota WHEN 9 THEN v_cal:='Sobresaliente'; END CASE;",
    "SELECT v_cal INTO v_nota FROM DUAL;"
   ],ans:0,
   exp:'El CASE buscado como expresión evalúa condiciones booleanas en WHEN y asigna el resultado.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// EPD7: FUNCIONES SQL Y CURSORES
// ─────────────────────────────────────────────────────────────
{id:'epd7',tag:'PR 3',title:'Funciones SQL y Cursores',
 desc:'Funciones predefinidas, cursores explícitos, atributos y bucles de extracción',
 teoria:[
  {title:'Funciones SQL predefinidas',html:`
<table>
  <tr><th>Función</th><th>Descripción</th></tr>
  <tr><td>LENGTH(cad)</td><td>Longitud en caracteres</td></tr>
  <tr><td>UPPER / LOWER(cad)</td><td>Mayúsculas / minúsculas</td></tr>
  <tr><td>INITCAP(cad)</td><td>Primera letra en mayúscula</td></tr>
  <tr><td>SUBSTR(cad,a,b)</td><td>Subcadena desde pos a, b caracteres</td></tr>
  <tr><td>REPLACE(cad,busc,sust)</td><td>Reemplaza ocurrencias</td></tr>
  <tr><td>RTRIM/LTRIM(cad)</td><td>Elimina espacios der/izq</td></tr>
  <tr><td>ABS(x) / POWER(x,y)</td><td>Valor absoluto / potencia</td></tr>
  <tr><td>TO_CHAR(n_o_d)</td><td>Convierte número/fecha a VARCHAR2</td></tr>
  <tr><td>TO_DATE(cad)</td><td>Convierte cadena a DATE</td></tr>
  <tr><td>TO_NUMBER(cad)</td><td>Convierte cadena a NUMBER</td></tr>
  <tr><td>ADD_MONTHS(d,n)</td><td>Suma n meses a la fecha d</td></tr>
  <tr><td>LAST_DAY(d)</td><td>Último día del mes de d</td></tr>
  <tr><td>CURRENT_DATE</td><td>Fecha actual de la sesión</td></tr>
</table>
<p>Las funciones de grupo (COUNT, AVG, SUM, MIN, MAX) <strong>no</strong> pueden usarse en instrucciones procedimentales de PL/SQL directamente.</p>`},
  {title:'¿Qué es un cursor?',html:`
<p>Un <strong>cursor</strong> es un puntero a un área de contexto en memoria que Oracle asigna para procesar una instrucción SQL que devuelve múltiples filas.</p>
<p>Hay dos tipos:</p>
<ul>
  <li><strong>Explícito:</strong> el programador lo declara, abre, extrae y cierra.</li>
  <li><strong>Implícito:</strong> PL/SQL lo gestiona automáticamente para INSERT/UPDATE/DELETE y SELECT INTO.</li>
</ul>
<p>Los <strong>cuatro pasos</strong> del cursor explícito:</p>
<ol>
  <li><strong>DECLARE</strong> el cursor (en sección declarativa)</li>
  <li><strong>OPEN</strong> — ejecuta el SELECT, apunta a la primera fila</li>
  <li><strong>FETCH</strong> — extrae la fila actual, avanza el puntero</li>
  <li><strong>CLOSE</strong> — libera los recursos</li>
</ol>`},
  {title:'Procesamiento de cursores: declaración y atributos',html:`
${codeBlock(`-- Declaración (sin INTO)
CURSOR c_Emp IS
  SELECT empno, ename, sal
  FROM emp
  WHERE deptno = v_Dept;     -- variable de acoplamiento

-- Apertura
OPEN c_Emp;

-- Extracción
FETCH c_Emp INTO v_Empno, v_Ename, v_Sal;

-- Cierre
CLOSE c_Emp;`)}
<p><strong>Atributos de cursor</strong> (se añaden al nombre: c_Emp%FOUND):</p>
<table>
  <tr><th>Atributo</th><th>Descripción</th></tr>
  <tr><td>%FOUND</td><td>TRUE si el último FETCH devolvió una fila</td></tr>
  <tr><td>%NOTFOUND</td><td>TRUE si el último FETCH NO devolvió fila</td></tr>
  <tr><td>%ISOPEN</td><td>TRUE si el cursor está abierto</td></tr>
  <tr><td>%ROWCOUNT</td><td>Nº de filas extraídas hasta ahora</td></tr>
</table>`},
  {title:'Bucles de extracción y cursores parametrizados',html:`
${codeBlock(`-- 1) Bucle simple con EXIT WHEN
OPEN c_Emp;
LOOP
  FETCH c_Emp INTO v_Empno, v_Ename;
  EXIT WHEN c_Emp%NOTFOUND;       -- ANTES del procesamiento
  DBMS_OUTPUT.PUT_LINE(v_Ename);
END LOOP;
CLOSE c_Emp;

-- 2) Bucle WHILE
OPEN c_Emp;
FETCH c_Emp INTO v_Empno, v_Ename;
WHILE c_Emp%FOUND LOOP
  DBMS_OUTPUT.PUT_LINE(v_Ename);
  FETCH c_Emp INTO v_Empno, v_Ename;
END LOOP;
CLOSE c_Emp;

-- 3) FOR de cursor (más conciso: OPEN/FETCH/CLOSE implícitos)
FOR reg IN c_Emp LOOP
  DBMS_OUTPUT.PUT_LINE(reg.ename);
END LOOP;

-- 4) FOR con cursor inline
FOR reg IN (SELECT ename FROM emp WHERE deptno=10) LOOP
  DBMS_OUTPUT.PUT_LINE(reg.ename);
END LOOP;

-- 5) Cursor parametrizado
CURSOR c_Clases(p_Dept CHAR, p_Curso NUMBER) IS
  SELECT * FROM classes
  WHERE department = p_Dept AND course = p_Curso;
OPEN c_Clases('HIS', 101);  -- pasa valores al OPEN`)}
<p><strong>Cursores implícitos (SQL%):</strong> existen para INSERT/UPDATE/DELETE/SELECT INTO.</p>
${codeBlock(`UPDATE rooms SET number_seats=100 WHERE room_id=99980;
IF SQL%NOTFOUND THEN
  INSERT INTO rooms(room_id,number_seats) VALUES(99980,100);
END IF;`)}
`}
 ],
 test:[
  {q:'¿Cuántos pasos tiene el procesamiento de un cursor EXPLÍCITO en PL/SQL?',
   opts:['2','3','4','5'],ans:2,
   exp:'DECLARE (en sección declarativa), OPEN, FETCH y CLOSE. Son 4 pasos.'},
  {q:'¿Qué devuelve el atributo cursor%ROWCOUNT?',
   opts:['TRUE o FALSE','El total de filas de la tabla','El nº de filas extraídas hasta el momento','NULL si el cursor no está abierto'],ans:2,
   exp:'%ROWCOUNT acumula el número de filas extraídas desde el OPEN. ORA-1001 si el cursor está cerrado.'},
  {q:'¿Qué sucede si intentas OPEN un cursor que ya está abierto?',
   opts:['Se reinicia automáticamente','Error ORA-6511 (CURSOR_ALREADY_OPEN)','Se crea un nuevo cursor','Error ORA-1001'],ans:1,
   exp:'Abrir un cursor ya abierto genera ORA-6511. Hay que cerrarlo primero.'},
  {q:'En un bucle LOOP con cursor, ¿dónde se coloca el EXIT WHEN cursor%NOTFOUND?',
   opts:['Antes del OPEN','Justo DESPUÉS del FETCH y ANTES del procesamiento','Al final del LOOP','Antes del FETCH'],ans:1,
   exp:'EXIT WHEN justo después del FETCH evita procesar una fila "fantasma" cuando el cursor ya no tiene más filas.'},
  {q:'En un FOR de cursor (FOR reg IN cursor LOOP), ¿hay que hacer OPEN, FETCH y CLOSE?',
   opts:['Sí, siempre','Solo OPEN y CLOSE','Solo FETCH','No, PL/SQL lo hace implícitamente'],ans:3,
   exp:'El bucle FOR de cursor realiza OPEN, FETCH en cada iteración y CLOSE al finalizar de forma automática.'}
 ],
 fill:[
  {title:'Declara y abre un cursor sobre los empleados del departamento 10',
   tpl:`DECLARE
  {1} c_Emp {2}
    SELECT empno, ename FROM emp
    WHERE deptno = 10;
  v_empno emp.empno{3}TYPE;
  v_ename emp.ename{4}TYPE;
BEGIN
  {5} c_Emp;
  LOOP
    {6} c_Emp INTO v_empno, v_ename;
    EXIT WHEN c_Emp{7}NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(v_ename);
  END LOOP;
  {8} c_Emp;
END;`,
   ans:['CURSOR','IS','%','%','OPEN','FETCH','%','CLOSE'],
   hint:'CURSOR nombre IS SELECT... / OPEN / FETCH INTO / EXIT WHEN %NOTFOUND / CLOSE'},
  {title:'Usa un bucle FOR de cursor (implícito sin OPEN/FETCH/CLOSE)',
   tpl:`DECLARE
  {1} c_Students {2}
    SELECT id, first_name, last_name
    FROM students
    WHERE major = 'Computer Science';
BEGIN
  {3} reg {4} c_Students {5}
    DBMS_OUTPUT.PUT_LINE(reg.first_name || ' ' || reg.last_name);
  END {6};
END;`,
   ans:['CURSOR','IS','FOR','IN','LOOP','LOOP'],
   hint:'FOR registro IN cursor LOOP ... END LOOP — sin OPEN/FETCH/CLOSE'}
 ],
 missing:[
  {title:'¿Qué atributo de cursor falta para que el bucle termine?',
   code:`OPEN c_Emp;
LOOP
  FETCH c_Emp INTO v_empno, v_ename;
  EXIT WHEN c_Emp_______;  -- ¿qué atributo falta?
  DBMS_OUTPUT.PUT_LINE(v_ename);
END LOOP;
CLOSE c_Emp;`,
   opts:['%NOTFOUND','%FOUND','%ISOPEN','%ROWCOUNT = 0'],ans:0,
   exp:'%NOTFOUND devuelve TRUE cuando el último FETCH no recuperó ninguna fila → sale del bucle.'},
  {title:'¿Qué instrucción falta al final del procesamiento del cursor?',
   code:`OPEN c_Students;
LOOP
  FETCH c_Students INTO v_StudentID, v_FirstName;
  EXIT WHEN c_Students%NOTFOUND;
  DBMS_OUTPUT.PUT_LINE(v_FirstName);
END LOOP;
_______ c_Students;  -- ¿qué falta?`,
   opts:['CLOSE','END','COMMIT','RETURN'],ans:0,
   exp:'CLOSE libera los recursos del cursor. Es obligatorio cerrarlo cuando ya no se necesita.'}
 ],
 order:[
  {title:'Ordena el procesamiento completo de un cursor con LOOP',
   lines:["END;","CLOSE c_Emp;"," DBMS_OUTPUT.PUT_LINE(v_ename);","DECLARE","  CURSOR c_Emp IS SELECT ename FROM emp;","  v_ename emp.ename%TYPE;","BEGIN","OPEN c_Emp;","LOOP","  FETCH c_Emp INTO v_ename;","  EXIT WHEN c_Emp%NOTFOUND;","END LOOP;"],
   correct:[3,4,5,6,7,8,9,10,2,11,1,0]}
 ],
 change:[
  {title:'Análisis de adaptación',
   scenario:'El siguiente cursor usa un bucle LOOP simple con EXIT WHEN.',
   code:`OPEN c_Students;
LOOP
  FETCH c_Students INTO v_ID, v_Name;
  EXIT WHEN c_Students%NOTFOUND;
  DBMS_OUTPUT.PUT_LINE(v_Name);
END LOOP;
CLOSE c_Students;`,
   q:'¿Cómo lo simplificarías usando un FOR de cursor? ¿Qué instrucciones desaparecen?',
   opts:[
    'FOR reg IN c_Students LOOP — desaparecen OPEN, FETCH, EXIT WHEN y CLOSE',
    'WHILE c_Students%FOUND — desaparece EXIT WHEN',
    'Solo hay que eliminar el CLOSE',
    'No se puede simplificar'
   ],ans:0,
   exp:'El FOR de cursor gestiona OPEN, FETCH en cada iteración y CLOSE automáticamente.'},
  {title:'Análisis de adaptación',
   scenario:'El cursor filtra estudiantes de "Computer Science" usando una variable de acoplamiento.',
   code:`v_Major := 'Computer Science';
CURSOR c_Students IS
  SELECT id, first_name FROM students
  WHERE major = v_Major;`,
   q:'¿Cómo lo convertirías en un cursor PARAMETRIZADO para poder filtrar por cualquier major?',
   opts:[
    "CURSOR c_Students(p_Major VARCHAR2) IS SELECT... WHERE major = p_Major; — OPEN c_Students('History');",
    'Añadir WHERE major = &major',
    'Crear un cursor diferente por cada major',
    'Usar SELECT INTO dentro del LOOP'
   ],ans:0,
   exp:'Los cursores parametrizados reciben parámetros en OPEN, permitiendo reutilizar el mismo cursor con distintos valores.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// EPD8: TRATAMIENTO DE ERRORES
// ─────────────────────────────────────────────────────────────
{id:'epd8',tag:'PR 4',title:'Tratamiento de Errores',
 desc:'Excepciones predefinidas y de usuario, RAISE, WHEN OTHERS, SQLCODE/SQLERRM',
 teoria:[
  {title:'Excepciones predefinidas',html:`
<p>PL/SQL usa un mecanismo de <strong>excepciones</strong> (similar a Java) para gestionar errores en tiempo de ejecución.</p>
<table>
  <tr><th>Excepción</th><th>ORA-</th><th>Causa</th></tr>
  <tr><td>NO_DATA_FOUND</td><td>1403</td><td>SELECT INTO sin filas</td></tr>
  <tr><td>TOO_MANY_ROWS</td><td>1422</td><td>SELECT INTO devuelve más de 1 fila</td></tr>
  <tr><td>ZERO_DIVIDE</td><td>1476</td><td>División por cero</td></tr>
  <tr><td>DUP_VAL_ON_INDEX</td><td>0001</td><td>Violación de clave única</td></tr>
  <tr><td>INVALID_CURSOR</td><td>1001</td><td>Operación ilegal sobre cursor</td></tr>
  <tr><td>CURSOR_ALREADY_OPEN</td><td>6511</td><td>OPEN sobre cursor ya abierto</td></tr>
  <tr><td>CASE_NOT_FOUND</td><td>6592</td><td>CASE sin ELSE y sin WHEN coincidente</td></tr>
  <tr><td>VALUE_ERROR</td><td>6502</td><td>Error aritmético o de conversión</td></tr>
  <tr><td>ROWTYPE_MISMATCH</td><td>6504</td><td>Tipos incompatibles en asignación</td></tr>
</table>`},
  {title:'Excepciones de usuario y RAISE',html:`
<p>Las excepciones de usuario se <strong>declaran</strong> en DECLARE, se <strong>lanzan</strong> en BEGIN y se <strong>tratan</strong> en EXCEPTION:</p>
${codeBlock(`DECLARE
  e_TooManyStudents EXCEPTION;  -- declaración
  v_Current NUMBER(3);
  v_Max     NUMBER(3);
BEGIN
  SELECT current_students, max_students
    INTO v_Current, v_Max
    FROM classes
    WHERE department = 'MUS' AND course = 410;

  IF v_Current > v_Max THEN
    RAISE e_TooManyStudents;    -- lanzar
  END IF;
EXCEPTION
  WHEN e_TooManyStudents THEN   -- tratar
    DBMS_OUTPUT.PUT_LINE('¡Clase llena!');
    INSERT INTO log_table(info) VALUES('MUS 410 llena');
    COMMIT;
END;`)}
`},
  {title:'EXCEPTION WHEN, WHEN OTHERS, propagación',html:`
<p>La sección EXCEPTION puede manejar varias excepciones:</p>
${codeBlock(`EXCEPTION
  WHEN NO_DATA_FOUND OR TOO_MANY_ROWS THEN
    DBMS_OUTPUT.PUT_LINE('Error en SELECT');
  WHEN e_MiError THEN
    INSERT INTO log_table ...
  WHEN OTHERS THEN          -- captura cualquier otra
    v_Cod  := SQLCODE;
    v_Txt  := SUBSTR(SQLERRM, 1, 200);
    INSERT INTO log_table(code, message)
      VALUES(v_Cod, v_Txt);
END;`)}
<div class="tag-info">⚠️ WHEN OTHERS debe ser SIEMPRE la última cláusula. SQLCODE devuelve el código numérico del error; SQLERRM el texto.</div>
<p><strong>Propagación:</strong> si el bloque actual no trata la excepción, esta se propaga al bloque superior. Las excepciones de la sección DECLARE o EXCEPTION se propagan directamente al bloque exterior.</p>`},
  {title:'RAISE_APPLICATION_ERROR',html:`
<p>Lanza una excepción con código y mensaje personalizados, combinando RAISE + EXCEPTION en una sola instrucción:</p>
${codeBlock(`RAISE_APPLICATION_ERROR(número_error, mensaje_error);
-- número_error: entre -20000 y -20999
-- mensaje_error: hasta 512 caracteres`)}
<p>Ejemplo:</p>
${codeBlock(`IF v_Current > v_Max THEN
  RAISE_APPLICATION_ERROR(-20001,
    'Clase llena: ' || v_Current || '/' || v_Max);
END IF;`)}
`}
 ],
 test:[
  {q:'¿Dónde se DECLARAN las excepciones definidas por el usuario?',
   opts:['En la sección BEGIN','En la sección DECLARE','En la sección EXCEPTION','Fuera del bloque'],ans:1,
   exp:'Las excepciones de usuario se declaran en DECLARE como cualquier variable: e_MiError EXCEPTION;'},
  {q:'¿Qué excepción Oracle genera una violación de clave primaria (INSERT duplicado)?',
   opts:['NO_DATA_FOUND','ROWTYPE_MISMATCH','VALUE_ERROR','DUP_VAL_ON_INDEX'],ans:3,
   exp:'DUP_VAL_ON_INDEX (ORA-0001) se genera al intentar insertar un valor duplicado en una columna con restricción UNIQUE o PK.'},
  {q:'¿Qué valor devuelve SQLCODE para excepciones definidas por el usuario?',
   opts:['El código ORA correspondiente','+1','−1','NULL'],ans:1,
   exp:'Para excepciones de usuario, SQLCODE devuelve 1 y SQLERRM devuelve "User-defined Exception".'},
  {q:'¿Cuál es el rango válido de número_error en RAISE_APPLICATION_ERROR?',
   opts:['0 a 9999','−1 a −100','−20000 a −20999','Cualquier entero negativo'],ans:2,
   exp:'RAISE_APPLICATION_ERROR solo acepta números entre −20000 y −20999 para no solaparse con errores Oracle.'},
  {q:'¿Qué hace WHEN OTHERS en la sección EXCEPTION?',
   opts:['Solo captura errores Oracle predefinidos','Solo captura excepciones de usuario','Captura cualquier excepción no tratada por las cláusulas anteriores','Lanza automáticamente una excepción'],ans:2,
   exp:'WHEN OTHERS es el "catch-all". Debe ir siempre al final. Se recomienda registrar SQLCODE/SQLERRM dentro.'}
 ],
 fill:[
  {title:'Declara, lanza y trata una excepción de usuario',
   tpl:`DECLARE
  {1} e_SinDatos {2};
  v_sal NUMBER;
BEGIN
  SELECT sal INTO v_sal FROM emp WHERE empno = 9999;
  IF v_sal IS NULL THEN
    {3} e_SinDatos;
  END IF;
{4}
  {5} e_SinDatos {6}
    DBMS_OUTPUT.PUT_LINE('Sin datos válidos');
  {7} NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('No existe el empleado');
END;`,
   ans:['','EXCEPTION','RAISE','EXCEPTION','WHEN','THEN','WHEN'],
   hint:'DECLARE nombre EXCEPTION; → RAISE nombre; → EXCEPTION WHEN nombre THEN'},
  {title:'Usa RAISE_APPLICATION_ERROR para un error personalizado',
   tpl:`DECLARE
  v_sal NUMBER;
BEGIN
  SELECT sal INTO v_sal FROM emp WHERE ename = 'SMITH';
  IF v_sal < 500 THEN
    {1}({2},
      'Salario demasiado bajo: ' || v_sal);
  END IF;
{3}
  {4} OTHERS {5}
    DBMS_OUTPUT.PUT_LINE('Código: ' || {6});
    DBMS_OUTPUT.PUT_LINE('Error: '  || {7});
END;`,
   ans:['RAISE_APPLICATION_ERROR','-20001','EXCEPTION','WHEN','THEN','SQLCODE','SQLERRM'],
   hint:'RAISE_APPLICATION_ERROR(-20xxx, texto) / SQLCODE / SQLERRM'}
 ],
 missing:[
  {title:'¿Qué instrucción falta para lanzar la excepción declarada?',
   code:`DECLARE
  e_Lleno EXCEPTION;
  v_cur NUMBER := 30;
  v_max NUMBER := 25;
BEGIN
  IF v_cur > v_max THEN
    _______ e_Lleno;  -- ¿qué instrucción falta?
  END IF;
EXCEPTION
  WHEN e_Lleno THEN
    DBMS_OUTPUT.PUT_LINE('Clase llena');
END;`,
   opts:['RAISE','THROW','GENERATE','SIGNAL'],ans:0,
   exp:'RAISE es la instrucción PL/SQL para lanzar (generar) una excepción definida por el usuario.'},
  {title:'¿Qué cláusula falta para capturar cualquier error no previsto?',
   code:`EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('Sin datos');
  WHEN TOO_MANY_ROWS THEN
    DBMS_OUTPUT.PUT_LINE('Demasiadas filas');
  WHEN _______ THEN       -- ¿qué falta?
    DBMS_OUTPUT.PUT_LINE('Error inesperado: ' || SQLERRM);
END;`,
   opts:['OTHERS','ALL','ANY','EXCEPTION'],ans:0,
   exp:'WHEN OTHERS captura todos los errores no tratados por las cláusulas anteriores. Siempre la última.'}
 ],
 order:[
  {title:'Ordena el bloque completo con declaración, lanzamiento y tratamiento de excepción',
   lines:["END;","  WHEN e_Error THEN","    DBMS_OUTPUT.PUT_LINE('Error capturado');","  e_Error EXCEPTION;","BEGIN","EXCEPTION","  RAISE e_Error;","DECLARE"],
   correct:[7,3,4,6,5,1,2,0]}
 ],
 change:[
  {title:'Análisis de adaptación',
   scenario:'El código usa una excepción de usuario declarada y RAISE para señalar el problema.',
   code:`DECLARE
  e_TooMany EXCEPTION;
BEGIN
  IF v_Current > v_Max THEN
    RAISE e_TooMany;
  END IF;
EXCEPTION
  WHEN e_TooMany THEN
    DBMS_OUTPUT.PUT_LINE('Demasiados estudiantes');
END;`,
   q:'¿Cómo lo reescribirías usando RAISE_APPLICATION_ERROR en lugar de la excepción de usuario?',
   opts:[
    "Eliminar e_TooMany y RAISE, y poner: RAISE_APPLICATION_ERROR(-20001,'Demasiados estudiantes');",
    "Cambiar RAISE por THROW",
    "Añadir ORA-20001 al WHEN",
    "Usar WHEN OTHERS en lugar de WHEN e_TooMany"
   ],ans:0,
   exp:'RAISE_APPLICATION_ERROR combina RAISE y EXCEPTION en una sola instrucción, sin necesidad de declarar la excepción.'},
  {title:'Análisis de adaptación',
   scenario:'El procedimiento no tiene tratamiento de errores.',
   code:`BEGIN
  SELECT sal INTO v_sal FROM emp WHERE empno = &id;
  DBMS_OUTPUT.PUT_LINE('Salario: ' || v_sal);
END;`,
   q:'¿Qué añadirías para tratar los dos errores más probables y cualquier otro?',
   opts:[
    "EXCEPTION WHEN NO_DATA_FOUND THEN ... WHEN TOO_MANY_ROWS THEN ... WHEN OTHERS THEN ...",
    "Solo WHEN OTHERS basta para todo",
    "Añadir IF v_sal IS NULL antes de la salida",
    "Usar un cursor en vez de SELECT INTO"
   ],ans:0,
   exp:'Siempre trata los errores más específicos primero (NO_DATA_FOUND, TOO_MANY_ROWS) y WHEN OTHERS al final.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// EPD9: PROCEDIMIENTOS Y FUNCIONES
// ─────────────────────────────────────────────────────────────
{id:'epd9',tag:'PR 5',title:'Procedimientos y Funciones',
 desc:'CREATE PROCEDURE, CREATE FUNCTION, parámetros IN/OUT/IN OUT y DROP',
 teoria:[
  {title:'Procedimientos almacenados',html:`
<p>Los procedimientos son bloques PL/SQL <strong>nominados y almacenados</strong> en el diccionario de datos. Se invocan como instrucciones PL/SQL.</p>
${codeBlock(`CREATE [OR REPLACE] PROCEDURE nombre_proc
  [ (param1 [IN|OUT|IN OUT] tipo,
     param2 [IN|OUT|IN OUT] tipo) ]
{IS | AS}
  -- sección declarativa (sin DECLARE)
BEGIN
  -- código
[EXCEPTION
  ...]
END nombre_proc;`)}
<p>Ejemplo:</p>
${codeBlock(`CREATE OR REPLACE PROCEDURE AddNewStudent (
  p_FirstName  students.first_name%TYPE,
  p_LastName   students.last_name%TYPE,
  p_Major      students.major%TYPE DEFAULT 'Economics'
) AS
BEGIN
  INSERT INTO students(ID, first_name, last_name, major, current_credits)
  VALUES(student_sequence.NEXTVAL, p_FirstName, p_LastName, p_Major, 0);
END AddNewStudent;

-- Llamada desde bloque anónimo:
BEGIN
  AddNewStudent('Simon', 'Salovitz');  -- p_Major usa DEFAULT
END;`)}
<div class="tag-info">💡 OR REPLACE elimina y crea de nuevo si ya existe. Sin OR REPLACE da ORA-955 si ya existe.</div>`},
  {title:'Funciones almacenadas',html:`
<p>Las funciones son como procedimientos pero <strong>devuelven un valor</strong>. Se invocan dentro de expresiones.</p>
${codeBlock(`CREATE [OR REPLACE] FUNCTION nombre_func
  [ (param1 tipo, ...) ]
RETURN tipo_retorno {IS | AS}
  -- declaraciones
BEGIN
  ...
  RETURN valor;
END nombre_func;`)}
<p>Ejemplo:</p>
${codeBlock(`CREATE OR REPLACE FUNCTION sal_ok(
  salary  NUMBER,
  gradeSal NUMBER
) RETURN BOOLEAN IS
  min_sal salgrade.losal%TYPE;
  max_sal salgrade.hisal%TYPE;
BEGIN
  SELECT losal, hisal
    INTO min_sal, max_sal
    FROM salgrade
    WHERE grade = gradeSal;
  RETURN (salary >= min_sal AND salary <= max_sal);
END sal_ok;`)}
<p>Puede haber varios RETURN, pero solo se ejecuta uno. Llegar al END sin ejecutar RETURN genera un error.</p>`},
  {title:'Modos de parámetros: IN, OUT, IN OUT',html:`
<table>
  <tr><th>Modo</th><th>Por defecto</th><th>Comportamiento</th></tr>
  <tr><td><strong>IN</strong></td><td>Sí</td><td>Solo entrada. Se trata como constante dentro del subprograma.</td></tr>
  <tr><td><strong>OUT</strong></td><td>No</td><td>Solo salida. Vale NULL al entrar. El valor al salir es accesible en el llamador.</td></tr>
  <tr><td><strong>IN OUT</strong></td><td>No</td><td>Entrada y salida. Se lee y se modifica.</td></tr>
</table>
<p>Los parámetros OUT e IN OUT requieren ser <strong>variables</strong> en la llamada (no constantes ni expresiones).</p>
${codeBlock(`-- Ejemplo con OUT
CREATE OR REPLACE PROCEDURE Get_Sal(
  p_empno IN  emp.empno%TYPE,
  p_sal   OUT emp.sal%TYPE
) IS
BEGIN
  SELECT sal INTO p_sal FROM emp WHERE empno = p_empno;
END Get_Sal;

-- Llamada
DECLARE
  v_sal emp.sal%TYPE;
BEGIN
  Get_Sal(7369, v_sal);          -- v_sal recibe el resultado
  DBMS_OUTPUT.PUT_LINE(v_sal);
END;`)}
`},
  {title:'DROP y excepciones en subprogramas',html:`
${codeBlock(`DROP PROCEDURE nombre_proc;   -- ORA-4043 si no existe
DROP FUNCTION  nombre_func;

-- Si hay error dentro del subprograma y no se trata,
-- el control pasa al entorno llamador.
-- Los parámetros OUT e IN OUT quedan con el valor que
-- tenían antes de la llamada.`)}
<p>Para ver el código fuente: <code>SELECT text FROM user_source WHERE name='NOMBRE' ORDER BY line;</code></p>
<p>Para ver errores de compilación: <code>SELECT * FROM user_errors WHERE name='NOMBRE';</code></p>`}
 ],
 test:[
  {q:'¿Cuál es la diferencia fundamental entre un procedimiento y una función?',
   opts:['El procedimiento tiene más parámetros','La función devuelve un valor con RETURN','El procedimiento no puede tener EXCEPTION','La función no admite parámetros OUT'],ans:1,
   exp:'La única diferencia es que la función devuelve un valor y puede usarse en expresiones. El procedimiento no.'},
  {q:'Un parámetro declarado como IN significa que:',
   opts:['Solo puede ser de salida','Puede ser de entrada y salida','Es de entrada; dentro del subprograma actúa como constante','No puede tener valor por defecto'],ans:2,
   exp:'IN es el modo por defecto. El parámetro se comporta como una constante dentro del subprograma; no se puede asignar.'},
  {q:'¿Qué error genera DROP PROCEDURE si el procedimiento no existe?',
   opts:['ORA-955','ORA-4043','ORA-1403','ORA-6511'],ans:1,
   exp:'ORA-4043: Object does not exist. ORA-955 es el error cuando se crea un objeto que ya existe sin OR REPLACE.'},
  {q:'¿Pueden existir múltiples instrucciones RETURN en una función?',
   opts:['No, solo una','Sí, pero solo se ejecuta la primera que se alcance','Sí, y se ejecutan todas','Solo si están en ramas excluyentes de IF'],ans:1,
   exp:'Puede haber varios RETURN, pero solo se ejecuta uno. El primero que se alcanza en tiempo de ejecución termina la función.'},
  {q:'¿Qué hace OR REPLACE en CREATE OR REPLACE PROCEDURE?',
   opts:['Crea solo si no existe','Genera error si ya existe','Elimina y recrea si ya existe; crea si no existe','Versiona el procedimiento anterior'],ans:2,
   exp:'OR REPLACE permite actualizar el código de un subprograma en una sola operación, sin hacer DROP previo.'}
 ],
 fill:[
  {title:'Crea un procedimiento que inserta un empleado con un parámetro por defecto',
   tpl:`{1} {2} REPLACE {3} AddStudent (
  p_Name  students.first_name{4}TYPE,
  p_Major students.major{5}TYPE {6} 'Economics'
) {7}
BEGIN
  INSERT INTO students(first_name, major)
  VALUES(p_Name, p_Major);
END AddStudent;`,
   ans:['CREATE','OR','PROCEDURE','%','%','DEFAULT','AS'],
   hint:'CREATE OR REPLACE PROCEDURE nombre(param tipo DEFAULT val) AS BEGIN...'},
  {title:'Crea una función que devuelve el salario de un empleado',
   tpl:`CREATE OR REPLACE {1} GetSalario(
  p_empno IN emp.empno{2}TYPE
) {3} emp.sal{4}TYPE {5}
  v_sal emp.sal%TYPE;
{6}
  SELECT sal {7} v_sal
  FROM emp WHERE empno = p_empno;
  {8} v_sal;
END GetSalario;`,
   ans:['FUNCTION','%','RETURN','%','IS','BEGIN','INTO','RETURN'],
   hint:'CREATE OR REPLACE FUNCTION nombre(param) RETURN tipo IS ... BEGIN ... RETURN valor; END'}
 ],
 missing:[
  {title:'¿Qué falta para que la función retorne el valor calculado?',
   code:`CREATE OR REPLACE FUNCTION Doble(n NUMBER)
RETURN NUMBER IS
BEGIN
  _______ n * 2;   -- ¿qué instrucción falta?
END Doble;`,
   opts:['RETURN','OUTPUT','SEND','GIVE'],ans:0,
   exp:'La función DEBE ejecutar RETURN valor antes de llegar al END. Sin RETURN se genera un error en tiempo de ejecución.'},
  {title:'¿Qué modo de parámetro falta para que pueda devolver un valor al llamador?',
   code:`CREATE OR REPLACE PROCEDURE Cuadrado(
  p_num IN  NUMBER,
  p_res _______ NUMBER   -- ¿qué modo falta?
) IS
BEGIN
  p_res := p_num * p_num;
END Cuadrado;`,
   opts:['OUT','IN','IN OUT','RETURN'],ans:0,
   exp:'OUT permite que el subprograma escriba en la variable del llamador. La variable tiene valor NULL al entrar.'}
 ],
 order:[
  {title:'Ordena las partes de una función almacenada completa',
   lines:["END GetJob;","  RETURN v_job;","  v_job emp.job%TYPE;","  SELECT job INTO v_job FROM emp WHERE empno = p_empno;","CREATE OR REPLACE FUNCTION GetJob(p_empno emp.empno%TYPE)","RETURN emp.job%TYPE IS","BEGIN"],
   correct:[4,5,2,6,3,1,0]}
 ],
 change:[
  {title:'Análisis de adaptación',
   scenario:'El procedimiento imprime el salario directamente sin devolverlo al llamador.',
   code:`CREATE OR REPLACE PROCEDURE MostrarSal(
  p_empno IN emp.empno%TYPE
) IS
  v_sal emp.sal%TYPE;
BEGIN
  SELECT sal INTO v_sal FROM emp WHERE empno=p_empno;
  DBMS_OUTPUT.PUT_LINE('Sal: ' || v_sal);
END MostrarSal;`,
   q:'¿Qué cambiarías para convertirlo en una FUNCIÓN que devuelva el salario en lugar de imprimirlo?',
   opts:[
    'Cambiar PROCEDURE por FUNCTION, añadir RETURN NUMBER IS y sustituir PUT_LINE por RETURN v_sal',
    'Añadir un parámetro OUT',
    'Eliminar el SELECT INTO y usar un cursor',
    'Cambiar IN por OUT en p_empno'
   ],ans:0,
   exp:'Para convertirlo en función: CREATE OR REPLACE FUNCTION GetSal RETURN NUMBER IS ... BEGIN ... RETURN v_sal; END.'},
  {title:'Análisis de adaptación',
   scenario:'La función siguiente puede fallar si el empleado no existe (NO_DATA_FOUND).',
   code:`CREATE OR REPLACE FUNCTION GetSal(p_empno NUMBER)
RETURN NUMBER IS
  v_sal NUMBER;
BEGIN
  SELECT sal INTO v_sal FROM emp WHERE empno = p_empno;
  RETURN v_sal;
END GetSal;`,
   q:'¿Qué añadirías para que devuelva NULL en lugar de lanzar una excepción cuando no existe el empleado?',
   opts:[
    'Añadir EXCEPTION WHEN NO_DATA_FOUND THEN RETURN NULL;',
    'Añadir IF v_sal IS NULL THEN RETURN 0; END IF;',
    'Cambiar SELECT INTO por un cursor',
    'Añadir WHEN OTHERS THEN RAISE;'
   ],ans:0,
   exp:'Capturando NO_DATA_FOUND y devolviendo NULL, la función se comporta de forma más segura para el llamador.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// EPD10: PAQUETES
// ─────────────────────────────────────────────────────────────
{id:'epd10',tag:'PR 6',title:'Paquetes',
 desc:'CREATE PACKAGE, PACKAGE BODY, ámbitos, sobrecarga y matrices asociativas',
 teoria:[
  {title:'¿Qué es un paquete?',html:`
<p>Un <strong>paquete</strong> es una estructura PL/SQL que agrupa subprogramas relacionados (procedimientos, funciones, cursores, tipos, variables) como una biblioteca. Tiene dos partes:</p>
<ul>
  <li><strong>Especificación (cabecera):</strong> Interfaz pública — declara los nombres, tipos y cabeceras.</li>
  <li><strong>Cuerpo:</strong> Implementación — contiene el código de los subprogramas.</li>
</ul>
<p>Analogía Java: la especificación es como una <em>interfaz</em>; el cuerpo es como la <em>clase de implementación</em>.</p>`},
  {title:'Especificación del paquete',html:`
${codeBlock(`CREATE [OR REPLACE] PACKAGE ClassPackage AS

  -- Tipos
  TYPE t_StudentIDs IS TABLE OF students.id%TYPE
    INDEX BY BINARY_INTEGER;

  -- Excepción pública
  e_StudentNotRegistered EXCEPTION;

  -- Cabeceras de subprogramas (públicos)
  PROCEDURE AddStudent(
    p_StudentID IN students.id%TYPE,
    p_Dept      IN classes.department%TYPE,
    p_Course    IN classes.course%TYPE);

  PROCEDURE RemoveStudent(
    p_StudentID IN students.id%TYPE,
    p_Dept      IN classes.department%TYPE,
    p_Course    IN classes.course%TYPE);

  FUNCTION ClassInfo(
    p_Dept   IN classes.department%TYPE,
    p_Course IN classes.course%TYPE)
  RETURN VARCHAR2;

END ClassPackage;`)}
`},
  {title:'Cuerpo del paquete',html:`
${codeBlock(`CREATE [OR REPLACE] PACKAGE BODY ClassPackage AS

  PROCEDURE AddStudent(
    p_StudentID IN students.id%TYPE,
    p_Dept IN classes.department%TYPE,
    p_Course IN classes.course%TYPE) IS
  BEGIN
    INSERT INTO registered_students
      VALUES(p_StudentID, p_Dept, p_Course);
  END AddStudent;

  PROCEDURE RemoveStudent(
    p_StudentID IN students.id%TYPE,
    p_Dept IN classes.department%TYPE,
    p_Course IN classes.course%TYPE) IS
  BEGIN
    DELETE FROM registered_students
      WHERE student_id=p_StudentID
        AND department=p_Dept
        AND course=p_Course;
    IF SQL%NOTFOUND THEN
      RAISE e_StudentNotRegistered;
    END IF;
  END RemoveStudent;

END ClassPackage;`)}
<p>Para llamar desde fuera: <code>ClassPackage.AddStudent(10006,'HIS',101);</code></p>`},
  {title:'Ámbitos, sobrecarga y matrices asociativas',html:`
<p><strong>Público:</strong> todo lo declarado en la especificación es accesible externamente.<br>
<strong>Privado:</strong> lo declarado solo en el cuerpo (sin especificación) es privado del paquete.</p>
<p><strong>Sobrecarga:</strong> varios subprogramas con el mismo nombre pero distintos tipos/número de parámetros:</p>
${codeBlock(`-- En la especificación:
PROCEDURE AddStudent(p_StudentID IN students.id%TYPE, ...);
PROCEDURE AddStudent(p_FirstName IN students.first_name%TYPE,
                     p_LastName  IN students.last_name%TYPE, ...);`)}
<p>Restricciones de sobrecarga: no pueden diferir solo en modo (IN/OUT) ni solo en tipo de retorno.</p>
<p><strong>Matriz asociativa (TABLE OF ... INDEX BY):</strong></p>
${codeBlock(`TYPE t_Tabla IS TABLE OF NUMBER
  INDEX BY BINARY_INTEGER;  -- índice entero
-- o INDEX BY VARCHAR2(50) -- índice cadena

v_t t_Tabla;
v_t(1) := 100;
v_t(2) := 200;
DBMS_OUTPUT.PUT_LINE(v_t(1));`)}
`}
 ],
 test:[
  {q:'¿Qué contiene la ESPECIFICACIÓN de un paquete?',
   opts:['El código de implementación de los procedimientos','Solo las declaraciones de tipos','Los nombres, tipos y cabeceras (interfaz pública)','Solo las variables globales'],ans:2,
   exp:'La especificación (cabecera) actúa como interfaz: declara qué hay en el paquete sin el código. Es como una interfaz Java.'},
  {q:'¿Cómo se llama al procedimiento RemoveStudent del paquete ClassPackage?',
   opts:['RemoveStudent(10006)','ClassPackage→RemoveStudent(10006)','ClassPackage.RemoveStudent(10006,\'HIS\',101)','CALL ClassPackage.RemoveStudent'],ans:2,
   exp:'La sintaxis de acceso externo es paquete.subprograma(parámetros). El punto (.) separa el nombre del paquete del subprograma.'},
  {q:'Un subprograma declarado SOLO en el cuerpo del paquete (sin especificación) es...',
   opts:['Público y accesible desde fuera','Privado y solo accesible desde el cuerpo','Global a todos los paquetes','Equivalente a un bloque anónimo'],ans:1,
   exp:'Solo lo declarado en la especificación es público. Lo declarado únicamente en el cuerpo es privado al paquete.'},
  {q:'¿Qué es la SOBRECARGA (overloading) de subprogramas en paquetes?',
   opts:['Tener dos paquetes con el mismo nombre','Subprogramas con el mismo nombre pero diferentes tipos o número de parámetros','Remplazar un paquete con OR REPLACE','Llamar un paquete desde otro'],ans:1,
   exp:'Sobrecarga = mismo nombre, distinta firma de parámetros. Restricción: no pueden diferir solo en modo (IN/OUT) ni en tipo de retorno.'},
  {q:'¿Qué tipo de dato es  TYPE t_IDs IS TABLE OF NUMBER INDEX BY BINARY_INTEGER?',
   opts:['Una tabla SQL','Una tabla PL/SQL (matriz asociativa)','Un cursor','Un registro (RECORD)'],ans:1,
   exp:'Es una colección PL/SQL (matriz asociativa o array asociativo). Los índices son enteros o cadenas según el tipo INDEX BY.'}
 ],
 fill:[
  {title:'Escribe la especificación de un paquete con un procedimiento y una excepción',
   tpl:`{1} {2} REPLACE {3} EmpPackage {4}
  e_NoEmp {5};
  {6} AddEmp(
    p_empno {7} emp.empno%TYPE,
    p_sal   {8} emp.sal%TYPE
  );
END EmpPackage;`,
   ans:['CREATE','OR','PACKAGE','AS','EXCEPTION','PROCEDURE','IN','IN'],
   hint:'CREATE OR REPLACE PACKAGE nombre AS ... excepción EXCEPTION; PROCEDURE nombre(param IN tipo); END;'},
  {title:'Escribe el cuerpo del paquete implementando el procedimiento',
   tpl:`CREATE OR REPLACE {1} {2} EmpPackage {3}
  {4} AddEmp(
    p_empno {5} emp.empno%TYPE,
    p_sal   IN emp.sal%TYPE
  ) {6}
  BEGIN
    INSERT INTO emp(empno, sal) VALUES(p_empno, p_sal);
  {7} AddEmp;
{8} EmpPackage;`,
   ans:['PACKAGE','BODY','AS','PROCEDURE','IN','IS','END','END'],
   hint:'CREATE OR REPLACE PACKAGE BODY nombre AS PROCEDURE ... IS BEGIN ... END proc; END pkg;'}
 ],
 missing:[
  {title:'¿Qué palabra clave falta para que sea un CUERPO de paquete?',
   code:`CREATE OR REPLACE PACKAGE _______ MiPaquete AS
  PROCEDURE MiProc IS
  BEGIN
    NULL;
  END MiProc;
END MiPaquete;`,
   opts:['BODY','IMPL','CODE','DEFINITION'],ans:0,
   exp:'CREATE OR REPLACE PACKAGE BODY nombre AS ... es la sintaxis del cuerpo. Sin BODY es la especificación (cabecera).'},
  {title:'¿Qué falta al final del cuerpo del paquete?',
   code:`CREATE OR REPLACE PACKAGE BODY ClasePkg AS
  PROCEDURE Matricular(p_id NUMBER) IS
  BEGIN
    INSERT INTO registrados VALUES(p_id);
  END Matricular;
_______ ClasePkg;   -- ¿qué falta?`,
   opts:['END','CLOSE','FINISH','STOP'],ans:0,
   exp:'El cuerpo del paquete debe cerrarse con END nombre_paquete; igual que la especificación.'}
 ],
 order:[
  {title:'Ordena las partes de un paquete completo (spec + body)',
   lines:["END MiPkg;","CREATE OR REPLACE PACKAGE MiPkg AS","  PROCEDURE Saludar(p_nombre VARCHAR2);","END MiPkg;","CREATE OR REPLACE PACKAGE BODY MiPkg AS","  PROCEDURE Saludar(p_nombre VARCHAR2) IS","  BEGIN","    DBMS_OUTPUT.PUT_LINE('Hola ' || p_nombre);","  END Saludar;"],
   correct:[1,2,3,4,5,6,7,8,0]}
 ],
 change:[
  {title:'Análisis de adaptación',
   scenario:'Tienes dos procedimientos independientes almacenados: AddEmp y RemoveEmp.',
   code:`CREATE OR REPLACE PROCEDURE AddEmp(p_empno NUMBER) AS
BEGIN INSERT INTO emp(empno) VALUES(p_empno); END;

CREATE OR REPLACE PROCEDURE RemoveEmp(p_empno NUMBER) AS
BEGIN DELETE FROM emp WHERE empno=p_empno; END;`,
   q:'¿Cómo los organizarías en un PAQUETE para agruparlos y facilitar el mantenimiento?',
   opts:[
    'CREATE PACKAGE EmpPkg AS: declarar cabeceras de AddEmp y RemoveEmp; CREATE PACKAGE BODY EmpPkg AS: implementar ambos',
    'Unir los dos CREATE PROCEDURE en uno solo',
    'Añadir OR REPLACE a cada procedimiento',
    'Crear un trigger que llame a ambos'
   ],ans:0,
   exp:'Un paquete agrupa subprogramas relacionados: cabecera con las firmas (public interface) y cuerpo con la implementación.'},
  {title:'Análisis de adaptación',
   scenario:'El procedimiento AddStudent solo admite el ID del alumno.',
   code:`PROCEDURE AddStudent(p_StudentID IN students.id%TYPE, ...);`,
   q:'¿Cómo añadirías una versión que acepte nombre y apellidos en lugar de ID, usando SOBRECARGA?',
   opts:[
    'Declarar en la especificación del paquete un segundo PROCEDURE AddStudent con (p_FirstName, p_LastName...) y implementarlo en el cuerpo',
    'Crear un segundo procedimiento con nombre AddStudent2',
    'Añadir un parámetro opcional con DEFAULT NULL',
    'No es posible, los nombres deben ser únicos'
   ],ans:0,
   exp:'La sobrecarga permite el mismo nombre con distinta firma. Ambas versiones conviven en la especificación y el cuerpo del paquete.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// EPD11: REPASO GENERAL
// ─────────────────────────────────────────────────────────────
{id:'epd11',tag:'PR 7',title:'Repaso General PL/SQL',
 desc:'Ejercicios integrados que combinan bloques, cursores, excepciones, procedimientos y paquetes',
 teoria:[
  {title:'Resumen de conceptos EPD5–EPD10',html:`
<p>Este bloque de repaso integra todos los conceptos vistos. Usa la tabla siguiente para repasar rápidamente antes de los ejercicios:</p>
<table>
  <tr><th>Concepto</th><th>Sintaxis clave</th></tr>
  <tr><td>Bloque anónimo</td><td>DECLARE / BEGIN / [EXCEPTION] / END; /</td></tr>
  <tr><td>Variable %TYPE</td><td>v_sal emp.sal%TYPE := 0;</td></tr>
  <tr><td>SELECT INTO</td><td>SELECT col INTO var FROM tabla WHERE …;</td></tr>
  <tr><td>IF</td><td>IF cond THEN … ELSIF … ELSE … END IF;</td></tr>
  <tr><td>CASE expr</td><td>CASE var WHEN v1 THEN … ELSE … END CASE;</td></tr>
  <tr><td>LOOP + EXIT</td><td>LOOP … EXIT WHEN cond; END LOOP;</td></tr>
  <tr><td>WHILE</td><td>WHILE cond LOOP … END LOOP;</td></tr>
  <tr><td>FOR</td><td>FOR i IN [REVERSE] a..b LOOP … END LOOP;</td></tr>
  <tr><td>Cursor explícito</td><td>DECLARE CURSOR c IS SELECT…; OPEN c; FETCH c INTO v; EXIT WHEN c%NOTFOUND; CLOSE c;</td></tr>
  <tr><td>FOR cursor</td><td>FOR reg IN cursor LOOP … END LOOP;</td></tr>
  <tr><td>Excepción user</td><td>e_err EXCEPTION; RAISE e_err; EXCEPTION WHEN e_err THEN …</td></tr>
  <tr><td>RAISE_APP_ERROR</td><td>RAISE_APPLICATION_ERROR(-20001, 'msg');</td></tr>
  <tr><td>Procedimiento</td><td>CREATE OR REPLACE PROCEDURE p(par IN tipo) AS BEGIN … END p;</td></tr>
  <tr><td>Función</td><td>CREATE OR REPLACE FUNCTION f RETURN tipo IS BEGIN … RETURN v; END f;</td></tr>
  <tr><td>Paquete spec</td><td>CREATE OR REPLACE PACKAGE pkg AS … END pkg;</td></tr>
  <tr><td>Paquete body</td><td>CREATE OR REPLACE PACKAGE BODY pkg AS … END pkg;</td></tr>
</table>`},
  {title:'Integración: función ST_FU_INSERT_BOOK (EPD11)',html:`
<p>Ejemplo de función completa que integra múltiples conceptos:</p>
${codeBlock(`CREATE OR REPLACE FUNCTION ST_FU_INSERT_BOOK(
  p_title   IN books.title%TYPE,
  p_author1 IN books.author1%TYPE,
  p_author2 IN books.author2%TYPE DEFAULT NULL,
  p_author3 IN books.author3%TYPE DEFAULT NULL,
  p_author4 IN books.author4%TYPE DEFAULT NULL,
  p_OUT_ERROR OUT VARCHAR2
) RETURN NUMBER IS
  v_catalog books.catalog_number%TYPE;
  v_count   NUMBER;
BEGIN
  -- Validar parámetros obligatorios
  IF p_title IS NULL OR p_author1 IS NULL THEN
    p_OUT_ERROR := 'Debe indicar título y primer autor al menos';
    RETURN NULL;
  END IF;

  -- Comprobar si ya existe
  SELECT COUNT(*) INTO v_count FROM books WHERE title = p_title;
  IF v_count > 0 THEN
    p_OUT_ERROR := 'El libro ya existe';
    RETURN NULL;
  END IF;

  -- Obtener PK del último libro
  SELECT NVL(MAX(catalog_number),0)+1 INTO v_catalog FROM books;

  -- Insertar
  INSERT INTO books(catalog_number,title,author1,author2,author3,author4)
  VALUES(v_catalog, p_title, p_author1, p_author2, p_author3, p_author4);
  COMMIT;

  RETURN v_catalog;
EXCEPTION
  WHEN OTHERS THEN
    p_OUT_ERROR := SUBSTR(SQLERRM,1,200);
    RETURN NULL;
END ST_FU_INSERT_BOOK;`)}
`}
 ],
 test:[
  {q:'¿Cuál de estos objetos NO se puede invocar explícitamente desde un bloque PL/SQL?',
   opts:['Procedimiento almacenado','Función almacenada','Trigger','Procedimiento de paquete'],ans:2,
   exp:'Los triggers se invocan automáticamente ante eventos DML/DDL. No se pueden llamar explícitamente.'},
  {q:'¿Qué instrucción PL/SQL permite crear dinámicamente y ejecutar SQL que normalmente no está permitido dentro de bloques (como DDL)?',
   opts:['EXECUTE IMMEDIATE','DYNAMIC SQL','RUN SQL','PRAGMA'],ans:0,
   exp:'EXECUTE IMMEDIATE es la base del SQL dinámico en PL/SQL, que permite ejecutar DDL y cualquier SQL construido como cadena.'},
  {q:'Al llamar a ClassPackage.AddStudent, ¿qué tipo de objeto es ClassPackage?',
   opts:['Un esquema','Un paquete PL/SQL','Un sinónimo','Un trigger'],ans:1,
   exp:'ClassPackage es un paquete. La sintaxis paquete.subprograma es el modo de acceso externo a los miembros públicos.'},
  {q:'¿Qué atributo del cursor SQL implícito comprueba si una instrucción UPDATE no modificó ninguna fila?',
   opts:['SQL%FOUND','SQL%NOTFOUND','SQL%ROWCOUNT = 0','SQL%ISOPEN'],ans:1,
   exp:'SQL%NOTFOUND es TRUE si el DML (INSERT/UPDATE/DELETE) no afectó a ninguna fila. Muy útil para detectar actualizaciones vacías.'},
  {q:'¿Qué diferencia hay entre %TYPE aplicado a una variable escalar y %ROWTYPE aplicado a una tabla?',
   opts:['No hay diferencia','%TYPE hereda el tipo de una columna; %ROWTYPE hereda la estructura completa de una fila','%ROWTYPE es más eficiente','%TYPE incluye restricciones NOT NULL; %ROWTYPE no'],ans:1,
   exp:'%TYPE → tipo de una columna (ej. emp.sal%TYPE → NUMBER). %ROWTYPE → registro completo con todos los campos de la tabla.'}
 ],
 fill:[
  {title:'Completa el procedimiento ST_PR_FIND_BOOK que busca un libro por título',
   tpl:`CREATE OR REPLACE {1} ST_PR_FIND_BOOK(
  p_title         IN  books.title{2}TYPE,
  p_OUT_CATALOG   {3} books.catalog_number%TYPE,
  p_OUT_AUTHOR1   OUT books.author1%TYPE,
  p_OUT_ERROR     OUT VARCHAR2
) {4}
  v_count NUMBER;
BEGIN
  IF p_title {5} NULL THEN
    p_OUT_ERROR := 'No se puede buscar sin título';
    {6};
  END IF;
  SELECT {7}(*) INTO v_count FROM books WHERE title = p_title;
  IF v_count = 0 THEN
    p_OUT_ERROR := 'No existe libro con ese título';
    {8};
  END IF;
  SELECT catalog_number, author1
    INTO p_OUT_CATALOG, p_OUT_AUTHOR1
    FROM books WHERE title = p_title;
EXCEPTION
  WHEN {9} THEN
    p_OUT_ERROR := SUBSTR(SQLERRM, 1, 200);
END ST_PR_FIND_BOOK;`,
   ans:['PROCEDURE','%','OUT','IS','IS','RETURN','COUNT','RETURN','OTHERS'],
   hint:'PROCEDURE ... OUT tipo ... IS BEGIN ... RETURN (en proc. sale sin valor); COUNT(*); OTHERS'}
 ],
 missing:[
  {title:'¿Qué falta en esta función para que sea válida y segura?',
   code:`CREATE OR REPLACE FUNCTION GetCatalog(p_title VARCHAR2)
RETURN NUMBER IS
  v_cat NUMBER;
BEGIN
  SELECT catalog_number INTO v_cat
  FROM books WHERE title = p_title;
  RETURN v_cat;
  -- ¿qué sección falta aquí?
END GetCatalog;`,
   opts:['EXCEPTION WHEN NO_DATA_FOUND THEN RETURN NULL;','COMMIT;','CLOSE cursor;','BEGIN segunda vez'],ans:0,
   exp:'Sin la sección EXCEPTION, si el libro no existe la función lanza NO_DATA_FOUND al llamador sin control.'},
  {title:'¿Qué falta para que el paquete ST_PK_BOOKS esté COMPLETO y deployable?',
   code:`-- La especificación está creada:
CREATE OR REPLACE PACKAGE ST_PK_BOOKS AS
  FUNCTION ST_FU_INSERT_BOOK(...) RETURN NUMBER;
  PROCEDURE ST_PR_FIND_BOOK(...);
END ST_PK_BOOKS;

-- ¿Qué objeto falta crear a continuación?`,
   opts:['CREATE OR REPLACE PACKAGE BODY ST_PK_BOOKS AS ... END ST_PK_BOOKS;','Otro CREATE PACKAGE','Un trigger','Un sinónimo'],ans:0,
   exp:'La especificación declara la interfaz; el BODY contiene el código. Sin BODY el paquete compila pero no puede ejecutarse.'}
 ],
 order:[
  {title:'Ordena las partes clave de la función ST_FU_INSERT_BOOK',
   lines:[
    "  RETURN v_catalog;",
    "  INSERT INTO books VALUES(v_catalog, p_title, p_author1);",
    "  IF p_title IS NULL THEN p_OUT_ERROR:='Sin título'; RETURN NULL; END IF;",
    "CREATE OR REPLACE FUNCTION ST_FU_INSERT_BOOK(",
    "  p_title IN books.title%TYPE, p_OUT_ERROR OUT VARCHAR2)",
    "RETURN NUMBER IS",
    "  v_catalog NUMBER;",
    "BEGIN",
    "  SELECT NVL(MAX(catalog_number),0)+1 INTO v_catalog FROM books;",
    "EXCEPTION WHEN OTHERS THEN p_OUT_ERROR:=SQLERRM; RETURN NULL;",
    "END ST_FU_INSERT_BOOK;"
   ],
   correct:[3,4,5,6,7,2,8,1,0,9,10]}
 ],
 change:[
  {title:'Análisis de adaptación (EPD11 E2)',
   scenario:'La función ST_FU_INSERT_BOOK devuelve el catalog_number del libro insertado, o NULL si hay error.',
   code:`-- Comprueba si ya existe:
SELECT COUNT(*) INTO v_count FROM books WHERE title = p_title;
IF v_count > 0 THEN
  p_OUT_ERROR := 'El libro ya existe';
  RETURN NULL;
END IF;`,
   q:'¿Qué cambiarías si en vez de COUNT(*) quisieras usar una excepción para detectar que el libro ya existe?',
   opts:[
    "SELECT catalog_number INTO v_cat FROM books WHERE title=p_title; → si no lanza NO_DATA_FOUND, el libro ya existe; entonces RAISE_APPLICATION_ERROR",
    "Añadir WHERE ROWNUM=1",
    "Usar IF v_count IS NOT NULL",
    "Usar un cursor FOR y comprobar %ROWCOUNT"
   ],ans:0,
   exp:'Invirtiendo la lógica: si SELECT INTO NO lanza NO_DATA_FOUND es porque el libro existe. Se puede usar ese comportamiento con EXCEPTION.'},
  {title:'Análisis de adaptación (EPD11 E4)',
   scenario:'La función ST_FU_CHANGE_AUTHOR actualiza todos los libros donde aparece un autor, en cualquiera de los 4 campos.',
   code:`-- Recorre libros con el autor en author1
FOR reg IN (SELECT catalog_number FROM books WHERE author1 = p_old) LOOP
  UPDATE books SET author1 = p_new WHERE catalog_number = reg.catalog_number;
END LOOP;
-- (igual para author2, author3, author4)`,
   q:'¿Qué cambiarías para hacerlo en una sola instrucción UPDATE en lugar de un cursor por campo?',
   opts:[
    "UPDATE books SET author1=DECODE(author1,p_old,p_new,author1), author2=DECODE(author2,p_old,p_new,author2), ... WHERE p_old IN(author1,author2,author3,author4)",
    "Usar un MERGE INTO",
    "Usar un trigger",
    "Usar un FOR con ROWNUM"
   ],ans:0,
   exp:'DECODE o CASE dentro de SET permite actualizar condicionalmente cada campo en un solo UPDATE, eliminando la necesidad de cursor.'}
 ]
},

// ─────────────────────────────────────────────────────────────
// TEMA 3: CONCURRENCIA  (teoría + V/F razonado + problemas resueltos)
// ─────────────────────────────────────────────────────────────
{id:'tema3',tag:'Tema 3',title:'Concurrencia',
 desc:'Transacciones, ACID/BASE, planificaciones, grafo de precedencia, bloqueo en dos fases y control multiversión (Oracle/MongoDB)',
 tabs:['teoria','vf','problemas'],
 tabLabels:{vf:'⚖️ Verdadero / Falso', problemas:'🧩 Problemas resueltos'},
 teoria:[
  {title:'Transacciones, COMMIT/ROLLBACK, ACID y BASE',html:`
<p>Una <strong>transacción</strong> es un conjunto de acciones sobre la base de datos que se tratan como una <strong>única unidad</strong> (todo o nada). Ejemplo: una transferencia bancaria lee la cuenta origen, la modifica, modifica la cuenta destino e inserta un movimiento.</p>
<p>Toda transacción termina con <code>COMMIT</code> (confirma los cambios, se hacen permanentes) o <code>ROLLBACK</code> (rechaza los cambios, se deshacen).</p>
<p>En bases de datos <strong>relacionales</strong> las transacciones cumplen la regla <strong>ACID</strong>:</p>
<table>
  <tr><th>Propiedad</th><th>Significado</th></tr>
  <tr><td><strong>A</strong>tomicidad</td><td>La transacción se ejecuta entera o no se ejecuta en absoluto.</td></tr>
  <tr><td><strong>C</strong>onsistencia</td><td>La BD queda en un estado consistente tras ejecutar la transacción.</td></tr>
  <tr><td><strong>I</strong>solation (aislamiento)</td><td>Cada transacción se ejecuta como si estuviera sola en el sistema.</td></tr>
  <tr><td><strong>D</strong>urabilidad</td><td>Los cambios confirmados son permanentes.</td></tr>
</table>
<p>En sistemas <strong>NoSQL</strong> se sigue la regla <strong>BASE</strong>: <strong>B</strong>asically Available (replicación y distribución aseguran disponibilidad), <strong>S</strong>oft state (el estado puede cambiar con el tiempo) y <strong>E</strong>ventual consistency (los datos serán consistentes en el futuro, no de forma inmediata).</p>`},
  {title:'Concurrencia: ventajas, inconvenientes y planificación',html:`
<p>La <strong>concurrencia</strong> es la ejecución intercalada de varias transacciones gestionada por el SGBD.</p>
<p><strong>Ventajas:</strong> uso más eficiente de los recursos, mayor productividad, menos tiempos de espera y mayor disponibilidad de la BD.</p>
<p><strong>Inconvenientes:</strong> los recursos se comparten, puede haber escrituras simultáneas, versiones distintas del dato... ¿cómo mantener la consistencia y organizar la ejecución?</p>
<div class="tag-info">⚠️ <strong>Concurrencia ≠ paralelismo.</strong> Concurrencia es intercalar acciones de varias transacciones; paralelismo es ejecutarlas literalmente a la vez en distintos procesadores.</div>
<p>Una <strong>planificación</strong> (schedule) establece el orden en que se ejecutan las operaciones de un conjunto de transacciones, respetando el <strong>orden interno</strong> de cada transacción y asegurando la consistencia.</p>
<ul>
  <li><strong>Serie:</strong> las transacciones se ejecutan una tras otra, sin intercalado. Siempre es correcta, pero lenta.</li>
  <li><strong>Serializable:</strong> está intercalada, pero su resultado es equivalente a alguna planificación serie. Es lo que busca el planificador.</li>
</ul>`},
  {title:'Notación y conflictos entre acciones',html:`
<p>Para representar las planificaciones usamos:</p>
<ul>
  <li><code>ri(X)</code>: la transacción <em>i</em> <strong>lee</strong> el dato X.</li>
  <li><code>wi(X)</code>: la transacción <em>i</em> <strong>escribe</strong> el dato X.</li>
</ul>
<p>Deben respetarse el orden <strong>temporal</strong> (global) y el orden <strong>interno</strong> de cada transacción.</p>
<p><strong>Definición de conflicto:</strong> dos acciones de Ti y Tj están en conflicto si <strong>se refieren al mismo objeto</strong> y <strong>al menos una es de escritura</strong>.</p>
<table>
  <tr><th>Par de acciones</th><th>¿Intercambiables?</th></tr>
  <tr><td>ri(X), rj(Y)</td><td>Siempre (dos lecturas nunca entran en conflicto)</td></tr>
  <tr><td>wi(X), rj(Y)</td><td>No, si X = Y</td></tr>
  <tr><td>ri(X), wj(Y)</td><td>No, si X = Y</td></tr>
  <tr><td>wi(X), wj(Y)</td><td>No, si X = Y</td></tr>
</table>
<p><strong>Equivalencia por conflictos:</strong> S1 y S2 son conflicto-equivalentes si S1 puede transformarse en S2 mediante intercambios de acciones adyacentes <strong>no conflictivas</strong>. Una planificación es <strong>conflicto-serializable</strong> si es conflicto-equivalente a alguna planificación serie.</p>`},
  {title:'Grafo de precedencia',html:`
<p>Sea S una planificación. Decimos que <strong>T1 precede a T2</strong> (<code>T1 &lt; T2</code>) si:</p>
<ol>
  <li>Una acción A1 de T1 ocurre antes que una acción A2 de T2,</li>
  <li>A1 y A2 se refieren al mismo objeto, y</li>
  <li>al menos una de las acciones es de escritura.</li>
</ol>
<p>El <strong>grafo de precedencia</strong> tiene:</p>
<ul>
  <li><strong>Nodos:</strong> las transacciones de S.</li>
  <li><strong>Aristas:</strong> una arista <code>Ti → Tj</code> cuando <code>Ti &lt; Tj</code>.</li>
</ul>
<div class="tag-info">📐 <strong>Teorema:</strong> si el grafo de precedencia es <strong>acíclico</strong> ⇒ S es conflicto-serializable (equivalente a una planificación serie, obtenida con un orden topológico del grafo). Si tiene <strong>ciclos</strong> ⇒ S NO es conflicto-serializable.</div>
<p>Ojo: que dos planificaciones tengan el mismo grafo no implica que sean conflicto-equivalentes (la implicación solo es válida en un sentido).</p>`},
  {title:'Protocolo de bloqueo y bloqueo en dos fases (2PL)',html:`
<p>Añadimos dos acciones a la planificación: <code>bi(A)</code> = la transacción <em>i</em> <strong>bloquea</strong> el objeto A; <code>di(A)</code> = la transacción <em>i</em> <strong>desbloquea</strong> A.</p>
<p>Una planificación con bloqueos debe seguir tres reglas:</p>
<ol>
  <li><strong>Transacciones bien formadas:</strong> toda acción sobre un objeto va precedida de su bloqueo y seguida de su desbloqueo (<code>… bi(A) … pi(A) … di(A) …</code>), y la transacción libera todo lo que bloquea.</li>
  <li><strong>Planificación legal:</strong> un objeto bloqueado por Ti no puede ser bloqueado por otra Tj hasta que Ti lo desbloquee (no hay dos transacciones con el mismo objeto bloqueado a la vez).</li>
  <li><strong>Bloqueo en dos fases (2PL):</strong> cada transacción tiene una <strong>fase de crecimiento</strong> (solo adquiere bloqueos) y luego una <strong>fase de decrecimiento</strong> (solo libera). Una vez libera un bloqueo, no puede adquirir ninguno nuevo.</li>
</ol>
<div class="tag-info">✅ Si una planificación cumple las reglas 1, 2 y 3 ⇒ es <strong>conflicto-serializable</strong>. Pero <strong>2PL ⊂ conflicto-serializable</strong>: el 2PL es condición <em>suficiente</em>, no <em>necesaria</em> (hay planificaciones conflicto-serializables que no cumplen 2PL).</div>
<p><strong>Interbloqueo (deadlock):</strong> dos transacciones se esperan mutuamente porque cada una mantiene un bloqueo que la otra necesita. Si se detecta, el SGBD aborta (mata) una de ellas.</p>`},
  {title:'Oracle (multiversión) y MongoDB',html:`
<p>En <strong>Oracle</strong> la concurrencia se logra con <strong>bloqueos a nivel de fila</strong> y con <strong>multiversión del dato</strong>: en un instante un dato puede tener varias versiones temporales.</p>
<p><strong>Multiversion Timestamp Ordering (MVTO):</strong> cada transacción Ti tiene una marca temporal única <code>TS(Ti)</code>. Cada versión Qk de un dato guarda: el contenido, su marca de <strong>escritura</strong> (write-timestamp, E) y su marca de <strong>lectura</strong> (read-timestamp, L).</p>
<p>Para una operación de Ti, sea <strong>Qk la versión cuyo write-timestamp es el mayor ≤ TS(Ti)</strong>:</p>
<ul>
  <li><strong>read(Q):</strong> Ti lee de Qk y se actualiza su read-timestamp (se conserva la lectura más reciente). <em>Una lectura nunca provoca rollback.</em></li>
  <li><strong>write(Q):</strong> si <code>TS(Ti) &lt; read-timestamp(Qk)</code> ⇒ Ti hace <strong>rollback</strong>; si <code>TS(Ti) = write-timestamp(Qk)</code> ⇒ se <strong>sobrescribe</strong> Qk; en otro caso ⇒ se <strong>crea una nueva versión</strong>.</li>
</ul>
<p><strong>MongoDB:</strong></p>
<ul>
  <li><strong>MMAPv1</strong> (motor antiguo, deprecado en la versión 4.0): bloqueo a nivel de colección, varios lectores – un solo escritor.</li>
  <li><strong>WiredTiger</strong> (por defecto desde la 3.2): bloqueo a nivel de documento y control de concurrencia multiversión (MVCC).</li>
</ul>`}
 ],
 vf:[
  {q:'La propiedad de Atomicidad (ACID) garantiza que una transacción se ejecuta completamente o no se ejecuta en absoluto.',
   ans:true,exp:'Atomicidad = "todo o nada": si la transacción falla a la mitad, se hace ROLLBACK y la BD queda como si no se hubiera ejecutado.'},
  {q:'Los sistemas NoSQL que siguen el modelo BASE garantizan consistencia inmediata después de cada operación.',
   ans:false,exp:'BASE incluye Eventual Consistency: los datos serán consistentes en el futuro, no necesariamente de forma inmediata. La consistencia inmediata es propia de ACID.'},
  {q:'Concurrencia y paralelismo son exactamente lo mismo.',
   ans:false,exp:'Concurrencia es intercalar las acciones de varias transacciones (aunque haya un solo procesador); paralelismo es ejecutarlas literalmente a la vez. La concurrencia NO es paralelismo.'},
  {q:'Dos acciones están en conflicto solo si acceden al mismo objeto y al menos una de ellas es de escritura.',
   ans:true,exp:'Es la definición de conflicto. Por eso ri(X) y wj(X) o wi(X) y wj(X) entran en conflicto, pero ri(X) y rj(X) no.'},
  {q:'Las acciones ri(X) y rj(X) (dos lecturas sobre el mismo objeto) están en conflicto.',
   ans:false,exp:'Dos lecturas nunca entran en conflicto: ninguna modifica el dato, así que su orden es intercambiable.'},
  {q:'Una planificación es conflicto-serializable si y solo si su grafo de precedencia es acíclico.',
   ans:true,exp:'Es el teorema central: grafo acíclico ⇔ conflicto-serializable; un orden topológico del grafo da la planificación serie equivalente.'},
  {q:'Si el grafo de precedencia de una planificación tiene un ciclo, aún se puede encontrar una planificación serie equivalente.',
   ans:false,exp:'Un ciclo significa precedencias contradictorias (Ti<Tj y Tj<Ti): es imposible serializar. La planificación NO es conflicto-serializable.'},
  {q:'En el bloqueo en dos fases (2PL), una transacción puede adquirir un nuevo bloqueo después de haber liberado uno.',
   ans:false,exp:'En 2PL, tras liberar el primer bloqueo (inicio de la fase de decrecimiento) no se puede adquirir ningún bloqueo más. Crecer y luego decrecer.'},
  {q:'Toda planificación que cumple 2PL es conflicto-serializable, pero no toda planificación conflicto-serializable cumple 2PL.',
   ans:true,exp:'2PL ⊂ conflicto-serializable: el 2PL es condición suficiente pero no necesaria. Existen planificaciones serializables que no respetan 2PL.'},
  {q:'Para que una planificación sea legal, dos transacciones distintas pueden mantener bloqueado el mismo objeto a la vez.',
   ans:false,exp:'La regla de legalidad prohíbe exactamente eso: un objeto bloqueado por Ti no puede ser bloqueado por Tj hasta que Ti lo desbloquee.'},
  {q:'En el control multiversión de Oracle, una operación de lectura nunca provoca el rollback de la transacción.',
   ans:true,exp:'Las lecturas leen la versión adecuada (mayor E ≤ TS) y, como mucho, actualizan el read-timestamp. Solo las escrituras pueden provocar rollback.'},
  {q:'En MVCC de Oracle, si Ti escribe Q y TS(Ti) es menor que el read-timestamp de la versión seleccionada, se crea una nueva versión.',
   ans:false,exp:'En ese caso Ti hace ROLLBACK: una transacción más nueva ya leyó esa versión, así que escribir ahora rompería la coherencia temporal.'},
  {q:'Una transacción está "bien formada" si bloquea cada objeto antes de leerlo o escribirlo y lo desbloquea después.',
   ans:true,exp:'Es la regla 1: bi(A) … pi(A) … di(A), y además debe liberar todos los bloqueos que adquiere.'},
  {q:'Un interbloqueo (deadlock) ocurre cuando dos transacciones se esperan mutuamente; Oracle lo resuelve abortando una de ellas.',
   ans:true,exp:'Cada transacción mantiene un bloqueo que la otra necesita y ninguna avanza. Al detectarlo, el SGBD mata (aborta) una de las transacciones para romper el ciclo.'}
 ],
 problemas:[
  {label:'Problema 1',title:'Grafo de precedencia y los tres métodos',
   enunciado:`<p>Dado el schedule:</p><span class="sched">S = r5(A) w3(B) w2(A) w5(C) r4(C) r2(C) r4(D) w1(C) w3(D) r2(F) r1(E) w1(F) r7(X)</span>
   <p><b>a)</b> Calcula el grafo de precedencia. ¿Es S conflicto-serializable? Si lo es, da una secuencia serie equivalente.<br>
   <b>b)</b> Explica brevemente los tres métodos para determinar si una planificación es conflicto-serializable.</p>`,
   solucion:`
<h4>a) Grafo de precedencia</h4>
<p>Buscamos conflictos (mismo objeto y al menos una escritura), respetando el orden temporal:</p>
<ul>
  <li><b>A:</b> r5(A) antes de w2(A) ⇒ <code>T5→T2</code></li>
  <li><b>C:</b> w5(C) antes de r4(C), r2(C) y w1(C) ⇒ <code>T5→T4</code>, <code>T5→T2</code>, <code>T5→T1</code>; r4(C)→w1(C) ⇒ <code>T4→T1</code>; r2(C)→w1(C) ⇒ <code>T2→T1</code></li>
  <li><b>D:</b> r4(D) antes de w3(D) ⇒ <code>T4→T3</code></li>
  <li><b>F:</b> r2(F) antes de w1(F) ⇒ <code>T2→T1</code></li>
  <li><b>B, E, X:</b> una sola acción cada uno ⇒ sin conflicto. T7 queda aislado.</li>
</ul>
<div class="gph">Aristas: <b>T5→T2</b>, <b>T5→T4</b>, <b>T5→T1</b>, <b>T4→T1</b>, <b>T2→T1</b>, <b>T4→T3</b> · (T7 aislado)</div>
<div class="verdict yes">El grafo es ACÍCLICO ⇒ S SÍ es conflicto-serializable.</div>
<p>Un orden topológico (secuencia serie equivalente) es <b>T5 → T4 → T2 → T3 → T1</b> (T7 puede ir en cualquier posición):</p>
<span class="sched">r5(A) w5(C)  r4(C) r4(D)  w2(A) r2(C) r2(F)  w3(B) w3(D)  w1(C) r1(E) w1(F)  r7(X)</span>
<h4>b) Tres métodos para comprobar la conflicto-serializabilidad</h4>
<ol>
  <li><b>Intercambio de acciones no conflictivas adyacentes:</b> intentamos transformar S en una planificación serie intercambiando acciones adyacentes que NO estén en conflicto. Es el método directo, basado en la propia definición de conflicto-equivalencia.</li>
  <li><b>Grafo de precedencia:</b> construimos el grafo (nodos = transacciones, arista Ti→Tj si Ti&lt;Tj) y comprobamos si es acíclico. Es un test algorítmico eficiente (detección de ciclos); si es acíclico, el orden topológico da la serie equivalente.</li>
  <li><b>Protocolo de bloqueo en dos fases (2PL):</b> si la planificación cumple las tres reglas (bien formada, legal y 2PL) queda garantizada la conflicto-serializabilidad. Es un protocolo aplicable en tiempo de ejecución, sin analizar la planificación completa a posteriori.</li>
</ol>`},
  {label:'Problema 2',title:'Dos schedules: ¿conflicto-serializables?',
   enunciado:`<p>Dados los schedules:</p>
   <span class="sched">S1 = w3(A) w1(D) r3(A) r1(A) r3(B) w4(B) r2(A) r5(B) w2(C) w5(C)</span>
   <span class="sched">S2 = r5(A) w3(B) w2(A) w5(C) r4(C) r2(C) w8(Y) r4(D) w1(C) w3(D) r2(F) r1(E) w1(F) r7(X) w8(A) w5(Y)</span>
   <p><b>a)</b> Calcula los grafos de precedencia. ¿Son conflicto-serializables? Si lo son, indica a qué schedule serie equivalen.<br>
   <b>b)</b> ¿Qué características debe tener una planificación basada en bloqueo simple para asegurar que sea conflicto-serializable?</p>`,
   solucion:`
<h4>a.1) Grafo de S1</h4>
<ul>
  <li><b>A:</b> w3(A)→r1(A) ⇒ <code>T3→T1</code>; w3(A)→r2(A) ⇒ <code>T3→T2</code></li>
  <li><b>B:</b> r3(B)→w4(B) ⇒ <code>T3→T4</code>; w4(B)→r5(B) ⇒ <code>T4→T5</code></li>
  <li><b>C:</b> w2(C)→w5(C) ⇒ <code>T2→T5</code></li>
  <li><b>D:</b> solo w1(D), sin conflicto.</li>
</ul>
<div class="gph">Aristas: <b>T3→T1</b>, <b>T3→T2</b>, <b>T3→T4</b>, <b>T4→T5</b>, <b>T2→T5</b></div>
<div class="verdict yes">Acíclico ⇒ S1 SÍ es conflicto-serializable. Serie equivalente: <b>T3 → T1 → T2 → T4 → T5</b>.</div>
<h4>a.2) Grafo de S2</h4>
<p>S2 es S del Problema 1 con T8 y acciones extra sobre A e Y:</p>
<ul>
  <li><b>A:</b> r5(A)→w8(A) ⇒ <code>T5→T8</code> (y r5(A)→w2(A) ⇒ T5→T2, w2(A)→w8(A) ⇒ T2→T8)</li>
  <li><b>Y:</b> w8(Y)→w5(Y) ⇒ <code>T8→T5</code></li>
</ul>
<div class="gph">Tenemos <b>T5→T8</b> (por A) y <b>T8→T5</b> (por Y) ⇒ <b>CICLO T5↔T8</b></div>
<div class="verdict no">Hay un ciclo ⇒ S2 NO es conflicto-serializable.</div>
<h4>b) Bloqueo simple que garantiza conflicto-serializabilidad</h4>
<p>La planificación con bloqueos debe cumplir <b>las tres reglas</b>:</p>
<ol>
  <li><b>Transacciones bien formadas:</b> cada lectura/escritura va precedida de su bloqueo y seguida de su desbloqueo, y se liberan todos los bloqueos.</li>
  <li><b>Planificación legal:</b> ningún objeto está bloqueado por dos transacciones a la vez.</li>
  <li><b>Bloqueo en dos fases (2PL):</b> cada transacción adquiere todos sus bloqueos (fase de crecimiento) antes de liberar el primero (fase de decrecimiento).</li>
</ol>
<p>Cumpliendo las tres ⇒ la planificación es conflicto-serializable (condición suficiente).</p>`},
  {label:'Problema 3',title:'Bien formadas, legal, 2PL y grafo',
   enunciado:`<p>Dado el schedule con bloqueos:</p>
   <span class="sched">S = b5(A) b5(C) r5(A) b3(B) w3(B) d5(A) b2(A) w2(A) d2(A) w5(C) d5(C) b4(C) b4(D) r4(C) d4(C) b2(C) r2(C) d2(C) r4(D) d4(D) b1(C) b1(E) w1(C) b3(D) w3(D) b2(F) r2(F) d2(F) r1(E) b1(F) w1(F) b7(X) r7(X) d7(X) d3(B) d3(D) d1(C) d1(E) d1(F)</span>
   <p><b>a)</b> ¿Están las transacciones bien formadas? ¿Es la planificación legal?<br>
   <b>b)</b> ¿Es conflicto-serializable? Aplica en orden: 2PL, grafo de precedencia, intercambio de acciones. Para cuando uno confirme.<br>
   <b>c)</b> Si lo es, da una planificación serie equivalente (sin bloqueos).</p>`,
   solucion:`
<h4>a) ¿Bien formadas? ¿Legal?</h4>
<p><b>Bien formadas:</b> cada transacción bloquea antes de usar y desbloquea después, y libera todo:</p>
<table>
  <tr><th>Transacción</th><th>Objetos (bloqueo · uso · desbloqueo)</th></tr>
  <tr><td>T5</td><td>A: b5·r5·d5 — C: b5·w5·d5 ✓</td></tr>
  <tr><td>T3</td><td>B: b3·w3·d3 — D: b3·w3·d3 ✓</td></tr>
  <tr><td>T2</td><td>A: b2·w2·d2 — C: b2·r2·d2 — F: b2·r2·d2 ✓</td></tr>
  <tr><td>T4</td><td>C: b4·r4·d4 — D: b4·r4·d4 ✓</td></tr>
  <tr><td>T1</td><td>C: b1·w1·d1 — E: b1·r1·d1 — F: b1·w1·d1 ✓</td></tr>
  <tr><td>T7</td><td>X: b7·r7·d7 ✓</td></tr>
</table>
<p>Todas están <b>bien formadas</b>.</p>
<p><b>Legal:</b> revisamos que ningún objeto esté bloqueado por dos transacciones a la vez (intervalos por posición en S):</p>
<table>
  <tr><th>Objeto</th><th>Intervalos de bloqueo</th><th>¿Solape?</th></tr>
  <tr><td>A</td><td>T5 [1–6], T2 [7–9]</td><td>No</td></tr>
  <tr><td>C</td><td>T5 [2–11], T4 [12–15], T2 [16–18], T1 [21–37]</td><td>No</td></tr>
  <tr><td>B</td><td>T3 [4–35]</td><td>Único</td></tr>
  <tr><td>D</td><td>T4 [13–20], T3 [24–36]</td><td>No</td></tr>
  <tr><td>E</td><td>T1 [22–38]</td><td>Único</td></tr>
  <tr><td>F</td><td>T2 [26–28], T1 [30–39]</td><td>No</td></tr>
  <tr><td>X</td><td>T7 [32–34]</td><td>Único</td></tr>
</table>
<div class="verdict yes">Transacciones bien formadas y planificación LEGAL.</div>
<h4>b) ¿Conflicto-serializable?</h4>
<p><b>1º · Protocolo 2PL:</b> T2 desbloquea A (d2(A)) y MÁS TARDE bloquea C (b2(C)): adquiere un bloqueo después de liberar otro ⇒ <b>T2 NO cumple 2PL</b>. Como 2PL es suficiente pero no necesario, este método no confirma nada; pasamos al grafo.</p>
<p><b>2º · Grafo de precedencia:</b> sin los bloqueos, las acciones r/w son exactamente las del Problema 1:</p>
<span class="sched">r5(A) w3(B) w2(A) w5(C) r4(C) r2(C) r4(D) w1(C) w3(D) r2(F) r1(E) w1(F) r7(X)</span>
<div class="gph">Aristas: T5→T2, T5→T4, T5→T1, T4→T1, T2→T1, T4→T3 (T7 aislado)</div>
<div class="verdict yes">Grafo ACÍCLICO ⇒ la planificación SÍ es conflicto-serializable. Paramos aquí (no hace falta el método de intercambios).</div>
<h4>c) Planificación serie equivalente</h4>
<p>Orden topológico <b>T5 → T4 → T2 → T3 → T1</b> (T7 libre):</p>
<span class="sched">r5(A) w5(C)  r4(C) r4(D)  w2(A) r2(C) r2(F)  w3(B) w3(D)  w1(C) r1(E) w1(F)  r7(X)</span>`},
  {label:'Problema 4',title:'Grafo y, ¿se puede aplicar 2PL?',
   enunciado:`<p>Dado el schedule:</p>
   <span class="sched">S = r5(A) w3(B) w2(A) w5(C) r4(C) r2(C) r4(D) w1(C) w3(D) r2(F) r1(E) w1(F)</span>
   <p><b>a)</b> Calcula el grafo de precedencia. ¿Es conflicto-serializable? Si lo es, da una serie equivalente.<br>
   <b>b)</b> Asigna los bloqueos/desbloqueos para cumplir las reglas 1 y 2. Intenta además aplicar la regla 3 (2PL). ¿Es posible? <b>No se puede cambiar el orden de las acciones.</b></p>`,
   solucion:`
<h4>a) Grafo de precedencia</h4>
<p>Es el schedule del Problema 1 sin r7(X) (sin T7). Mismos conflictos:</p>
<div class="gph">Aristas: T5→T2, T5→T4, T5→T1, T4→T1, T2→T1, T4→T3</div>
<div class="verdict yes">Acíclico ⇒ conflicto-serializable. Serie equivalente: <b>T5 → T4 → T2 → T3 → T1</b>.</div>
<span class="sched">r5(A) w5(C)  r4(C) r4(D)  w2(A) r2(C) r2(F)  w3(B) w3(D)  w1(C) r1(E) w1(F)</span>
<h4>b) Bloqueos</h4>
<p><b>Reglas 1 y 2 (bien formadas + legal):</b> SÍ es posible, bloqueando justo antes de cada acción y desbloqueando justo después (los intervalos por objeto no solapan):</p>
<span class="sched">b5(A) r5(A) d5(A) b3(B) w3(B) d3(B) b2(A) w2(A) d2(A) b5(C) w5(C) d5(C) b4(C) r4(C) d4(C) b2(C) r2(C) d2(C) b4(D) r4(D) d4(D) b1(C) w1(C) d1(C) b3(D) w3(D) d3(D) b2(F) r2(F) d2(F) b1(E) r1(E) d1(E) b1(F) w1(F) d1(F)</span>
<p><b>Regla 3 (2PL): NO es posible</b> sin reordenar. Razonamiento:</p>
<ul>
  <li>T5 lee A (posición 1) y escribe C (posición 4). En 2PL, T5 no puede liberar el bloqueo de A hasta haber adquirido <em>todos</em> sus bloqueos, es decir, hasta bloquear C (justo antes de w5(C), posición 4).</li>
  <li>Pero T2 necesita escribir A con w2(A) en la posición 3, que es <b>anterior</b> a la 4. Para que sea legal, T5 debería haber liberado A antes de la posición 3; con 2PL solo puede hacerlo después de la 4.</li>
  <li>Contradicción: T5 mantiene A bloqueado cuando T2 lo necesita. Como no podemos reordenar w2(A), <b>2PL es imposible</b>.</li>
</ul>
<div class="verdict no">2PL imposible respetando el orden dado.</div>`},
  {label:'Problema 5',title:'Asignar bloqueos cumpliendo las 3 reglas',
   enunciado:`<p>Dado el schedule (con grafo de precedencia 3→1, 3→2, 3→4, 4→5, 2→5):</p>
   <span class="sched">S = w3(A) w1(D) r3(A) r1(A) r3(B) w4(B) r2(A) r5(B) w2(C) w5(C)</span>
   <p>Añade los bloqueos <code>Bi(X)</code> y desbloqueos <code>Di(X)</code> necesarios para cumplir las tres reglas (bien formadas, legal y 2PL), respetando el orden interno de cada transacción y el grafo de precedencia original.</p>`,
   solucion:`
<h4>Asignación (reglas 1, 2 y 3)</h4>
<p>S es conflicto-serializable (grafo acíclico, T3 precede a todas). Para 2PL cada transacción debe adquirir <b>todos</b> sus bloqueos antes de liberar el primero, y los intervalos no pueden solapar. La clave: T3 usa A y B, así que debe bloquear B <em>antes</em> de soltar A, para que T1 pueda tomar A en r1(A).</p>
<span class="sched">B3(A) w3(A) B3(B) B1(D) w1(D) r3(A) D3(A) B1(A) r1(A) r3(B) D3(B) D1(D) B4(B) w4(B) D4(B) D1(A) B2(A) r2(A) B5(B) r5(B) B2(C) w2(C) D2(C) D2(A) B5(C) w5(C) D5(B) D5(C)</span>
<p>Comprobación:</p>
<ul>
  <li><b>Bien formadas:</b> cada objeto se bloquea antes de usarse y se libera después; todas liberan todo. ✓</li>
  <li><b>Legal:</b> intervalos secuenciales por objeto — A: T3→T1→T2; B: T3→T4→T5; C: T2→T5; D: solo T1. Sin solapes. ✓</li>
  <li><b>2PL:</b> cada transacción crece y luego decrece (p. ej. T3 adquiere A y B antes de D3(A); T5 adquiere B y C antes de D5(B)). ✓</li>
</ul>
<div class="verdict yes">La planificación con estos bloqueos cumple las tres reglas.</div>
<p class="muted"><small>Nota: la solución no es única; cualquier asignación que respete las tres reglas y el orden es válida.</small></p>`},
  {label:'Problema 6',title:'Bloqueos y dónde falla el 2PL',
   enunciado:`<p>Dado el schedule:</p>
   <span class="sched">S = r5(B) w3(A) r4(C) r2(C) r4(D) w1(E) w3(D) w2(B) w1(C) r2(E) w5(B) w7(A) r7(B)</span>
   <p>Asigna los bloqueos/desbloqueos para cumplir las reglas 1 y 2. Aplica la regla 3 (2PL) siempre que puedas; si hay una situación que lo impide, indica qué acciones la provocan y por qué. <b>No se puede cambiar el orden.</b></p>`,
   solucion:`
<h4>Reglas 1 y 2</h4>
<p>Bloqueando justo antes y desbloqueando justo después de cada acción, las reglas 1 y 2 se cumplen (intervalos por objeto sin solape):</p>
<span class="sched">b5(B) r5(B) d5(B) b3(A) w3(A) d3(A) b4(C) r4(C) d4(C) b2(C) r2(C) d2(C) b4(D) r4(D) d4(D) b1(E) w1(E) d1(E) b3(D) w3(D) d3(D) b2(B) w2(B) d2(B) b1(C) w1(C) d1(C) b2(E) r2(E) d2(E) b5(B) w5(B) d5(B) b7(A) w7(A) d7(A) b7(B) r7(B) d7(B)</span>
<h4>Regla 3 (2PL): no se puede aplicar completa</h4>
<p>Acciones que lo impiden:</p>
<ul>
  <li><b>Objeto B con T5 y T2:</b> T5 lee B al principio (r5(B)) y lo escribe casi al final (w5(B)), con w2(B) de T2 en medio. Para ser legal, T5 debe liberar B antes de w2(B) y <b>volver a bloquear</b> B para w5(B): ese re-bloqueo rompe el 2PL. Además genera el ciclo <code>T5→T2</code> (r5(B)→w2(B)) y <code>T2→T5</code> (w2(B)→w5(B)).</li>
  <li><b>Objetos C/E con T1 y T2:</b> w1(E)→r2(E) da <code>T1→T2</code>, mientras que r2(C)→w1(C) da <code>T2→T1</code>: otro ciclo.</li>
</ul>
<div class="gph">Ciclos: <b>T2↔T5</b> (objeto B) y <b>T1↔T2</b> (objetos C/E)</div>
<div class="verdict no">Hay ciclos ⇒ la planificación NO es conflicto-serializable; por eso es imposible aplicar el 2PL respetando el orden dado.</div>`},
  {label:'Problema 7',title:'¿Conflicto-serializable con bloqueos dados?',
   enunciado:`<p>Dado el schedule con bloqueos:</p>
   <span class="sched">S = B3(A) w3(A) B1(D) w1(D) B3(B) r3(A) D3(A) B1(A) r1(A) D1(A) r3(B) D3(B) B4(B) w4(B) D4(B) B2(A) r2(A) B5(B) B2(C) r5(B) D5(B) w2(C) D2(C) B5(C) w5(C) D5(C) D1(D)</span>
   <p><b>a)</b> ¿Es conflicto-serializable? Aplica en orden: 2PL, grafo de precedencia, intercambio de acciones. Para cuando uno confirme.<br>
   <b>b)</b> Si lo es, da una planificación serie equivalente (sin bloqueos).</p>`,
   solucion:`
<h4>a) ¿Conflicto-serializable?</h4>
<p><b>1º · 2PL:</b> en T5 aparece D5(B) antes que B5(C): T5 libera B y luego bloquea C ⇒ adquiere un bloqueo tras liberar otro ⇒ <b>T5 NO cumple 2PL</b>. (Además, T2 bloquea A con B2(A) pero nunca la desbloquea, así que ni siquiera está bien formada.) El método no confirma; pasamos al grafo.</p>
<p><b>2º · Grafo de precedencia:</b> las acciones r/w son las del Problema 5:</p>
<span class="sched">w3(A) w1(D) r3(A) r1(A) r3(B) w4(B) r2(A) r5(B) w2(C) w5(C)</span>
<div class="gph">Aristas: T3→T1, T3→T2, T3→T4, T4→T5, T2→T5</div>
<div class="verdict yes">Grafo ACÍCLICO ⇒ SÍ es conflicto-serializable (aunque no cumpla 2PL: el 2PL es suficiente, no necesario). Paramos.</div>
<h4>b) Planificación serie equivalente</h4>
<p>Orden topológico <b>T3 → T1 → T2 → T4 → T5</b>:</p>
<span class="sched">w3(A) r3(A) r3(B)  w1(D) r1(A)  r2(A) w2(C)  w4(B)  r5(B) w5(C)</span>`},
  {label:'Problema 8',title:'Oracle multiversión — lecturas',
   enunciado:`<p>En el control de concurrencia multiversión de Oracle, indica el estado final de las versiones (L = read-timestamp, E = write-timestamp). Justifica.</p>
   <p><b>1)</b> La transacción T1, de las 17:15, quiere <b>leer</b> A.<br>Versiones: A<sup>L=17:20 E=17:00</sup>, A<sup>L=17:35 E=17:30</sup>, A<sup>L=18:05 E=18:00</sup></p>
   <p><b>2)</b> La transacción T2, de las 10:00, quiere <b>leer</b> A.<br>Versiones: A<sup>L=10:33 E=10:30</sup>, A<sup>L=10:45 E=10:35</sup>, A<sup>L=11:15 E=11:00</sup></p>`,
   solucion:`
<h4>Regla de lectura</h4>
<p>Para read(A) de Ti se elige la versión Ak con el mayor write-timestamp (E) ≤ TS(Ti); se lee y se actualiza su read-timestamp al valor más reciente. <b>Una lectura nunca aborta.</b></p>
<h4>Caso 1) T1 (17:15) lee A</h4>
<p>Mayor E ≤ 17:15: E=17:00 (1ª versión); las otras (17:30 y 18:00) son posteriores a 17:15. T1 lee esa versión. Su read-timestamp L=17:20 ya es <b>posterior</b> a 17:15, así que se conserva (se mantiene la lectura más reciente).</p>
<div class="verdict yes">Estado final = inicial (sin cambios): A<sup>L=17:20 E=17:00</sup>, A<sup>L=17:35 E=17:30</sup>, A<sup>L=18:05 E=18:00</sup>.</div>
<h4>Caso 2) T2 (10:00) lee A</h4>
<p>Las versiones tienen E = 10:30, 10:35 y 11:00. <b>Ninguna</b> cumple E ≤ 10:00: T2 es más antigua que todas las versiones existentes.</p>
<div class="verdict no">No existe versión adecuada para leer (el dato no existía en 10:00 — situación tipo "snapshot too old"). El estado de las versiones no cambia.</div>`},
  {label:'Problema 9',title:'Oracle multiversión — escrituras',
   enunciado:`<p>En el control multiversión de Oracle, indica el estado final tras cada escritura (L = read-timestamp, E = write-timestamp). Versiones de partida en los tres casos:</p>
   <span class="sched">A^(L=8:45 E=8:37)  A^(L=8:55 E=8:50)  A^(L=9:00 E=9:00)  A^(L=9:45 E=9:26)</span>
   <p><b>1)</b> T1 (8:38) quiere <b>escribir</b> A.  <b>2)</b> T2 (9:00) quiere <b>escribir</b> A.  <b>3)</b> T3 (9:10) quiere <b>escribir</b> A.</p>`,
   solucion:`
<h4>Regla de escritura</h4>
<p>Para write(A) de Ti, sea Ak la versión con mayor E ≤ TS(Ti):</p>
<ul>
  <li>Si <code>TS(Ti) &lt; L(Ak)</code> ⇒ Ti hace <b>rollback</b>.</li>
  <li>Si <code>TS(Ti) = E(Ak)</code> ⇒ se <b>sobrescribe</b> Ak.</li>
  <li>En otro caso ⇒ se <b>crea una nueva versión</b>.</li>
</ul>
<h4>Caso 1) T1 (8:38) escribe A</h4>
<p>Mayor E ≤ 8:38: E=8:37 (con L=8:45). Como <b>TS=8:38 &lt; L=8:45</b> (la versión ya fue leída por una transacción más nueva) ⇒ aplica la regla del rollback.</p>
<div class="verdict no">T1 hace ROLLBACK. Estado sin cambios.</div>
<h4>Caso 2) T2 (9:00) escribe A</h4>
<p>Mayor E ≤ 9:00: E=9:00 (con L=9:00). Como <b>TS=9:00 = E=9:00</b> ⇒ se sobrescribe esa versión (mismas marcas L y E, contenido nuevo).</p>
<div class="verdict yes">A<sup>L=8:45 E=8:37</sup>, A<sup>L=8:55 E=8:50</sup>, <b>A<sup>L=9:00 E=9:00</sup> (sobrescrita)</b>, A<sup>L=9:45 E=9:26</sup>.</div>
<h4>Caso 3) T3 (9:10) escribe A</h4>
<p>Mayor E ≤ 9:10: E=9:00. Como <b>TS=9:10 ≠ L=9:00 y ≠ E=9:00</b> ⇒ se crea una nueva versión con L=E=9:10.</p>
<div class="verdict yes">A<sup>L=8:45 E=8:37</sup>, A<sup>L=8:55 E=8:50</sup>, A<sup>L=9:00 E=9:00</sup>, <b>A<sup>L=9:10 E=9:10</sup> (nueva)</b>, A<sup>L=9:45 E=9:26</sup>.</div>`}
 ]
}

]; // end BLOCKS

// ============================================================
// STATE
// ============================================================
let curBlock = 0;
let curTab = 'teoria';

const scores = {};   // { blockId: { test:0, fill:0, missing:0, order:0, change:0, examen:0 } }
const answered = {}; // { 'blockId_tab_idx': {ok:bool, checked:true} }

BLOCKS.forEach(b=>{
  // examen: cuenta problemas aprobados (>=5/10) sobre total catalogado de la práctica
  const examT=(window.EXAM_CATALOG||[]).filter(p=>p.practice===b.id).length;
  scores[b.id]={test:0,fill:0,missing:0,order:0,change:0,examen:0,vf:0,
                testT:(b.test||[]).length,fillT:(b.fill||[]).length,
                missingT:(b.missing||[]).length,orderT:(b.order||[]).length,changeT:(b.change||[]).length,
                vfT:(b.vf||[]).length,examenT:examT};
});

// ============================================================
// HELPERS
// ============================================================
function key(tab,idx){return `${BLOCKS[curBlock].id}_${tab}_${idx}`;}

function totalScore(){
  let got=0,tot=0;
  Object.values(scores).forEach(s=>{
    got+=s.test+s.fill+s.missing+s.order+s.change+(s.examen||0)+(s.vf||0);
    tot+=s.testT+s.fillT+s.missingT+s.orderT+s.changeT+(s.examenT||0)+(s.vfT||0);
  });
  return {got,tot};
}

function blockScore(id){
  const s=scores[id];
  const got=s.test+s.fill+s.missing+s.order+s.change+(s.examen||0)+(s.vf||0);
  const tot=s.testT+s.fillT+s.missingT+s.orderT+s.changeT+(s.examenT||0)+(s.vfT||0);
  return {got,tot};
}

function updateGlobal(){
  const {got,tot}=totalScore();
  document.getElementById('global-score').textContent=`${got} / ${tot}`;
  document.getElementById('global-bar').style.width=tot?`${(got/tot)*100}%`:'0%';
}

function updateBlockBar(){
  const {got,tot}=blockScore(BLOCKS[curBlock].id);
  document.getElementById('block-bar').style.width=tot?`${(got/tot)*100}%`:'0%';
}

function showToast(msg,type='t-inf',dur=2500){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='show '+type;
  setTimeout(()=>t.className='',dur);
}

// ============================================================
// RENDER NAV
// ============================================================
function renderNav(){
  const nav=document.getElementById('block-nav');
  nav.innerHTML='';
  BLOCKS.forEach((b,i)=>{
    const {got,tot}=blockScore(b.id);
    const btn=document.createElement('button');
    btn.className='nav-btn'+(i===curBlock?' active':'');
    btn.innerHTML=`<span class="nav-tag">${b.tag}</span>
      <span class="nav-title">${b.title}</span>
      <span class="nav-pts">${got}/${tot}</span>`;
    btn.onclick=()=>{curBlock=i;curTab='teoria';render();};
    nav.appendChild(btn);
  });
}

// ============================================================
// RENDER HEADER
// ============================================================
function renderHeader(){
  const b=BLOCKS[curBlock];
  document.getElementById('header-tag').textContent=b.tag;
  document.getElementById('header-title').textContent=b.title;
  document.getElementById('header-desc').textContent=b.desc;
  updateBlockBar();
}

// ============================================================
// RENDER TABS
// ============================================================
const ALL_TABS={
  teoria:'📖 Teoría',
  test:'✅ Test',
  vf:'⚖️ V/F razonado',
  fill:'✏️ Rellena',
  missing:'🔍 ¿Qué falta?',
  order:'🔀 Ordena',
  change:'💡 ¿Qué cambiarías?',
  problemas:'🧩 Problemas resueltos',
  examen:'📝 Examen',
};
const DEFAULT_TAB_IDS=['teoria','test','fill','missing','order','change','examen'];
function blockTabs(b){
  const ids=b.tabs||DEFAULT_TAB_IDS;
  return ids.map(id=>({id,label:(b.tabLabels&&b.tabLabels[id])||ALL_TABS[id]}));
}
function renderTabs(){
  const bar=document.getElementById('tabs-bar');
  bar.innerHTML='';
  blockTabs(BLOCKS[curBlock]).forEach(t=>{
    const btn=document.createElement('button');
    btn.className='tab-btn'+(t.id===curTab?' active':'');
    btn.textContent=t.label;
    btn.onclick=()=>{curTab=t.id;renderContent();renderTabs();};
    bar.appendChild(btn);
  });
}

// ============================================================
// RENDER CONTENT — DISPATCH
// ============================================================
function renderContent(){
  const area=document.getElementById('content-area');
  const b=BLOCKS[curBlock];
  switch(curTab){
    case 'teoria':   area.innerHTML=renderTeoria(b); break;
    case 'test':     area.innerHTML=renderTest(b); bindTest(b); break;
    case 'vf':       area.innerHTML=renderVF(b); break;
    case 'fill':     area.innerHTML=renderFill(b); bindFill(b); break;
    case 'missing':  area.innerHTML=renderMissing(b); bindMissing(b); break;
    case 'order':    area.innerHTML=renderOrder(b); bindOrder(b); break;
    case 'change':   area.innerHTML=renderChange(b); bindChange(b); break;
    case 'problemas':area.innerHTML=renderProblemas(b); break;
    case 'examen':   area.innerHTML=renderExamen(b); bindExamen(b); break;
  }
}

// ============================================================
// TEORIA
// ============================================================
function renderTeoria(b){
  return `<div class="sec-intro">
    <h2>📖 Teoría</h2>
    <p>Conceptos fundamentales de ${b.title}</p>
  </div>
  <div class="ex-list">${b.teoria.map(s=>`
    <div class="th-card">
      <h3>${s.title}</h3>
      ${s.html}
    </div>`).join('')}</div>`;
}

// ============================================================
// TEST (Multiple Choice)
// ============================================================
function renderTest(b){
  const letters=['A','B','C','D'];
  return `<div class="sec-intro">
    <h2>✅ Test de opción múltiple</h2>
    <p>${b.test.length} preguntas · Elige la respuesta correcta</p>
  </div>
  <div class="ex-list">${b.test.map((q,i)=>{
    const k=key('test',i);
    const done=answered[k];
    return`<div class="ex-card${done?(done.ok?' ok':' ng'):''}" id="excard_test_${i}">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${q.q}</div>
      </div>
      <div class="mc-opts">
        ${q.opts.map((o,j)=>{
          let cls='mc-opt';
          if(done){
            if(j===q.ans)cls+=' reveal';
            if(j===done.chosen&&done.ok)cls+=' c-ok';
            if(j===done.chosen&&!done.ok)cls+=' c-ng';
          }
          return`<button class="${cls}" data-ex="${i}" data-opt="${j}" ${done?'disabled':''}
            onclick="answerTest(${i},${j})">
            <span class="opt-ltr">${letters[j]}</span>${o}
          </button>`;
        }).join('')}
      </div>
      <div class="fb ${done?(done.ok?'ok':'ng'):''}" id="fb_test_${i}">
        ${done?`${done.ok?'✅ Correcto':'❌ Incorrecto — '} ${q.exp}`:'' }
      </div>
    </div>`;
  }).join('')}</div>`;
}

function bindTest(){}
window.answerTest=function(i,j){
  const b=BLOCKS[curBlock];
  const q=b.test[i];
  const k=key('test',i);
  if(answered[k])return;
  const ok=j===q.ans;
  answered[k]={ok,chosen:j,checked:true};
  if(ok){scores[b.id].test++;showToast('✅ ¡Correcto!','t-ok');}
  else showToast('❌ Incorrecto — '+q.exp,'t-ng',4000);
  updateGlobal();updateBlockBar();renderNav();
  // re-render just this card
  const card=document.getElementById(`excard_test_${i}`);
  const letters=['A','B','C','D'];
  card.className='ex-card'+(ok?' ok':' ng');
  card.querySelectorAll('.mc-opt').forEach((btn,jj)=>{
    btn.disabled=true;
    if(jj===q.ans)btn.className='mc-opt reveal';
    if(jj===j&&ok)btn.className='mc-opt c-ok';
    if(jj===j&&!ok)btn.className='mc-opt c-ng';
  });
  const fb=document.getElementById(`fb_test_${i}`);
  fb.className='fb '+(ok?'ok':'ng');
  fb.textContent=(ok?'✅ Correcto — ':'❌ Incorrecto — ')+q.exp;
};

// ============================================================
// V/F RAZONADO (Verdadero / Falso)
// ============================================================
function renderVF(b){
  const labels=['Verdadero','Falso'];
  return `<div class="sec-intro">
    <h2>⚖️ Verdadero / Falso razonado</h2>
    <p>${b.vf.length} afirmaciones · Decide si son verdaderas o falsas y comprueba el razonamiento</p>
  </div>
  <div class="ex-list">${b.vf.map((q,i)=>{
    const k=key('vf',i);
    const done=answered[k];
    const correctIdx=q.ans?0:1;
    return`<div class="ex-card${done?(done.ok?' ok':' ng'):''}" id="excard_vf_${i}">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${q.q}</div>
      </div>
      <div class="mc-opts">
        ${labels.map((o,j)=>{
          let cls='mc-opt';
          if(done){
            if(j===correctIdx)cls+=' reveal';
            if(j===done.chosen&&done.ok)cls+=' c-ok';
            if(j===done.chosen&&!done.ok)cls+=' c-ng';
          }
          return`<button class="${cls}" ${done?'disabled':''}
            onclick="answerVF(${i},${j===0})">
            <span class="opt-ltr">${j===0?'V':'F'}</span>${o}
          </button>`;
        }).join('')}
      </div>
      <div class="fb ${done?(done.ok?'ok':'ng'):''}" id="fb_vf_${i}">
        ${done?`${done.ok?'✅ Correcto':'❌ Incorrecto'} — ${q.exp}`:''}
      </div>
    </div>`;
  }).join('')}</div>`;
}
window.answerVF=function(i,chosenTrue){
  const b=BLOCKS[curBlock];
  const q=b.vf[i];
  const k=key('vf',i);
  if(answered[k])return;
  const chosen=chosenTrue?0:1;
  const ok=(chosenTrue===q.ans);
  answered[k]={ok,chosen,checked:true};
  if(ok){scores[b.id].vf++;showToast('✅ ¡Correcto!','t-ok');}
  else showToast('❌ Incorrecto — '+q.exp,'t-ng',4500);
  updateGlobal();updateBlockBar();renderNav();
  const card=document.getElementById(`excard_vf_${i}`);
  card.className='ex-card'+(ok?' ok':' ng');
  const correctIdx=q.ans?0:1;
  card.querySelectorAll('.mc-opt').forEach((btn,jj)=>{
    btn.disabled=true;
    btn.className='mc-opt';
    if(jj===correctIdx)btn.className='mc-opt reveal';
    if(jj===chosen&&ok)btn.className='mc-opt c-ok';
    if(jj===chosen&&!ok)btn.className='mc-opt c-ng';
  });
  const fb=document.getElementById(`fb_vf_${i}`);
  fb.className='fb '+(ok?'ok':'ng');
  fb.textContent=(ok?'✅ Correcto':'❌ Incorrecto')+' — '+q.exp;
};

// ============================================================
// PROBLEMAS RESUELTOS (solo lectura, con solución desplegable)
// ============================================================
function renderProblemas(b){
  return `<div class="sec-intro">
    <h2>🧩 Problemas resueltos</h2>
    <p>${b.problemas.length} problemas del boletín "Tema 3: Concurrencia" con resolución razonada paso a paso</p>
  </div>
  <div class="ex-list">${b.problemas.map((p,i)=>`
    <div class="ex-card prob-card">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${p.label?`<span class="exam-lbl">${p.label}</span> · `:''}${p.title}</div>
      </div>
      <div class="prob-enun">${p.enunciado}</div>
      <details class="prob-sol">
        <summary>Ver solución paso a paso</summary>
        <div class="prob-sol-body">${p.solucion}</div>
      </details>
    </div>`).join('')}</div>`;
}

// ============================================================
// FILL IN THE BLANK
// ============================================================
function renderFill(b){
  return `<div class="sec-intro">
    <h2>✏️ Rellena los huecos</h2>
    <p>Escribe las palabras clave o símbolos que faltan en el código</p>
  </div>
  <div class="ex-list">${b.fill.map((f,i)=>{
    const k=key('fill',i);
    const done=answered[k];
    return`<div class="ex-card${done?(done.ok?' ok':' ng'):''}" id="excard_fill_${i}">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${f.title}</div>
      </div>
      <div class="fill-code">${fillTemplate(f.tpl,i)}</div>
      <div class="hint">💡 ${f.hint}</div>
      ${!done?`<button class="btn" onclick="checkFill(${i})">Comprobar</button>`:''}
      <div class="fb ${done?(done.ok?'ok':'ng'):''}" id="fb_fill_${i}">
        ${done?(done.ok?'✅ ¡Todas correctas!':
          `❌ Respuestas: ${f.ans.filter(a=>a).join(' · ')}`):''}
      </div>
    </div>`;
  }).join('')}</div>`;
}
function bindFill(){}
window.checkFill=function(i){
  const b=BLOCKS[curBlock];
  const f=b.fill[i];
  const k=key('fill',i);
  if(answered[k])return;
  const inputs=document.querySelectorAll(`.fill-inp[data-ex="${i}"]`);
  let allOk=true;
  inputs.forEach(inp=>{
    const bNum=inp.dataset.b;
    const correct=f.ans[parseInt(bNum)-1]||'';
    const val=inp.value.trim().toUpperCase();
    const ok=val===correct.toUpperCase();
    inp.className='fill-inp '+(ok?'ok':'ng');
    inp.disabled=true;
    if(!ok)allOk=false;
  });
  answered[k]={ok:allOk,checked:true};
  if(allOk){scores[b.id].fill++;showToast('✅ ¡Perfecto!','t-ok');}
  else showToast('❌ Algún hueco incorrecto','t-ng',3000);
  updateGlobal();updateBlockBar();renderNav();
  const fb=document.getElementById(`fb_fill_${i}`);
  fb.className='fb '+(allOk?'ok':'ng');
  fb.textContent=allOk?'✅ ¡Todas correctas!':
    `❌ Las respuestas correctas son: ${f.ans.filter(a=>a).join(' · ')}`;
  document.querySelector(`.ex-card[id="excard_fill_${i}"] .btn`)?.remove();
  document.getElementById(`excard_fill_${i}`).className='ex-card'+(allOk?' ok':' ng');
};

// ============================================================
// MISSING
// ============================================================
function renderMissing(b){
  const letters=['A','B','C','D'];
  return `<div class="sec-intro">
    <h2>🔍 ¿Qué falta?</h2>
    <p>Identifica la instrucción o palabra clave que falta en el código</p>
  </div>
  <div class="ex-list">${b.missing.map((m,i)=>{
    const k=key('missing',i);
    const done=answered[k];
    return`<div class="ex-card${done?(done.ok?' ok':' ng'):''}" id="excard_miss_${i}">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${m.title}</div>
      </div>
      <pre>${hl(m.code)}</pre>
      <div class="mc-opts">
        ${m.opts.map((o,j)=>{
          let cls='mc-opt';
          if(done){
            if(j===m.ans)cls+=' reveal';
            if(j===done.chosen&&done.ok)cls+=' c-ok';
            if(j===done.chosen&&!done.ok)cls+=' c-ng';
          }
          return`<button class="${cls}" data-ex="${i}" data-opt="${j}" ${done?'disabled':''}
            onclick="answerMissing(${i},${j})">
            <span class="opt-ltr">${letters[j]}</span>${o}
          </button>`;
        }).join('')}
      </div>
      <div class="fb ${done?(done.ok?'ok':'ng'):''}" id="fb_miss_${i}">
        ${done?`${done.ok?'✅ Correcto':'❌ Incorrecto'} — ${m.exp}`:''}
      </div>
    </div>`;
  }).join('')}</div>`;
}
function bindMissing(){}
window.answerMissing=function(i,j){
  const b=BLOCKS[curBlock];
  const m=b.missing[i];
  const k=key('missing',i);
  if(answered[k])return;
  const ok=j===m.ans;
  answered[k]={ok,chosen:j,checked:true};
  if(ok){scores[b.id].missing++;showToast('✅ ¡Correcto!','t-ok');}
  else showToast('❌ Incorrecto — '+m.exp,'t-ng',4000);
  updateGlobal();updateBlockBar();renderNav();
  const card=document.getElementById(`excard_miss_${i}`);
  card.className='ex-card'+(ok?' ok':' ng');
  card.querySelectorAll('.mc-opt').forEach((btn,jj)=>{
    btn.disabled=true;
    if(jj===m.ans)btn.className='mc-opt reveal';
    if(jj===j&&ok)btn.className='mc-opt c-ok';
    if(jj===j&&!ok)btn.className='mc-opt c-ng';
  });
  const fb=document.getElementById(`fb_miss_${i}`);
  fb.className='fb '+(ok?'ok':'ng');
  fb.textContent=(ok?'✅ Correcto':'❌ Incorrecto')+' — '+m.exp;
};

// ============================================================
// ORDER
// ============================================================
const orderState={};

function renderOrder(b){
  return `<div class="sec-intro">
    <h2>🔀 Ordena el código</h2>
    <p>Haz clic en las líneas en el orden correcto para construir el bloque PL/SQL</p>
  </div>
  <div class="ex-list">${b.order.map((o,i)=>{
    const k=key('order',i);
    const done=answered[k];
    if(!orderState[k])orderState[k]={built:[],available:[...Array(o.lines.length).keys()]};
    const st=orderState[k];
    return`<div class="ex-card${done?(done.ok?' ok':' ng'):''}" id="excard_ord_${i}">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${o.title}</div>
      </div>
      <div class="ord-wrap">
        <div>
          <div class="ord-labels"><span class="ord-lbl">Código construido</span></div>
          <div class="ord-built ${st.built.length?'has':''}" id="ord_built_${i}">
            ${st.built.map((li,pos)=>`<div class="built-line">
              <span>${o.lines[li]}</span>
              ${!done?`<span class="rm-line" onclick="removeOrdLine(${i},${pos})">×</span>`:''}
            </div>`).join('')}
          </div>
          ${!done&&st.available.length===0?
            `<button class="btn" onclick="checkOrder(${i})">✓ Comprobar</button>
             <button class="btn sec" onclick="resetOrder(${i})">↺ Reiniciar</button>`:''}
          ${done?`<div class="fb ${done.ok?'ok':'ng'}">${done.ok?'✅ ¡Orden correcto!':'❌ Orden incorrecto — inténtalo de nuevo'}</div>`:''}
        </div>
        <div>
          <div class="ord-labels"><span class="ord-lbl">Líneas disponibles</span></div>
          <div class="ord-pool" id="ord_pool_${i}">
            ${o.lines.map((l,li)=>`<button class="ord-line${st.available.includes(li)?'':' placed'}"
              id="ordline_${i}_${li}" ${!st.available.includes(li)||done?'disabled':''}
              onclick="addOrdLine(${i},${li})">${l}</button>`).join('')}
          </div>
          ${!done&&st.available.length>0?
            `<button class="btn sec" style="margin-top:8px" onclick="resetOrder(${i})">↺ Reiniciar</button>`:''}
        </div>
      </div>
    </div>`;
  }).join('')}</div>`;
}
function bindOrder(){}

window.addOrdLine=function(i,li){
  const b=BLOCKS[curBlock];
  const k=key('order',i);
  if(answered[k])return;
  const st=orderState[k];
  if(!st.available.includes(li))return;
  st.built.push(li);
  st.available=st.available.filter(x=>x!==li);
  renderContent();
};
window.removeOrdLine=function(i,pos){
  const k=key('order',i);
  const st=orderState[k];
  const li=st.built[pos];
  st.built.splice(pos,1);
  st.available.push(li);
  st.available.sort((a,b)=>a-b);
  renderContent();
};
window.resetOrder=function(i){
  const b=BLOCKS[curBlock];
  const k=key('order',i);
  orderState[k]={built:[],available:[...Array(b.order[i].lines.length).keys()]};
  renderContent();
};
window.checkOrder=function(i){
  const b=BLOCKS[curBlock];
  const o=b.order[i];
  const k=key('order',i);
  if(answered[k])return;
  const st=orderState[k];
  const ok=st.built.every((li,pos)=>o.correct[pos]===li);
  answered[k]={ok,checked:true};
  if(ok){scores[b.id].order++;showToast('✅ ¡Orden perfecto!','t-ok');}
  else showToast('❌ El orden no es correcto. Inténtalo de nuevo.','t-ng',3500);
  if(!ok)delete answered[k]; // allow retry
  updateGlobal();updateBlockBar();renderNav();
  renderContent();
};

// ============================================================
// CHANGE
// ============================================================
function renderChange(b){
  const letters=['A','B','C','D'];
  return `<div class="sec-intro">
    <h2>💡 ¿Qué cambiarías?</h2>
    <p>Analiza el código y responde qué modificación aplicarías ante un nuevo requisito</p>
  </div>
  <div class="ex-list">${b.change.map((c,i)=>{
    const k=key('change',i);
    const done=answered[k];
    return`<div class="ex-card${done?(done.ok?' ok':' ng'):''}" id="excard_chg_${i}">
      <div class="ex-head">
        <div class="ex-num">${i+1}</div>
        <div class="ex-q">${c.title}</div>
      </div>
      <div class="scenario-box">${c.scenario}</div>
      <pre>${hl(c.code)}</pre>
      <div class="change-q">❓ ${c.q}</div>
      <div class="mc-opts">
        ${c.opts.map((o,j)=>{
          let cls='mc-opt';
          if(done){
            if(j===c.ans)cls+=' reveal';
            if(j===done.chosen&&done.ok)cls+=' c-ok';
            if(j===done.chosen&&!done.ok)cls+=' c-ng';
          }
          return`<button class="${cls}" ${done?'disabled':''}
            onclick="answerChange(${i},${j})">
            <span class="opt-ltr">${letters[j]}</span>${o}
          </button>`;
        }).join('')}
      </div>
      <div class="fb ${done?(done.ok?'ok':'ng'):''}" id="fb_chg_${i}">
        ${done?`${done.ok?'✅ Correcto':'❌ Incorrecto'} — ${c.exp}`:''}
      </div>
    </div>`;
  }).join('')}</div>`;
}
function bindChange(){}
window.answerChange=function(i,j){
  const b=BLOCKS[curBlock];
  const c=b.change[i];
  const k=key('change',i);
  if(answered[k])return;
  const ok=j===c.ans;
  answered[k]={ok,chosen:j,checked:true};
  if(ok){scores[b.id].change++;showToast('✅ ¡Correcto!','t-ok');}
  else showToast('❌ Incorrecto — '+c.exp,'t-ng',4500);
  updateGlobal();updateBlockBar();renderNav();
  const card=document.getElementById(`excard_chg_${i}`);
  card.className='ex-card'+(ok?' ok':' ng');
  card.querySelectorAll('.mc-opt').forEach((btn,jj)=>{
    btn.disabled=true;
    if(jj===c.ans)btn.className='mc-opt reveal';
    if(jj===j&&ok)btn.className='mc-opt c-ok';
    if(jj===j&&!ok)btn.className='mc-opt c-ng';
  });
  const fb=document.getElementById(`fb_chg_${i}`);
  fb.className='fb '+(ok?'ok':'ng');
  fb.textContent=(ok?'✅ Correcto':'❌ Incorrecto')+' — '+c.exp;
};

// ============================================================
// EXAMEN — selección recursiva de huecos, render y comprobación
// ============================================================
const EXAM_CATS=['keywords','cursors','params','exceptions'];
const EXAM_CAT_LABEL={keywords:'Keywords',cursors:'Cursores',params:'Params',exceptions:'Excepciones'};

// Estado en memoria por práctica: problema seleccionado y huecos actuales
const examState={}; // { blockId: { problem, gaps, results, score, lastScore } }

// ── LocalStorage helpers ────────────────────────────────────
function lsGet(k,def){
  try{const v=localStorage.getItem(k);return v==null?def:JSON.parse(v);}
  catch(e){return def;}
}
function lsSet(k,v){
  try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}
}
function examHist(id){return lsGet('examHist:'+id,[]);}
function pushExamHist(id,nota){
  const h=examHist(id);h.push(nota);while(h.length>5)h.shift();
  lsSet('examHist:'+id,h);
}
function examAvg(id){
  const h=examHist(id);if(!h.length)return 5;
  return h.reduce((a,b)=>a+b,0)/h.length;
}
function getExamCats(){
  const saved=lsGet('examCats',null);
  if(!saved||!Array.isArray(saved)||!saved.length)return EXAM_CATS.slice();
  const f=saved.filter(c=>EXAM_CATS.includes(c));
  return f.length?f:EXAM_CATS.slice();
}
function setExamCats(arr){lsSet('examCats',arr);}

// ── Fisher-Yates shuffle ────────────────────────────────────
function shuffle(arr){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

// ── Targetazo de pesos según historial ──────────────────────
function targetWeight(avg){
  if(avg<5)return 1.2;
  if(avg<=8)return 2.0;
  return 2.7;
}

// ── Selección RECURSIVA de huecos ───────────────────────────
// pool: array barajado de gaps disponibles
// chosen: gaps ya elegidos
// nGaps: cuántos faltan
// target: peso medio objetivo
function pickRec(pool,chosen,nGaps,target){
  if(chosen.length>=nGaps||pool.length===0)return chosen;
  // elige del pool el gap que acerque más la media al target
  const curSum=chosen.reduce((a,g)=>a+g.weight,0);
  let bestIdx=0,bestDelta=Infinity;
  for(let i=0;i<pool.length;i++){
    const newAvg=(curSum+pool[i].weight)/(chosen.length+1);
    const delta=Math.abs(newAvg-target);
    if(delta<bestDelta){bestDelta=delta;bestIdx=i;}
  }
  const picked=pool[bestIdx];
  const rest=pool.slice(0,bestIdx).concat(pool.slice(bestIdx+1));
  return pickRec(rest,chosen.concat([picked]),nGaps,target);
}

// ── pickGaps: devuelve huecos elegidos en orden de aparición ─
function pickGaps(problem){
  const cats=getExamCats();
  const avg=examAvg(problem.id);
  const target=targetWeight(avg);
  const nGaps=Math.min(3+(problem.difficulty||1),
    cats.reduce((s,c)=>s+(problem.gaps[c]||[]).length,0));
  if(nGaps<=0)return [];

  // Concatena gaps de categorías habilitadas, etiquetando con su categoría
  let all=[];
  cats.forEach(c=>{
    (problem.gaps[c]||[]).forEach(g=>all.push(Object.assign({cat:c},g)));
  });
  if(all.length<=nGaps){
    return sortGaps(all);
  }

  // Antirepetición de la ronda anterior
  const prevKey='lastGaps:'+problem.id;
  const prev=(lsGet(prevKey,[])||[]).join('|');
  let selected=null;
  for(let attempt=0;attempt<3;attempt++){
    const pool=shuffle(all);
    const picked=pickRec(pool,[],nGaps,target);
    const sig=picked.map(gapKey).sort().join('|');
    if(sig!==prev){selected=picked;break;}
    selected=picked;
  }
  lsSet(prevKey,selected.map(gapKey).sort());
  return sortGaps(selected);
}
function gapKey(g){return g.cat+':'+g.token+':'+g.line+':'+g.occurrence;}
function sortGaps(gs){
  return gs.slice().sort((a,b)=>{
    if(a.line!==b.line)return a.line-b.line;
    return (a.occurrence||1)-(b.occurrence||1);
  });
}

// ── Sustitución de tokens preservando líneas y highlight ────
// Estrategia: trabajar línea a línea sobre el código RAW; en cada línea
// reemplazar la N-ésima ocurrencia EXACTA del token por un marcador único
// __GAP_<idx>__. Después aplicar hl() y por último sustituir cada marcador
// por su <input>. Así el resaltado nunca rompe los inputs.
function replaceNthOccurrence(line,token,n){
  if(!token)return {line,ok:false};
  // Para tokens que empiezan por '%' (%TYPE, %ROWTYPE) no exigimos boundary izquierda
  const isPct=token.startsWith('%');
  const esc=token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  // Búsqueda case-insensitive (los gaps están en mayúsculas pero solution puede variar)
  const re=new RegExp(esc,'gi');
  let m,count=0,startIdx=-1,endIdx=-1;
  while((m=re.exec(line))!==null){
    // boundary derecha (no consumir si el siguiente char es alfanumérico distinto)
    const after=line[m.index+m[0].length];
    const before=line[m.index-1];
    const okRight=!after||!/[A-Za-z0-9_]/.test(after)||token.endsWith('%');
    const okLeft=isPct||!before||!/[A-Za-z0-9_%]/.test(before);
    if(!okRight||!okLeft)continue;
    count++;
    if(count===n){startIdx=m.index;endIdx=m.index+m[0].length;break;}
  }
  if(startIdx<0)return {line,ok:false};
  // Marcador 'MARK__KRAM' (ASCII alfanumerico+underscore: hl() lo trata como palabra
  // y, al no estar en KWS/FNS, lo escribe sin span). El indice unico se inyecta en
  // buildExamCode despues.
  return {line:line.slice(0,startIdx)+'MARK__KRAM'+line.slice(endIdx),
          actual:line.slice(startIdx,endIdx),ok:true};
}

function buildExamCode(solution,gaps){
  const lines=solution.split('\n');
  const meta=[]; // {idx,expected,actual,cat,weight}
  gaps.forEach((g,gi)=>{
    const ln=(g.line||1)-1;
    if(ln<0||ln>=lines.length){
      console.warn('exam: gap fuera de rango',g);return;
    }
    const r=replaceNthOccurrence(lines[ln],g.token,g.occurrence||1);
    if(!r.ok){
      console.warn('exam: occurrence no encontrada',g);return;
    }
    // reemplaza el marcador genérico por uno único con el índice
    lines[ln]=r.line.replace('MARK__KRAM','MARK_'+gi+'_KRAM');
    meta.push({idx:gi,expected:g.token,actual:r.actual,cat:g.cat,weight:g.weight||1});
  });
  // Aplica highlight sobre el código ya marcado
  let highlighted=hl(lines.join('\n'));
  // Sustituye los marcadores (MARK_<idx>_KRAM) por inputs. hl() los respeta
  // porque no contienen caracteres especiales de HTML ni de su lexer.
  meta.forEach(m=>{
    const sz=Math.max(4,(m.actual||'').length+1);
    const exp64=btoa(unescape(encodeURIComponent(m.expected)));
    const inp=`<input class="exam-inp" data-gi="${m.idx}" data-exp64="${exp64}" `+
              `data-w="${m.weight}" size="${sz}" autocomplete="off" spellcheck="false">`;
    highlighted=highlighted.split('MARK_'+m.idx+'_KRAM').join(inp);
  });
  return {html:highlighted,meta};
}

// ── Normalización para comparación tolerante ────────────────
function normExp(s){
  s=(s||'').trim().toUpperCase();
  // %TYPE / %ROWTYPE → admitir con o sin '%' inicial
  if(s.startsWith('%'))return s.slice(1);
  return s;
}
function normUser(s){return (s||'').trim().toUpperCase().replace(/^%/,'');}

// ============================================================
// EXAMEN — RENDER
// ============================================================
function examProblems(b){
  return (window.EXAM_CATALOG||[]).filter(p=>p.practice===b.id);
}

function renderExamen(b){
  const probs=examProblems(b);
  if(!probs.length){
    return `<div class="sec-intro">
      <h2>📝 Examen</h2>
      <p>Sin problemas catalogados para esta práctica.</p>
    </div>
    <div class="th-card"><p>Aún no hay problemas de examen para <strong>${b.title}</strong>.</p></div>`;
  }
  const st=examState[b.id];
  if(st&&st.problem)return renderExamProblem(b,st);
  return renderExamList(b,probs);
}

function renderExamList(b,probs){
  const cats=getExamCats();
  const catChecks=EXAM_CATS.map(c=>`
    <label class="exam-catlbl">
      <input type="checkbox" data-cat="${c}" ${cats.includes(c)?'checked':''}>
      ${EXAM_CAT_LABEL[c]}
    </label>`).join('');
  return `<div class="sec-intro">
    <h2>📝 Examen</h2>
    <p>Practica con problemas reales del temario · ${probs.length} disponibles</p>
  </div>
  <div class="exam-toolbar">
    <button class="btn" onclick="examRandom()">🎲 Examen aleatorio</button>
    <div class="exam-cats">
      <span class="exam-catttl">Categorías de huecos:</span>
      ${catChecks}
    </div>
  </div>
  <div class="ex-list">${probs.map(p=>{
    const h=examHist(p.id);
    const last=h.length?h[h.length-1]:null;
    const diff='★'.repeat(p.difficulty||1)+'☆'.repeat(3-(p.difficulty||1));
    return `<div class="exam-card" onclick="examPick('${p.id}')">
      <div class="exam-cardhd">
        <span class="exam-lbl">${p.label||p.id}</span>
        <span class="exam-diff" title="Dificultad">${diff}</span>
      </div>
      <h3 class="exam-tit">${p.title}</h3>
      <div class="exam-meta">
        ${last!=null?`<span class="exam-last">Última nota: <b>${last.toFixed(1)}/10</b></span>`:'<span class="exam-last muted">Sin intentos</span>'}
        ${h.length>1?`<span class="muted">· ${h.length} intentos</span>`:''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderExamProblem(b,st){
  const p=st.problem;
  const built=buildExamCode(p.solution,st.gaps);
  st._meta=built.meta;
  const last=st.lastScore;
  const cur=st.score;
  let banner='';
  if(cur!=null){
    const cls=cur<5?'ng':cur>7?'ok':'warn';
    banner=`<div class="exam-banner ${cls}">${cur.toFixed(1)} / 10</div>`;
  }
  // Pasos: dividir enunciado por "n)" si es posible
  const steps=(p.enunciado||'').split(/(?=\b\d+\))/).map(s=>s.trim()).filter(Boolean);
  return `<div class="sec-intro">
    <h2>📝 ${p.title}</h2>
    <p><span class="tag">${p.label||p.id}</span> · Dificultad ${p.difficulty||1}/3</p>
  </div>
  <div class="exam-actions">
    <button class="btn sec" onclick="examBack()">← Lista</button>
    <button class="btn sec" onclick="examReroll()">🔄 Nueva tirada</button>
    ${last!=null&&cur==null?`<span class="exam-prev">Última nota: <b>${last.toFixed(1)}/10</b></span>`:''}
  </div>
  ${banner}
  <div class="th-card">
    <h3>📋 Enunciado</h3>
    ${steps.length>1?`<ol class="exam-steps">${steps.map(s=>`<li>${escHtml(s.replace(/^\d+\)\s*/,''))}</li>`).join('')}</ol>`
      :`<p>${escHtml(p.enunciado||'')}</p>`}
  </div>
  <div class="exam-codewrap">
    <pre class="exam-code">${built.html}</pre>
  </div>
  ${cur==null?`<button class="btn" onclick="examCheck()">✓ Comprobar</button>`:
    `<button class="btn" onclick="examReroll()">🔄 Nueva tirada</button>`}
  <div id="exam-feedback"></div>`;
}

function escHtml(s){
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// EXAMEN — BIND / ACCIONES
// ============================================================
function bindExamen(b){
  // checkboxes de categorías (solo presentes en lista)
  document.querySelectorAll('.exam-cats input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change',()=>{
      const checked=[...document.querySelectorAll('.exam-cats input[type=checkbox]')]
        .filter(x=>x.checked).map(x=>x.dataset.cat);
      setExamCats(checked.length?checked:EXAM_CATS.slice());
    });
  });
}

window.examRandom=function(){
  const b=BLOCKS[curBlock];
  const probs=examProblems(b);
  if(!probs.length)return;
  const p=probs[Math.floor(Math.random()*probs.length)];
  examPickById(b,p);
};
window.examPick=function(id){
  const b=BLOCKS[curBlock];
  const p=examProblems(b).find(x=>x.id===id);
  if(!p)return;
  examPickById(b,p);
};
function examPickById(b,p){
  examState[b.id]={problem:p,gaps:pickGaps(p),score:null,lastScore:examHist(p.id).slice(-1)[0]};
  renderContent();
}
window.examBack=function(){
  const b=BLOCKS[curBlock];
  delete examState[b.id];
  renderContent();
};
window.examReroll=function(){
  const b=BLOCKS[curBlock];
  const st=examState[b.id];
  if(!st||!st.problem)return;
  st.gaps=pickGaps(st.problem);
  st.lastScore=examHist(st.problem.id).slice(-1)[0];
  st.score=null;
  renderContent();
};

window.examCheck=function(){
  const b=BLOCKS[curBlock];
  const st=examState[b.id];
  if(!st||!st.problem)return;
  const inputs=document.querySelectorAll('.exam-inp');
  let sumGot=0,sumTot=0;
  inputs.forEach(inp=>{
    const exp=decodeURIComponent(escape(atob(inp.dataset.exp64)));
    const w=parseInt(inp.dataset.w,10)||1;
    sumTot+=w;
    const ok=normUser(inp.value)===normExp(exp);
    if(ok){
      inp.classList.remove('ng');inp.classList.add('ok');
      sumGot+=w;
    }else{
      inp.classList.remove('ok');inp.classList.add('ng');
      inp.title='Correcto: '+exp;
    }
    inp.disabled=true;
  });
  const nota=sumTot?Math.round((sumGot/sumTot)*100)/10:0;
  st.score=nota;
  pushExamHist(st.problem.id,nota);
  // feedback inline (lista de errores)
  const fbEl=document.getElementById('exam-feedback');
  if(fbEl){
    const errs=[];
    inputs.forEach(inp=>{
      if(inp.classList.contains('ng')){
        const exp=decodeURIComponent(escape(atob(inp.dataset.exp64)));
        errs.push(`<li><code>${escHtml(inp.value||'(vacío)')}</code> → <b>${escHtml(exp)}</b></li>`);
      }
    });
    fbEl.innerHTML=errs.length
      ? `<div class="fb ng" style="display:block"><strong>Respuestas correctas:</strong><ul class="exam-errs">${errs.join('')}</ul></div>`
      : `<div class="fb ok" style="display:block">✅ ¡Todos los huecos correctos!</div>`;
  }
  // Score banner re-render
  const cls=nota<5?'ng':nota>7?'ok':'warn';
  const old=document.querySelector('.exam-banner');
  const bann=`<div class="exam-banner ${cls}">${nota.toFixed(1)} / 10</div>`;
  if(old)old.outerHTML=bann;
  else document.querySelector('.exam-codewrap').insertAdjacentHTML('beforebegin',bann);
  // Botón Comprobar → Nueva tirada
  const btns=document.querySelectorAll('.btn');
  btns.forEach(b2=>{if(b2.textContent.trim().startsWith('✓'))b2.outerHTML=
    `<button class="btn" onclick="examReroll()">🔄 Nueva tirada</button>`;});
  // Score de la práctica: cuenta problemas distintos aprobados
  refreshExamScore(b);
  updateGlobal();updateBlockBar();renderNav();
  showToast(`Nota: ${nota.toFixed(1)}/10`,nota>=5?'t-ok':'t-ng',2800);
};

// Recalcula scores[block].examen como nº de problemas con MEJOR nota >=5
function refreshExamScore(b){
  const probs=examProblems(b);
  let passed=0;
  probs.forEach(p=>{
    const h=examHist(p.id);
    if(h.some(n=>n>=5))passed++;
  });
  scores[b.id].examen=passed;
}

// Al cargar la app: rellena los scores de examen desde localStorage
BLOCKS.forEach(b=>refreshExamScore(b));

// ============================================================
// MAIN RENDER
// ============================================================
function render(){
  renderNav();
  renderHeader();
  renderTabs();
  renderContent();
}

// ============================================================
// INIT
// ============================================================
render();
