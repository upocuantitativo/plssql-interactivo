// AUTO-GENERATED FROM exam_catalog.json — do not edit by hand
// Embedded as JS literal so the app works opening index.html via file://

window.EXAM_CATALOG = [
  {
    "id": "epd5_p1",
    "practice": "epd5",
    "label": "Problema 1",
    "title": "Obtener fila del PRESIDENT con %ROWTYPE",
    "enunciado": "1) En la seccion DECLARE, declara una variable my_emp del tipo registro de la tabla emp (usa %ROWTYPE). 2) En el cuerpo del bloque, recupera con SELECT * INTO la fila cuyo job sea 'PRESIDENT'. 3) Imprime por pantalla con DBMS_OUTPUT.PUT_LINE los campos empno, ename, job, hiredate y sal de la variable my_emp, anteponiendo cabeceras tipo 'NUMERO EMPLEADO:', 'NOMBRE EMPLEADO:', etc.",
    "difficulty": 1,
    "solution": "DECLARE\n\n    my_emp    emp%ROWTYPE;\nBEGIN\n\n    SELECT *\n    INTO my_emp\n    FROM emp\n    WHERE job='PRESIDENT';\n    \n    DBMS_OUTPUT.PUT_LINE('RESULTADO CONSULTA');\n    DBMS_OUTPUT.PUT_LINE('==================');\n    DBMS_OUTPUT.PUT_LINE('NUMERO EMPLEADO: '||my_emp.empno);\n    DBMS_OUTPUT.PUT_LINE('NOMBRE EMPLEADO: '||my_emp.ename);\n    DBMS_OUTPUT.PUT_LINE('OFICIO: '||my_emp.job);\n    DBMS_OUTPUT.PUT_LINE('FECHA ENTRADA: '||my_emp.hiredate);\n    DBMS_OUTPUT.PUT_LINE('SALARIO: '||my_emp.sal);\n    \nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%ROWTYPE", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "SELECT", "line": 6, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "FROM", "line": 8, "occurrence": 1, "weight": 1},
        {"token": "WHERE", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 19, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_p2",
    "practice": "epd5",
    "label": "Problema 2",
    "title": "Sustituir empleado FORD usando %ROWTYPE y %TYPE",
    "enunciado": "1) Declara una variable my_emp como %ROWTYPE de emp, y tres variables my_name, my_job y my_sal usando %TYPE sobre las columnas ename, job y sal; inicializa my_name a 'UPO', my_job a 'STUDENT' y my_sal a un valor pedido por sustitucion (&s). 2) Recupera con SELECT * INTO la fila del empleado FORD en my_emp. 3) Borra de emp la fila de FORD y haz commit. 4) Inserta un nuevo empleado reutilizando los campos de my_emp salvo ename/job/sal que usan las variables locales, y haz commit. 5) Actualiza el salario sumando 1000 al empleado 'UPO' y haz commit. Imprime mensajes informativos en cada paso.",
    "difficulty": 2,
    "solution": "DECLARE\n\n    my_emp    emp%ROWTYPE;\n    my_name   emp.ename%TYPE:='UPO';\n    my_job    emp.job%TYPE:='STUDENT';\n    my_sal    emp.sal%TYPE:=&s;\nBEGIN\n\n    SELECT *\n    INTO my_emp\n    FROM emp\n    WHERE ename='FORD';\n            \n    DBMS_OUTPUT.PUT_LINE('Recuperando datos del empleado FORD...');\n    \n    delete from emp where ename='FORD';\n    commit;\n    DBMS_OUTPUT.PUT_LINE('Borrado empleado FORD...');\n    \n    insert into emp values(my_emp.empno,my_name,my_job,my_emp.mgr,my_emp.hiredate,my_sal,my_emp.comm,my_emp.deptno);\n    commit;\n    DBMS_OUTPUT.PUT_LINE('Insertado nuevo empleado');\n    Update emp\n    set sal=sal+1000\n    where ename='UPO';\n    commit;\n    DBMS_OUTPUT.PUT_LINE('Sueldo modificado ');\n    \n    \nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%ROWTYPE", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "%TYPE", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "%TYPE", "line": 5, "occurrence": 1, "weight": 3},
        {"token": "%TYPE", "line": 6, "occurrence": 1, "weight": 3},
        {"token": "BEGIN", "line": 7, "occurrence": 1, "weight": 1},
        {"token": "SELECT", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "FROM", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "WHERE", "line": 12, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 30, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_p3",
    "practice": "epd5",
    "label": "Problema 3",
    "title": "Bloque anonimo con INSERT, SELECT INTO y ROLLBACK",
    "enunciado": "1) Declara dos variables numericas v_Num1 y v_Num2 inicializadas a 1 y 2, dos variables VARCHAR2(50) v_String1 y v_String2 con sendos mensajes, y una variable de salida v_OutputStr VARCHAR2(50). 2) Inserta dos filas en temp_table(num_col,char_col) usando los valores de las variables. 3) Recupera con SELECT INTO el char_col de la primera fila (num_col=v_Num1) e imprimelo con DBMS_OUTPUT. 4) Recupera analogamente la segunda fila (num_col=v_Num2) e imprimelo. 5) Termina el bloque con un ROLLBACK para anular los cambios.",
    "difficulty": 2,
    "solution": "DECLARE\n  /* Declaracion de las variables que se usan en este bloque. */\n  v_Num1      NUMBER := 1;\n  v_Num2      NUMBER := 2;\n  v_String1   VARCHAR2(50) := 'Hello World!';\n  v_String2   VARCHAR2(50) :=\n    '-- This message brought to you by PL/SQL!';\n  v_OutputStr VARCHAR2(50);\nBEGIN\n  /* Primero inserta dos filas en temp_table, utilizando \n     los valores de las variables. */\n  INSERT INTO temp_table (num_col, char_col)\n    VALUES (v_Num1, v_String1);\n  INSERT INTO temp_table (num_col, char_col)\n    VALUES (v_Num2, v_String2);\n\t\n  /* Ahora consulta temp_table para las dos filas que acabamos de insertar\n     y las presenta en pantalla utilizando el paquete DBMS_OUTPUT. */\n  SELECT char_col\n    INTO v_OutputStr\n\tFROM temp_table\n\tWHERE num_col = v_Num1;\n  DBMS_OUTPUT.PUT_LINE(v_OutputStr);\n  \n  SELECT char_col\n    INTO v_OutputStr\n\tFROM temp_table\n\tWHERE num_col = v_Num2;\n  DBMS_OUTPUT.PUT_LINE(v_OutputStr);\n  \n  /* Anula los cambios */\n  ROLLBACK;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 26, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 33, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_p4",
    "practice": "epd5",
    "label": "Problema 4",
    "title": "Bloques PL/SQL anidados con ambito de variables",
    "enunciado": "1) Declara en el bloque externo una variable v_StudentID NUMBER(5) inicializada a 10000 y una variable v_FirstName VARCHAR2(20). 2) Recupera con SELECT INTO el first_name del estudiante con ese ID. 3) Abre un bloque anidado DECLARE/BEGIN/END donde declares v_num NUMBER y dentro insertes una linea en log_table indicando el alumno, hagas commit y cuentes con SELECT COUNT(*) las filas de log_table en v_num. 4) Tras cerrar el bloque anidado, imprime por pantalla cuantos registros hay en log_table (cuidado: este programa contiene un error tipico de ambito porque vnum solo es visible dentro del bloque interno).",
    "difficulty": 2,
    "solution": "DECLARE\n\n  v_StudentID NUMBER(5) := 10000;\n  v_FirstName VARCHAR2(20);\nBEGIN \n  SELECT first_name\n    INTO v_FirstName\n    FROM students\n    WHERE id = v_StudentID;\n    \n  DECLARE\n     v_num NUMBER;\n  BEGIN\n    INSERT INTO log_table (info)\n      VALUES ('El alumno con ID '||v_StudentID||' se llama '||v_FirstName );\n     COMMIT;\n     SELECT COUNT(*)\n     INTO v_num\n     FROM log_table;\n  END;\n  DBMS_OUTPUT.PUT_LINE('En la tabla LOG_TABLE hay '||vnum||' registros');\n\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 5, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "DECLARE", "line": 11, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 13, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 18, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 20, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 23, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_p6",
    "practice": "epd5",
    "label": "Problema 6",
    "title": "Definicion y asignacion de tipos RECORD propios",
    "enunciado": "1) Define en DECLARE dos tipos RECORD distintos t_Rec1Type y t_Rec2Type, cada uno con los campos Field1 NUMBER y Field2 VARCHAR2(5). 2) Declara una variable v_Rec1 de t_Rec1Type y otra v_Rec2 de t_Rec2Type. 3) Demuestra que NO se pueden asignar registros completos entre tipos distintos (v_Rec1 := v_Rec2 produce PLS-382). 4) Asigna campo a campo (v_Rec1.Field1 := v_Rec2.Field1 y v_Rec1.Field2 := v_Rec2.Field2), lo cual si es legal porque los tipos de cada campo coinciden.",
    "difficulty": 2,
    "solution": "DECLARE\n  TYPE t_Rec1Type IS RECORD (\n    Field1 NUMBER,\n    Field2 VARCHAR2(5));\n  TYPE t_Rec2Type IS RECORD (\n    Field1 NUMBER,\n    Field2 VARCHAR2(5));\n  v_Rec1 t_Rec1Type;\n  v_Rec2 t_Rec2Type;\nBEGIN\n  v_Rec1 := v_Rec2;\n\n  v_Rec1.Field1 := v_Rec2.Field1;\n  v_Rec1.Field2 := v_Rec2.Field2;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "IS", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "IS", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 10, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 15, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_e3",
    "practice": "epd5",
    "label": "Experimento 3",
    "title": "%ROWTYPE simple: imprimir ename del PRESIDENT",
    "enunciado": "1) Activa la salida con SET SERVEROUTPUT ON. 2) Declara una variable my_emp de tipo emp%ROWTYPE. 3) Recupera con SELECT * INTO la fila de la tabla emp cuyo job sea 'PRESIDENT'. 4) Imprime con DBMS_OUTPUT.PUT_LINE el campo ename del registro recuperado.",
    "difficulty": 1,
    "solution": "DECLARE\n\n    my_emp    emp%ROWTYPE;\nBEGIN\n\n    SELECT *\n    INTO my_emp\n    FROM emp\n    WHERE job='PRESIDENT';\n    \n    DBMS_OUTPUT.PUT_LINE(my_emp.ename);\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%ROWTYPE", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "SELECT", "line": 6, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "FROM", "line": 8, "occurrence": 1, "weight": 1},
        {"token": "WHERE", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 12, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_e4",
    "practice": "epd5",
    "label": "Experimento 4",
    "title": "Bloque PL/SQL minimo: declarar e imprimir variable",
    "enunciado": "1) Activa la salida por pantalla con SET SERVEROUTPUT ON. 2) Declara una variable num de tipo NUMBER inicializada al valor 100. 3) En el cuerpo del bloque, imprime por pantalla con DBMS_OUTPUT.PUT_LINE el mensaje 'Valor de num: ' concatenado con el valor de num.",
    "difficulty": 1,
    "solution": "SET ServerOutput ON;\n    DECLARE\n    num NUMBER :=100;\n    BEGIN\n        DBMS_OUTPUT.PUT_LINE('Valor de num: '||num);\n    END;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 2, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 6, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd5_e5",
    "practice": "epd5",
    "label": "Experimento 5",
    "title": "Bloque PL/SQL con variable de sustitucion",
    "enunciado": "1) Declara una variable num de tipo NUMBER cuyo valor inicial se pida por sustitucion con &v. 2) Imprime por pantalla con DBMS_OUTPUT.PUT_LINE el mensaje 'Valor de v: ' concatenado con el valor introducido.",
    "difficulty": 1,
    "solution": "DECLARE\n    num NUMBER :=&v;\nBEGIN\n    DBMS_OUTPUT.PUT_LINE('Valor de v: '||num);\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 5, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_p1",
    "practice": "epd6",
    "label": "Problema 1",
    "title": "Bucle FOR con IF/CONTINUE para saltar valores",
    "enunciado": "1) Recorre con un bucle FOR i IN 1..10 e inserta cada valor en la tabla messages(results), excepto cuando i sea 6 u 8. 2) Primera version: usa IF i = 6 or i = 8 THEN null ELSE INSERT END IF dentro del LOOP. 3) Segunda version: simplifica usando la sentencia CONTINUE WHEN i = 6 or i = 8 al inicio del cuerpo del bucle. En ambos casos haz COMMIT.",
    "difficulty": 2,
    "solution": "BEGIN\nFOR i IN 1..10 LOOP\n    IF i = 6 or i = 8 THEN\n         null;\n    ELSE\n        INSERT INTO messages(results)\n        VALUES (i);\n    END IF;\n    COMMIT;\nEND LOOP;\nEND;\n\nBEGIN\nFOR i IN 1..10 LOOP\n    CONTINUE WHEN i = 6 or i = 8;\n    INSERT INTO messages(results)\n    VALUES (i);\n    COMMIT;\nEND LOOP;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "BEGIN", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "FOR", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "IN", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "THEN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "ELSE", "line": 5, "occurrence": 1, "weight": 1},
        {"token": "END IF", "line": 8, "occurrence": 1, "weight": 1},
        {"token": "END LOOP", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 13, "occurrence": 1, "weight": 1},
        {"token": "FOR", "line": 14, "occurrence": 1, "weight": 2},
        {"token": "IN", "line": 14, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 14, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 19, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 20, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_p2",
    "practice": "epd6",
    "label": "Problema 2",
    "title": "Sentencia CASE para asignar curso segun especialidad",
    "enunciado": "1) Declara v_Major con %TYPE de students.major y v_CourseName VARCHAR2(10). 2) Con SELECT INTO recupera la especialidad (major) del estudiante con ID=10011. 3) Usa una sentencia CASE v_Major WHEN ... THEN ... para asignar a v_CourseName el codigo de curso correspondiente: 'Computer Science'->'CS 101', 'Economics'->'ECN 203', 'History'->'HIS 101', 'Music'->'MUS 100', 'Nutrition'->'NUT 307', con un ELSE 'Unknown'. 4) Imprime v_CourseName por pantalla.",
    "difficulty": 2,
    "solution": "DECLARE \n  v_Major students.major%TYPE; \n  v_CourseName VARCHAR2(10); \nBEGIN \n  SELECT major \n    INTO v_Major \n    FROM students \n    WHERE ID = 10011; \n \n  CASE v_Major \n    WHEN 'Computer Science' THEN \n      v_CourseName := 'CS  101'; \n    WHEN 'Economics' THEN \n      v_CourseName :='ECN 203'; \n    WHEN 'History' THEN \n      v_CourseName := 'HIS 101'; \n    WHEN 'Music' THEN \n      v_CourseName := 'MUS 100'; \n    WHEN 'Nutrition' THEN \n      v_CourseName := 'NUT 307'; \n    ELSE \n      v_CourseName := 'Unknown'; \n  END CASE; \n \n  DBMS_OUTPUT.PUT_LINE(v_CourseName); \nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 6, "occurrence": 1, "weight": 2},
        {"token": "CASE", "line": 10, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 11, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 15, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 15, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 17, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 17, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 19, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 19, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 21, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 26, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_p3",
    "practice": "epd6",
    "label": "Problema 3",
    "title": "Equivalencia entre bucle WHILE y bucle FOR",
    "enunciado": "1) Primera version: declara v_Counter BINARY_INTEGER:=1 y usa un bucle WHILE v_Counter <= 50 LOOP que inserte en temp_table valores (v_Counter,'Loop index') incrementando v_Counter en 1 en cada iteracion. 2) Segunda version: realiza lo mismo usando un bucle FOR v_Counter IN 1..50 LOOP (sin declarar v_Counter explicitamente, ya que el FOR lo hace).",
    "difficulty": 1,
    "solution": "DECLARE \n  v_Counter BINARY_INTEGER := 1; \nBEGIN \n  WHILE v_Counter <= 50 LOOP \n    INSERT INTO temp_table \n      VALUES (v_Counter, 'Loop index'); \n    v_Counter := v_Counter + 1; \n  END LOOP; \nEND;\n\nBEGIN \n  FOR v_Counter IN 1..50 LOOP \n    INSERT INTO temp_table \n      VALUES (v_Counter, 'Loop Index'); \n  END LOOP; \nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "WHILE", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "LOOP", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 8, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "FOR", "line": 12, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 12, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 12, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 15, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 16, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_p4",
    "practice": "epd6",
    "label": "Problema 4",
    "title": "Ambito de variables en bucle FOR (variable de bucle local)",
    "enunciado": "1) Declara v_Counter NUMBER:=5. 2) Inserta v_Counter en temp_table (debe ser 5). 3) Abre un bucle FOR v_Counter IN 20..30 LOOP: dentro del bucle, v_Counter es una nueva variable BINARY_INTEGER que oculta la externa; en cada iteracion inserta v_Counter en temp_table. 4) Tras END LOOP, inserta de nuevo v_Counter (sigue siendo 5, la externa no se modifica). 5) Haz COMMIT.",
    "difficulty": 2,
    "solution": "DECLARE \n  v_Counter  NUMBER := 5; \nBEGIN \n   \n  INSERT INTO temp_table (num_col) \n    VALUES (v_Counter); \n  FOR v_Counter IN 20..30 LOOP \n      INSERT INTO temp_table (num_col) \n      VALUES (v_Counter); \n  END LOOP; \n   \n  INSERT INTO temp_table (num_col) \n    VALUES (v_Counter);\n     \n   COMMIT;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "FOR", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 16, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_p5",
    "practice": "epd6",
    "label": "Problema 5",
    "title": "Expresion CASE para evaluar nota (grade)",
    "enunciado": "1) Define p_grade como variable de sustitucion. 2) Declara v_grade CHAR(1) inicializada con UPPER('&p_grade') y v_appraisal VARCHAR2(20). 3) Asigna a v_appraisal el resultado de una expresion CASE v_grade WHEN 'A' THEN 'Excellent' WHEN 'B' THEN 'Very Good' WHEN 'C' THEN 'Good' ELSE 'No such grade' END. 4) Imprime por pantalla la nota y su apreciacion.",
    "difficulty": 2,
    "solution": "SET SERVEROUTPUT ON\n        DEFINE p_grade = a\nDECLARE    \n    v_grade CHAR(1) := UPPER('&p_grade');\n    v_appraisal VARCHAR2(20);\nBEGIN\n    v_appraisal :=\n        CASE v_grade\n            WHEN 'A' THEN 'Excellent'\n            WHEN 'B' THEN 'Very Good'\n            WHEN 'C' THEN 'Good'\n            ELSE 'No such grade'\n        END;\nDBMS_OUTPUT.PUT_LINE ('Grade : ' || v_grade || '\n                Appraisal ' || v_appraisal);\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 6, "occurrence": 1, "weight": 1},
        {"token": "CASE", "line": 8, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 9, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 10, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 11, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 12, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 16, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_e1",
    "practice": "epd6",
    "label": "Experimento 1",
    "title": "Comparacion con NULL e IF/ELSIF para evitar logica trivaluada",
    "enunciado": "1) Bloque 1: declara v_Number1, v_Number2 y v_Result; asigna v_Number1=3 y v_Number2=NULL; usa IF v_Number1 < v_Number2 THEN v_Result:='Yes' ELSE v_Result:='No' END IF; imprime v_Result (sera 'No' porque la comparacion con NULL es UNKNOWN). 2) Bloque 2: igual pero con condicion >= y resultados invertidos (sera 'Yes'). 3) Solucion: anade un IF v_Number1 IS NULL OR v_Number2 IS NULL THEN v_Result:='Unknown' como primer ELSIF y reescribe los dos bloques.",
    "difficulty": 3,
    "solution": "DECLARE\n    v_Number1 NUMBER;\n    v_Number2 NUMBER;\n    v_Result VARCHAR2(7);\nBEGIN\n    v_Number1:=3;\n    v_Number2:=NULL;\n    IF v_Number1 < v_Number2 THEN\n        v_Result := 'Yes';\n    ELSE\n        v_Result := 'No';\n    END IF;\n    DBMS_OUTPUT.PUT_LINE('Result: '||v_Result);\nEND;\n\nDECLARE\n    v_Number1 NUMBER;\n    v_Number2 NUMBER;\n    v_Result VARCHAR2(7);\nBEGIN\n    v_Number1:=3;\n    v_Number2:=NULL;\n    IF v_Number1 IS NULL OR v_Number2 IS NULL THEN \n        v_Result := 'Unknown'; \n    ELSIF v_Number1 < v_Number2 THEN\n        v_Result := 'Yes';\n    ELSE\n        v_Result := 'No';\n    END IF;\n    DBMS_OUTPUT.PUT_LINE('Result: '||v_Result);\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 5, "occurrence": 1, "weight": 1},
        {"token": "IF", "line": 8, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 8, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 12, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 14, "occurrence": 1, "weight": 1},
        {"token": "DECLARE", "line": 16, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 20, "occurrence": 1, "weight": 1},
        {"token": "IF", "line": 23, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 23, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 25, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 25, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 27, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 29, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 31, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_e2",
    "practice": "epd6",
    "label": "Experimento 2",
    "title": "CASE sin clausula ELSE provoca ORA-6592",
    "enunciado": "1) Primer bloque: declara v_TestVar NUMBER:=1 y escribe un CASE v_TestVar WHEN 2 THEN ... WHEN 3 THEN ... WHEN 4 THEN ... END CASE (sin ELSE); al ejecutarse con v_TestVar=1 lanza el error ORA-6592 (CASE_NOT_FOUND). 2) Segundo bloque: anade clausula ELSE DBMS_OUTPUT.PUT_LINE('Anything else!') para cubrir el caso por defecto y evitar la excepcion.",
    "difficulty": 2,
    "solution": "DECLARE \n  v_TestVar NUMBER := 1; \n        BEGIN   \n  CASE v_TestVar \n    WHEN 2 THEN DBMS_OUTPUT.PUT_LINE('Two!'); \n    WHEN 3 THEN DBMS_OUTPUT.PUT_LINE('Three!'); \n    WHEN 4 THEN DBMS_OUTPUT.PUT_LINE('Four!');       \n  END CASE; \nEND; \n\nDECLARE \n  v_TestVar NUMBER := 1; \n\t\t\tBEGIN   \n  CASE v_TestVar \n    WHEN 2 THEN DBMS_OUTPUT.PUT_LINE('Two!'); \n    WHEN 3 THEN DBMS_OUTPUT.PUT_LINE('Three!'); \n    WHEN 4 THEN DBMS_OUTPUT.PUT_LINE('Four!');   \n    ELSE DBMS_OUTPUT.PUT_LINE('Anything else!');\n  END CASE; \nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "CASE", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 5, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 6, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "END", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "DECLARE", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 13, "occurrence": 1, "weight": 1},
        {"token": "CASE", "line": 14, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 15, "occurrence": 1, "weight": 3},
        {"token": "ELSE", "line": 18, "occurrence": 1, "weight": 3},
        {"token": "END", "line": 20, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd6_e3",
    "practice": "epd6",
    "label": "Experimento 3",
    "title": "Bucle LOOP basico con salida EXIT WHEN",
    "enunciado": "1) Declara v_Counter BINARY_INTEGER:=1. 2) Abre un bucle LOOP que inserte en temp_table valores (v_Counter,'Loop index') e incremente v_Counter en 1. 3) Tal cual esta el bucle es infinito: anade dentro del LOOP la sentencia EXIT WHEN v_Counter > 50 para detener el bucle correctamente. 4) Cierra con END LOOP y END.",
    "difficulty": 2,
    "solution": "DECLARE \n  v_Counter BINARY_INTEGER := 1; \nBEGIN \n  LOOP \n    INSERT INTO temp_table \n      VALUES (v_Counter, 'Loop index'); \n    v_Counter := v_Counter + 1; \n    EXIT WHEN v_Counter > 50;\n  END LOOP; \nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "LOOP", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "EXIT", "line": 8, "occurrence": 1, "weight": 3},
        {"token": "END LOOP", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 10, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_p1",
    "practice": "epd7",
    "label": "Problema 1",
    "title": "Cursor explicito parametrizado con OPEN/FETCH/CLOSE y %NOTFOUND",
    "enunciado": "1) Declara variables v_StudentID, v_FirstName, v_LastName con %TYPE de students; v_Subject %TYPE de students.major inicializada por sustitucion (&a); v_Department %TYPE de registered_students.department. 2) Declara un CURSOR c_HistoryStudents (cV_Subject students.MAJOR%TYPE) IS SELECT id, first_name, last_name FROM students WHERE Upper(major)=Upper(cV_Subject). 3) Con un CASE Upper(v_Subject) asigna v_Department segun la especialidad ('HISTORY'->'HIS', 'COMPUTER SCIENCE'->'CS', 'ECONOMICS'->'ECN', 'MUSIC'->'MUS', ELSE NULL). 4) Abre el cursor con OPEN c_HistoryStudents(v_Subject) y en un LOOP: FETCH INTO las tres variables, EXIT WHEN c_HistoryStudents%NOTFOUND, e inserta filas en registered_students y temp_table. 5) Tras el bucle, imprime c_HistoryStudents%ROWCOUNT y cierra el cursor con CLOSE.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_StudentID   students.id%TYPE;\n  v_FirstName   students.first_name%TYPE;\n  v_LastName    students.last_name%TYPE;\n  v_Subject     students.MAJOR%TYPE:='&a';\n  v_Department  registered_students.DEPARTMENT%TYPE;\n  CURSOR c_HistoryStudents (cV_Subject students.MAJOR%TYPE) IS\n    SELECT id, first_name, last_name\n      FROM students\n      WHERE Upper(major) = upper(cV_Subject);\nBEGIN\n  \n  CASE Upper(v_Subject)\n    WHEN 'HISTORY' THEN v_Department:='HIS';\n    WHEN 'COMPUTER SCIENCE' THEN v_Department:='CS';\n    WHEN 'ECONOMICS' THEN v_Department:='ECN';\n    WHEN 'MUSIC' THEN v_Department:='MUS';\n    ELSE v_Department:=NULL;\n  END CASE;\n  \n  OPEN c_HistoryStudents(v_Subject);\n  LOOP\n    FETCH c_HistoryStudents INTO v_StudentID, v_FirstName, v_LastName;\n    EXIT WHEN c_HistoryStudents%NOTFOUND;\n\n    INSERT INTO registered_students (student_id, department, course)\n      VALUES (v_StudentID, v_Department, 101);\n\n    INSERT INTO temp_table (num_col, char_col)\n      VALUES (v_StudentID, v_FirstName || ' ' || v_LastName);\n\n  END LOOP;\n\n  DBMS_OUTPUT.put_line(c_HistoryStudents%ROWCOUNT);\n  CLOSE c_HistoryStudents;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "CASE", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 14, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 14, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 18, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 22, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 32, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 36, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "OPEN", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "FETCH", "line": 23, "occurrence": 1, "weight": 3},
        {"token": "INTO", "line": 23, "occurrence": 1, "weight": 3},
        {"token": "EXIT", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "%NOTFOUND", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "%ROWCOUNT", "line": 34, "occurrence": 1, "weight": 3},
        {"token": "CLOSE", "line": 35, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_p2",
    "practice": "epd7",
    "label": "Problema 2",
    "title": "Cursor explicito con WHILE y %FOUND",
    "enunciado": "1) Declara las mismas variables y cursor parametrizado c_HistoryStudents(cV_Subject students.MAJOR%TYPE) IS SELECT id, first_name, last_name FROM students WHERE Upper(major)=Upper(cV_Subject) que en el problema 1. 2) Asigna v_Department con un CASE igual al anterior. 3) OPEN el cursor con v_Subject. 4) Haz un primer FETCH antes del bucle. 5) Bucle WHILE c_HistoryStudents%FOUND LOOP: inserta en registered_students y temp_table, haz commit, y al final del bucle realiza otro FETCH. 6) Tras el WHILE, imprime %ROWCOUNT y cierra con CLOSE.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_StudentID   students.id%TYPE;\n  v_FirstName   students.first_name%TYPE;\n  v_LastName    students.last_name%TYPE;\n  v_Subject     students.MAJOR%TYPE:='&a';\n  v_Department  registered_students.DEPARTMENT%TYPE;\n  CURSOR c_HistoryStudents (cV_Subject students.MAJOR%TYPE) IS\n    SELECT id, first_name, last_name\n      FROM students\n      WHERE Upper(major) = Upper(cV_Subject);\nBEGIN\n  \n  CASE Upper(v_Subject)\n    WHEN 'HISTORY' THEN v_Department:='HIS';\n    WHEN 'COMPUTER SCIENCE' THEN v_Department:='CS';\n    WHEN 'ECONOMICS' THEN v_Department:='ECN';\n    WHEN 'MUSIC' THEN v_Department:='MUS';\n    ELSE v_Department:=NULL;\n  END CASE;\n  \n  OPEN c_HistoryStudents(v_Subject);\n  FETCH c_HistoryStudents INTO v_StudentID, v_FirstName, v_LastName;\n  \n  WHILE c_HistoryStudents%FOUND LOOP\n    \n    INSERT INTO registered_students (student_id, department, course)\n      VALUES (v_StudentID, v_Department, 101);\n\n    INSERT INTO temp_table (num_col, char_col)\n      VALUES (v_StudentID, v_FirstName || ' ' || v_LastName);\n\n    commit;\n\t\n\tFETCH c_HistoryStudents INTO v_StudentID, v_FirstName, v_LastName;\n  \n  END LOOP;\n\n  DBMS_OUTPUT.put_line(c_HistoryStudents%ROWCOUNT);\n  CLOSE c_HistoryStudents;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "CASE", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 14, "occurrence": 1, "weight": 2},
        {"token": "WHILE", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "LOOP", "line": 24, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 36, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 40, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "OPEN", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "FETCH", "line": 22, "occurrence": 1, "weight": 3},
        {"token": "INTO", "line": 22, "occurrence": 1, "weight": 3},
        {"token": "%FOUND", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "FETCH", "line": 34, "occurrence": 1, "weight": 3},
        {"token": "INTO", "line": 34, "occurrence": 1, "weight": 3},
        {"token": "%ROWCOUNT", "line": 38, "occurrence": 1, "weight": 3},
        {"token": "CLOSE", "line": 39, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_p3",
    "practice": "epd7",
    "label": "Problema 3",
    "title": "Bucle FOR sobre cursor explicito (cursor FOR loop)",
    "enunciado": "1) Declara v_NumCredits %TYPE de classes.num_credits. 2) Define un CURSOR c_RegisteredStudents IS SELECT * FROM students WHERE id IN (SELECT student_id FROM registered_students WHERE department='HIS' AND course=301). 3) En el cuerpo, recupera con SELECT INTO el num_credits de HIS 301 en v_NumCredits. 4) Recorre el cursor con FOR v_StudentInfo IN c_RegisteredStudents LOOP y dentro actualiza students SET current_credits = current_credits + v_NumCredits WHERE id = v_StudentInfo.id. 5) Termina con COMMIT.",
    "difficulty": 2,
    "solution": "DECLARE\n  v_NumCredits  classes.num_credits%TYPE;\n\n  CURSOR c_RegisteredStudents IS\n    SELECT *\n      FROM students\n      WHERE id IN (SELECT student_id\n                     FROM registered_students\n                     WHERE department= 'HIS'\n                     AND course = 301);\nBEGIN\n  SELECT num_credits\n    INTO v_NumCredits\n    FROM classes\n    WHERE department = 'HIS'\n    AND course = 301;\n\n  FOR v_StudentInfo IN c_RegisteredStudents LOOP  \n  \n   UPDATE students\n    SET current_credits = current_credits + v_NumCredits\n    WHERE id=v_StudentInfo.id;\n    \n  END LOOP;\n    \n  COMMIT;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 11, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "FOR", "line": 18, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 18, "occurrence": 1, "weight": 3},
        {"token": "LOOP", "line": 18, "occurrence": 1, "weight": 3},
        {"token": "END LOOP", "line": 24, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 27, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 4, "occurrence": 1, "weight": 2}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_p4",
    "practice": "epd7",
    "label": "Problema 4",
    "title": "Bucle FOR con subconsulta en linea (cursor implicito)",
    "enunciado": "1) Declara v_NumCredits %TYPE de classes.num_credits. 2) Recupera con SELECT INTO el num_credits de HIS 301 en v_NumCredits. 3) Usa un bucle FOR v_StudentInfo IN (SELECT * FROM students WHERE id IN (SELECT student_id FROM registered_students WHERE department='HIS' AND course=301)) LOOP, sin necesidad de declarar el cursor explicitamente. 4) Dentro, actualiza students.current_credits sumando v_NumCredits. 5) Cierra con COMMIT.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_NumCredits  classes.num_credits%TYPE;\n    \nBEGIN\n  SELECT num_credits\n    INTO v_NumCredits\n    FROM classes\n    WHERE department = 'HIS'\n    AND course = 301;\n\n  FOR v_StudentInfo IN (SELECT *\n\t\t\t\t\t\t  FROM students\n\t\t\t\t\t\t  WHERE id IN (SELECT student_id\n\t\t\t\t\t\t\t\t\t\t FROM registered_students\n\t\t\t\t\t\t\t\t\t\t WHERE department= 'HIS'\n\t\t\t\t\t\t\t\t\t\t AND course = 301) LOOP\n  \n  UPDATE students\n    SET current_credits = current_credits + v_NumCredits\n    WHERE id=v_StudentInfo.id;\n    \n  END LOOP;\n    \n  COMMIT;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 6, "occurrence": 1, "weight": 2},
        {"token": "FOR", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "LOOP", "line": 16, "occurrence": 1, "weight": 3},
        {"token": "END LOOP", "line": 22, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 25, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_e1",
    "practice": "epd7",
    "label": "Experimento 1",
    "title": "Cursor explicito basico para listar estudiantes",
    "enunciado": "1) Declara v_StudentID, v_FirstName y v_LastName con %TYPE de students. 2) Declara v_Major %TYPE de students.major inicializada a 'Computer Science'. 3) Declara CURSOR c_Students IS SELECT id, first_name, last_name FROM students WHERE major = v_Major. 4) OPEN c_Students, LOOP con FETCH INTO las tres variables, EXIT WHEN %NOTFOUND y DBMS_OUTPUT.PUT_LINE concatenando los campos. 5) CLOSE c_Students.",
    "difficulty": 2,
    "solution": "DECLARE\n  \n  v_StudentID    students.id%TYPE;\n  v_FirstName    students.first_name%TYPE;\n  v_LastName     students.last_name%TYPE;\n\n  v_Major        students.major%TYPE := 'Computer Science';\n\n    CURSOR c_Students IS\n    SELECT id, first_name, last_name\n      FROM students\n      WHERE major = v_Major;\nBEGIN \n \n  OPEN c_Students;\n  LOOP\n   \t FETCH c_Students INTO v_StudentID, v_FirstName, v_LastName;\n\n      \tEXIT WHEN c_Students%NOTFOUND;\n        DBMS_OUTPUT.PUT_LINE(v_StudentID||' '||v_firstname||' '||v_lastname);\n  END LOOP;\n\n  CLOSE c_Students;\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 13, "occurrence": 1, "weight": 1},
        {"token": "LOOP", "line": 16, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 21, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 24, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 9, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "OPEN", "line": 15, "occurrence": 1, "weight": 3},
        {"token": "FETCH", "line": 17, "occurrence": 1, "weight": 3},
        {"token": "INTO", "line": 17, "occurrence": 1, "weight": 3},
        {"token": "EXIT", "line": 19, "occurrence": 1, "weight": 3},
        {"token": "%NOTFOUND", "line": 19, "occurrence": 1, "weight": 3},
        {"token": "CLOSE", "line": 23, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_e2",
    "practice": "epd7",
    "label": "Experimento 2",
    "title": "Error ORA-6511 al hacer OPEN de un cursor ya abierto",
    "enunciado": "1) Declara v_StudentID %TYPE de students.ID y un CURSOR c_AllStudentIDs IS SELECT ID FROM students. 2) En el cuerpo, abre el cursor con OPEN c_AllStudentIDs. 3) Vuelve a abrirlo otra vez con OPEN c_AllStudentIDs sin cerrarlo antes: esto genera el error ORA-6511 (cursor already open).",
    "difficulty": 1,
    "solution": "DECLARE\n  v_StudentID students.ID%TYPE;\n  \n  CURSOR c_AllStudentIDs IS\n    SELECT ID FROM students;\nBEGIN\n  OPEN c_AllStudentIDs;\n  \n  OPEN c_AllStudentIDs;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 6, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 10, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "OPEN", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "OPEN", "line": 9, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_e3",
    "practice": "epd7",
    "label": "Experimento 3",
    "title": "Cursor con varios parametros y registro %ROWTYPE",
    "enunciado": "1) Declara v_Classes como classes%ROWTYPE. 2) Declara CURSOR c_Classes(p_Department classes.department%TYPE, p_Course classes.course%TYPE) IS SELECT * FROM classes WHERE department=p_Department AND course=p_Course. 3) Abre el cursor pasando ('HIS',101). 4) Haz un FETCH INTO v_Classes. 5) Imprime con DBMS_OUTPUT.PUT_LINE el campo description del registro recuperado.",
    "difficulty": 2,
    "solution": "DECLARE\n  v_Classes     classes%ROWTYPE;\n  CURSOR c_Classes(p_Department classes.department%TYPE,\n                   p_Course classes.course%TYPE) IS\n  SELECT *\n    FROM classes\n    WHERE department = p_Department\n    AND course = p_Course;\nBEGIN\n  OPEN c_Classes('HIS', 101);\n  FETCH c_Classes INTO v_Classes;\n  DBMS_OUTPUT.PUT_LINE(v_Classes.description);\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%ROWTYPE", "line": 2, "occurrence": 1, "weight": 3},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 9, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 13, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "OPEN", "line": 10, "occurrence": 1, "weight": 3},
        {"token": "FETCH", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "INTO", "line": 11, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd7_e4",
    "practice": "epd7",
    "label": "Experimento 4",
    "title": "Cursor implicito: SQL%ROWCOUNT tras UPDATE",
    "enunciado": "1) En un bloque PL/SQL anonimo, realiza un UPDATE rooms SET number_seats = 100 WHERE room_id = 99980. 2) A continuacion comprueba con IF SQL%ROWCOUNT = 0 THEN si la sentencia anterior no afecto a ninguna fila. 3) En ese caso, inserta una nueva fila en rooms (room_id, number_seats) VALUES (99980, 100). 4) Cierra con END IF y END.",
    "difficulty": 2,
    "solution": "BEGIN\n  UPDATE rooms\n    SET number_seats = 100\n    WHERE room_id = 99980;\n  IF SQL%ROWCOUNT = 0 THEN\n    INSERT INTO rooms (room_id, number_seats)\n      VALUES (99980, 100);\n  END IF;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "BEGIN", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "IF", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 8, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 9, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "%ROWCOUNT", "line": 5, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": []
    }
  },
  {
    "id": "epd8_p1_1",
    "practice": "epd8",
    "label": "P1.1",
    "title": "Tratamiento global de excepciones con WHEN OTHERS",
    "enunciado": "1) Declara v_Major, v_LastName y v_Room (este ultimo como rooms%ROWTYPE) y un contador v_cont NUMBER:=1. 2) En el bloque, realiza tres SELECT INTO consecutivos (major en major_stats LIKE 'His%', last_name en students con condicion compuesta, * en rooms WHERE number_seats=50) e incrementa v_cont entre ellos. 3) Anade una unica seccion EXCEPTION con WHEN OTHERS THEN que imprima SQLCODE y SQLERRM y diga en que sentencia fallo segun v_cont. Observa que con este patron, al primer error se sale del bloque y se pierden las sentencias siguientes.",
    "difficulty": 2,
    "solution": "DECLARE\n\n    v_Major major_stats.MAJOR%TYPE;\n    v_LastName students.LAST_NAME%TYPE;\n    v_Room  rooms%ROWTYPE;\n    v_cont  NUMBER:=1;\n    \nBEGIN\n\n    SELECT major INTO v_Major from major_stats where major like 'His%';\n    v_cont:=v_cont +1;\n    \n    SELECT last_name INTO v_LastName from students where major like 'Economics' and current_credits=8;\n    v_cont:=v_cont +1;\n    \n    SELECT * INTO v_Room from rooms where number_seats=50; \n    v_cont:=v_cont +1;\n    \nEXCEPTION\n    WHEN OTHERS THEN\n        dbms_output.put_line(SQLCODE||' '||SQLERRM);\n        dbms_output.put_line('La sentencia que ha fallado es la '||v_cont);\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "%ROWTYPE", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 8, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 16, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 23, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 19, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "SQLCODE", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 21, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_p1_2",
    "practice": "epd8",
    "label": "P1.2",
    "title": "Tratamiento local de excepciones con sub-bloques",
    "enunciado": "1) Declara v_Major, v_LastName y v_Room. 2) Encierra cada SELECT INTO problematico en su propio sub-bloque BEGIN/EXCEPTION/END, de modo que un fallo en uno no aborte los siguientes. 3) En cada sub-bloque, captura WHEN OTHERS THEN e imprime SQLCODE, SQLERRM y un mensaje indicando si fallo la primera, segunda o tercera sentencia. Esto permite continuar la ejecucion aunque alguna sentencia falle.",
    "difficulty": 3,
    "solution": "DECLARE\n\n    v_Major major_stats.MAJOR%TYPE;\n    v_LastName students.LAST_NAME%TYPE;\n    v_Room  rooms%ROWTYPE;\n       \nBEGIN\n\n    BEGIN\n        SELECT major INTO v_Major from major_stats where major like 'Math%';\n    EXCEPTION\n        WHEN OTHERS THEN\n        dbms_output.put_line(SQLCODE||' '||SQLERRM);\n        dbms_output.put_line('La sentencia que ha fallado es la primera');\n    END;\n    \n    BEGIN\n        SELECT last_name INTO v_LastName from students where major like 'Economics' and current_credits=8;\n     EXCEPTION\n        WHEN OTHERS THEN\n        dbms_output.put_line(SQLCODE||' '||SQLERRM);\n        dbms_output.put_line('La sentencia que ha fallado es la segunda');\n    END;\n    \n    BEGIN\n        SELECT * INTO v_Room from rooms where number_seats=50; \n     EXCEPTION\n        WHEN OTHERS THEN\n        dbms_output.put_line(SQLCODE||' '||SQLERRM);\n        dbms_output.put_line('La sentencia que ha fallado es la tercera');\n    END;\n    \n\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%ROWTYPE", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 7, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 15, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 17, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 18, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 23, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 25, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 26, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 31, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 34, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 12, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 12, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 19, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 27, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 28, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 28, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 29, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 29, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_p2",
    "practice": "epd8",
    "label": "P2",
    "title": "Excepcion definida por el usuario y RAISE en CASE",
    "enunciado": "1) Declara las variables usuales (v_StudentID, v_FirstName, v_LastName, v_Subject, v_Department), una excepcion propia e_noDepartment EXCEPTION, dos variables v_error y v_errorMessage para guardar SQLCODE/SQLERRM, y el CURSOR c_HistoryStudents parametrizado. 2) Con un CASE Upper(v_Subject), asigna v_Department; en la rama ELSE haz RAISE e_noDepartment. 3) Abre el cursor, recorre con LOOP/FETCH/EXIT WHEN %NOTFOUND insertando filas en registered_students y temp_table, cierra el cursor. 4) En la seccion EXCEPTION, WHEN e_noDepartment THEN registra el error en log_table y por pantalla, y WHEN OTHERS THEN guarda SQLCODE/SUBSTR(SQLERRM,1,100) en log_table.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_StudentID   students.id%TYPE;\n  v_FirstName   students.first_name%TYPE;\n  v_LastName    students.last_name%TYPE;\n  v_Subject     students.MAJOR%TYPE:=&a;\n  v_Department  registered_students.DEPARTMENT%TYPE;\n  e_noDepartment EXCEPTION;\n  v_error   NUMBER;\n  v_errorMessage VARCHAR2(512);\n  CURSOR c_HistoryStudents (cV_Subject students.MAJOR%TYPE) IS\n    SELECT id, first_name, last_name\n      FROM students\n      WHERE major = cV_Subject;\n  \nBEGIN\n  \n  CASE Upper(v_Subject)\n    WHEN 'HISTORY' THEN v_Department:='HIS';\n    WHEN 'COMPUTER SCIENCE' THEN v_Department:='CS';\n    WHEN 'ECONOMICS' THEN v_Department:='ECN';\n    WHEN 'MUSIC' THEN v_Department:='MUS';\n    ELSE raise e_noDepartment;\n  END CASE;\n  \n  OPEN c_HistoryStudents(v_Subject);\n  LOOP\n    FETCH c_HistoryStudents INTO v_StudentID, v_FirstName, v_LastName;\n\n    INSERT INTO registered_students (student_id, department, course)\n      VALUES (v_StudentID, v_Department, 301);\n\n    INSERT INTO temp_table (num_col, char_col)\n      VALUES (v_StudentID, v_FirstName || ' ' || v_LastName);\n\n    commit;\n    EXIT WHEN c_HistoryStudents%NOTFOUND;\n\n  END LOOP;\n\n  DBMS_OUTPUT.put_line(c_HistoryStudents%ROWCOUNT);\n  CLOSE c_HistoryStudents;\n  \n  EXCEPTION\n    WHEN e_noDepartment THEN\n        insert into log_table values(1,'El departamento '||v_Subject||' no existe','Error de usuario');\n        dbms_output.put_line('El departamento '||v_Subject||' no existe');\n        commit;\n    WHEN OTHERS THEN\n         v_error:=SQLCODE;\n         v_errorMessage:=SUBSTR(SQLERRM,1,100);\n         dbms_output.put_line(v_error||' '||SQLERRM);\n         insert into log_table values (v_error,v_errorMessage,'Error de usuario');\n        commit;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 15, "occurrence": 1, "weight": 1},
        {"token": "CASE", "line": 17, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 18, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 18, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 22, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 26, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 38, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 54, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 10, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "OPEN", "line": 25, "occurrence": 1, "weight": 3},
        {"token": "FETCH", "line": 27, "occurrence": 1, "weight": 3},
        {"token": "INTO", "line": 27, "occurrence": 1, "weight": 3},
        {"token": "EXIT", "line": 36, "occurrence": 1, "weight": 3},
        {"token": "%NOTFOUND", "line": 36, "occurrence": 1, "weight": 3},
        {"token": "%ROWCOUNT", "line": 40, "occurrence": 1, "weight": 3},
        {"token": "CLOSE", "line": 41, "occurrence": 1, "weight": 3}
      ],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "raise", "line": 22, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 43, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 44, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 48, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 48, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 49, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 50, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 51, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_p3",
    "practice": "epd8",
    "label": "P3",
    "title": "RAISE_APPLICATION_ERROR para validar regla de negocio",
    "enunciado": "1) Declara v_NumCredits y v_new_credits %TYPE de classes.num_credits, mas v_error y v_errorMessage. 2) Define un CURSOR c_RegisteredStudents IS SELECT * FROM students WHERE id IN (subconsulta de registered_students en HIS 301). 3) Con SELECT INTO obten num_credits de HIS 301. 4) Recorre el cursor con FOR v_StudentInfo IN c_RegisteredStudents LOOP: calcula v_new_credits = v_StudentInfo.credits + v_NumCredits, y si v_new_credits > 100 lanza RAISE_APPLICATION_ERROR(-20001,'Maximo de creditos para estudiante con id:'||v_StudentInfo.id). En caso contrario actualiza students. 5) COMMIT y en EXCEPTION WHEN OTHERS THEN inserta el error en log_table.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_NumCredits  classes.num_credits%TYPE;\n  v_new_credits classes.num_credits%TYPE;\n  v_error   NUMBER;\n  v_errorMessage VARCHAR2(512);\n  CURSOR c_RegisteredStudents IS\n    SELECT *\n      FROM students\n      WHERE id IN (SELECT student_id\n                     FROM registered_students\n                     WHERE department= 'HIS'\n                     AND course = 301);\nBEGIN\n  SELECT num_credits\n    INTO v_NumCredits\n    FROM classes\n    WHERE department = 'HIS'\n    AND course = 301;\n\n  FOR v_StudentInfo IN c_RegisteredStudents LOOP  \n  \n\tv_new_credits := v_StudentInfo.credits + v_NumCredits;\n\t\n\tIF v_new_credits> 100 THEN\n\t\tRAISE_APPLICATION_ERROR(-20001,\n        'Maximo de creditos para estudiante con id:' ||v_StudentInfo.id);\n\tEND IF;\n  \n\t  UPDATE students\n\t\tSET current_credits = current_credits + v_NumCredits\n\t\tWHERE id=v_StudentInfo.id;\n    \n  END LOOP;\n    \n  COMMIT;\nEXCEPTION\n\tWHEN OTHERS THEN\n         v_error:=SQLCODE;\n         v_errorMessage:=SUBSTR(SQLERRM,1,100);\n         dbms_output.put_line(v_error||' '||SQLERRM);\n         insert into log_table values (v_error,v_errorMessage,'Error de usuario');\n        commit;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 13, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 15, "occurrence": 1, "weight": 2},
        {"token": "FOR", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "IN", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 24, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 24, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 27, "occurrence": 1, "weight": 2},
        {"token": "END LOOP", "line": 33, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 43, "occurrence": 1, "weight": 1}
      ],
      "cursors": [
        {"token": "CURSOR", "line": 6, "occurrence": 1, "weight": 3},
        {"token": "IS", "line": 6, "occurrence": 1, "weight": 2}
      ],
      "params": [],
      "exceptions": [
        {"token": "RAISE_APPLICATION_ERROR", "line": 25, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 36, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 37, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 37, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 38, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 39, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 40, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_p4",
    "practice": "epd8",
    "label": "P4",
    "title": "Manejo de errores por iteracion dentro de un bucle FOR",
    "enunciado": "1) Declara v_error NUMBER y v_errorMessage VARCHAR2(512). 2) Recorre con FOR I IN 90..110 LOOP y dentro abre un sub-bloque BEGIN/EXCEPTION/END que intente INSERT INTO NUMEROS(numCadena) VALUES (I). 3) En el EXCEPTION del sub-bloque, captura WHEN OTHERS THEN guardando SQLCODE/SUBSTR(SQLERRM,1,100) en log_table indicando 'Error insertando el valor:'||I. 4) Tras END LOOP, haz COMMIT y maneja en otro EXCEPTION WHEN OTHERS THEN cualquier error general. Asi un fallo en un valor no aborta el resto del bucle.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_error   NUMBER;\n  v_errorMessage VARCHAR2(512);\nBEGIN\n  \n  FOR I IN 90..110 LOOP  \n  \n\tBEGIN\n\t\tINSERT INTO NUMEROS (numCadena)\n\t\t\t\t\t VALUES (I);\t\n\tEXCEPTION\n\t\tWHEN OTHERS THEN\n\t\tv_error:=SQLCODE;\n        v_errorMessage:=SUBSTR(SQLERRM,1,100);\n        dbms_output.put_line(v_error||' '||SQLERRM);\n        insert into log_table values (v_error,v_errorMessage,'Error insertanto el valor:' || I);\n\t\t\t\n\tEND;\n  END LOOP;\n    \n  COMMIT;\nEXCEPTION\n\tWHEN OTHERS THEN\n         v_error:=SQLCODE;\n         v_errorMessage:=SUBSTR(SQLERRM,1,100);\n         dbms_output.put_line(v_error||' '||SQLERRM);\n         insert into log_table values (v_error,v_errorMessage,'Error de usuario');\n        commit;\nEND;\n/",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "FOR", "line": 6, "occurrence": 1, "weight": 2},
        {"token": "IN", "line": 6, "occurrence": 1, "weight": 2},
        {"token": "LOOP", "line": 6, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 8, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 18, "occurrence": 1, "weight": 1},
        {"token": "END LOOP", "line": 19, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 29, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 11, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 12, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 12, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 14, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 15, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 22, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 23, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 23, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 25, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 26, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_p5",
    "practice": "epd8",
    "label": "P5",
    "title": "Excepciones predefinidas NO_DATA_FOUND y TOO_MANY_ROWS",
    "enunciado": "1) Declara v_Major %TYPE de students.major, v_CourseName VARCHAR2(10), v_error NUMBER y v_errorMessage. 2) En un sub-bloque BEGIN/EXCEPTION/END intenta SELECT major INTO v_Major FROM students WHERE ID > 10. 3) Maneja por separado WHEN NO_DATA_FOUND THEN (no hay estudiante), WHEN TOO_MANY_ROWS THEN (hay mas de uno) y WHEN OTHERS THEN, registrando en cada caso SQLCODE, SUBSTR(SQLERRM,1,100) y el mensaje correspondiente en log_table. 4) Tras el sub-bloque, con un IF/ELSIF/ELSE asigna a v_CourseName el codigo segun v_Major y al final imprimelo.",
    "difficulty": 3,
    "solution": "DECLARE\n  v_Major students.major%TYPE;\n  v_CourseName VARCHAR2(10);\n  v_error   NUMBER;\n  v_errorMessage VARCHAR2(512);\nBEGIN\n  BEGIN\n\t  SELECT major\n\t\tINTO v_Major\n\t\tFROM students\n\t\tWHERE ID > 10;\n  EXCEPTION\n\tWHEN NO_DATA_FOUND THEN\n\t\t v_error:=SQLCODE;\n         v_errorMessage:=SUBSTR(SQLERRM,1,100);\n         dbms_output.put_line(v_error||' '||SQLERRM);\n         insert into log_table values (v_error,v_errorMessage,'No existe estudiante con ID > 10');\n        commit;\n\t\n\tWHEN TOO_MANY_ROWS THEN\n\t\t v_error:=SQLCODE;\n         v_errorMessage:=SUBSTR(SQLERRM,1,100);\n         dbms_output.put_line(v_error||' '||SQLERRM);\n         insert into log_table values (v_error,v_errorMessage,'Existe mas de un estudiante con ID > 10');\n        commit;\n\t\n\tWHEN OTHERS THEN\n\t\tv_error:=SQLCODE;\n         v_errorMessage:=SUBSTR(SQLERRM,1,100);\n         dbms_output.put_line(v_error||' '||SQLERRM);\n         insert into log_table values (v_error,v_errorMessage,'Otro error no controlado');\n        commit;\n  END;\n  \n  IF v_Major = 'Computer Science' THEN\n    v_CourseName := 'CS  101';\n  ELSIF v_Major = 'Economics' THEN\n    v_CourseName := 'ECN 203';\n  ELSIF v_Major = 'History' THEN\n    v_CourseName := 'HIS 101';\n  ELSIF v_Major = 'Music' THEN\n    v_CourseName := 'MUS 100';\n  ELSIF v_Major = 'Nutrition' THEN\n    v_CourseName := 'NUT 307';\n  ELSE\n    v_CourseName := 'Unknown';\n  END IF;\n  DBMS_OUTPUT.PUT_LINE(v_CourseName);\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 6, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 33, "occurrence": 1, "weight": 1},
        {"token": "IF", "line": 35, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 35, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 37, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 37, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 39, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 41, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 43, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 45, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 47, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 49, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 12, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "NO_DATA_FOUND", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "SQLCODE", "line": 14, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 15, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "TOO_MANY_ROWS", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 22, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 27, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 27, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 28, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 29, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_e1",
    "practice": "epd8",
    "label": "Experimento 1",
    "title": "RAISE_APPLICATION_ERROR para reglas y NO_DATA_FOUND",
    "enunciado": "1) Declara v_CurrentStudents y v_MaxStudents NUMBER(3), p_Course y p_Department %TYPE de classes (recogidos por sustitucion &c y &d), v_ErrorCode y v_ErrorText. 2) Recupera con SELECT INTO el current_students y max_students del curso solicitado. 3) Si v_CurrentStudents > v_MaxStudents, lanza RAISE_APPLICATION_ERROR(-20000,'Can''t add more students to '...). 4) En la seccion EXCEPTION, captura WHEN NO_DATA_FOUND THEN con RAISE_APPLICATION_ERROR(-20001,p_Department||' '||p_Course||' doesn''t exist') y WHEN OTHERS THEN imprime SQLCODE y SQLERRM.",
    "difficulty": 3,
    "solution": "DECLARE\n\n  v_CurrentStudents NUMBER(3);\n  v_MaxStudents NUMBER(3);\n  p_Course  classes.course%TYPE:=&c;\n  p_Department classes.department%TYPE:=&d;\n  v_ErrorCode  NUMBER;\n  v_ErrorText   VARCHAR2(512);\n\nBEGIN\n\n  SELECT current_students, max_students\n    INTO v_CurrentStudents, v_MaxStudents\n    FROM classes\n    WHERE department = p_Department AND course = p_Course;\n\n  IF v_CurrentStudents > v_MaxStudents THEN\n\n         RAISE_APPLICATION_ERROR(-20000,\n        'Can''t add more students to ' || p_Department || ' ' || p_Course);\n\n  END IF;\n\nEXCEPTION\n    WHEN NO_DATA_FOUND THEN\n      \n      RAISE_APPLICATION_ERROR(-20001,\n        p_Department || ' ' || p_Course || ' doesn''t exist');\n WHEN OTHERS THEN\n   \n    v_ErrorCode := SQLCODE;\n   \n    v_ErrorText := SQLERRM;\n\n    DBMS_OUTPUT.PUT_LINE(SQLCODE||' '||SQLERRM);\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "%TYPE", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 6, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 10, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 17, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 17, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 22, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 36, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "RAISE_APPLICATION_ERROR", "line": 19, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 25, "occurrence": 1, "weight": 3},
        {"token": "NO_DATA_FOUND", "line": 25, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 25, "occurrence": 1, "weight": 2},
        {"token": "RAISE_APPLICATION_ERROR", "line": 27, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 29, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 29, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 31, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 33, "occurrence": 1, "weight": 3},
        {"token": "SQLCODE", "line": 35, "occurrence": 1, "weight": 3},
        {"token": "SQLERRM", "line": 35, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd8_e2",
    "practice": "epd8",
    "label": "Experimento 2",
    "title": "Orden de rutinas WHEN: la primera que coincide se ejecuta",
    "enunciado": "1) Declara dos excepciones e_Exception1 y e_Exception2. 2) En el cuerpo, lanza RAISE e_Exception1. 3) Define una seccion EXCEPTION con tres rutinas: WHEN e_Exception2 THEN (Handler 1), WHEN e_Exception1 THEN (Handler 2), y WHEN e_Exception1 OR e_Exception2 THEN (Handler 3). 4) Observa que solo se ejecuta la segunda rutina (Handler 2), porque al lanzar e_Exception1, PL/SQL elige la primera rutina WHEN que la captura.",
    "difficulty": 2,
    "solution": "DECLARE\n    e_Exception1 EXCEPTION;\n    e_Exception2 EXCEPTION;\nBEGIN\n    RAISE e_Exception1;\nEXCEPTION\n    WHEN e_Exception2 THEN\n        INSERT INTO log_table (info)\n           VALUES ('Handler 1 executed');\n    WHEN e_Exception1 THEN\n        INSERT INTO log_table (info)\n           VALUES ('Handler 2 executed');\n    WHEN e_Exception1 OR  e_Exception2  THEN\n        INSERT INTO log_table (info)\n           VALUES ('Handler 3 executed');\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 4, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 16, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 2, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "RAISE", "line": 5, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 6, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 7, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 10, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 13, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 13, "occurrence": 1, "weight": 2}
      ]
    }
  },
  {
    "id": "epd8_e3",
    "practice": "epd8",
    "label": "Experimento 3",
    "title": "Captura de VALUE_ERROR por desbordamiento de variable",
    "enunciado": "1) Declara v_TempVar NUMBER(2). 2) Intenta cargar con SELECT id INTO v_TempVar el id de students cuyo last_name='Smith'. 3) Como un id real no cabe en NUMBER(2), se lanza VALUE_ERROR. 4) En la seccion EXCEPTION captura WHEN VALUE_ERROR THEN e imprime un mensaje 'Error ...SQLCODE... Se ha intentado almacenar un valor demasiado grande para la variable'.",
    "difficulty": 1,
    "solution": "DECLARE\n  v_TempVar NUMBER(2);\nBEGIN\n  SELECT id\n    INTO v_TempVar\n    FROM students\n    WHERE last_name = 'Smith';\nEXCEPTION\n    WHEN VALUE_ERROR THEN\n    dbms_output.put_line('Error '||SQLCODE||'. Se ha intentado almacenar un valor demasiado grande para la variable');\nEND;",
    "gaps": {
      "keywords": [
        {"token": "DECLARE", "line": 1, "occurrence": 1, "weight": 1},
        {"token": "BEGIN", "line": 3, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 11, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [],
      "exceptions": [
        {"token": "EXCEPTION", "line": 8, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 9, "occurrence": 1, "weight": 3},
        {"token": "VALUE_ERROR", "line": 9, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "SQLCODE", "line": 10, "occurrence": 1, "weight": 3}
      ]
    }
  },
  {
    "id": "epd9_addnewstudent",
    "practice": "epd9",
    "label": "AddNewStudent",
    "title": "Procedimiento almacenado con parametros IN",
    "enunciado": "1) Crea (o reemplaza) un procedimiento llamado AddNewStudent que reciba tres parametros: p_FirstName, p_LastName y p_Major, todos con %TYPE de las columnas correspondientes de students y modo IN (por defecto). 2) En el cuerpo, inserta en students (ID, first_name, last_name, major, current_credits) usando student_sequence.nextval para el ID, los parametros recibidos y 0 como current_credits inicial. 3) Cierra con END AddNewStudent.",
    "difficulty": 2,
    "solution": "CREATE OR REPLACE PROCEDURE AddNewStudent (\n  p_FirstName  students.first_name%TYPE,\n  p_LastName   students.last_name%TYPE,\n  p_Major      students.major%TYPE) AS\nBEGIN\n  \n  INSERT INTO students (ID, first_name, last_name,\n                        major, current_credits)\n    VALUES (student_sequence.nextval, p_FirstName, p_LastName,\n            p_Major, 0);\nEND AddNewStudent;\n/",
    "gaps": {
      "keywords": [
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "AS", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 5, "occurrence": 1, "weight": 1},
        {"token": "END", "line": 11, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [
        {"token": "PROCEDURE", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "AddNewStudent", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "AddNewStudent", "line": 11, "occurrence": 1, "weight": 3}
      ],
      "exceptions": []
    }
  },
  {
    "id": "epd9_classinfo",
    "practice": "epd9",
    "label": "ClassInfo",
    "title": "Funcion almacenada con RETURN VARCHAR2",
    "enunciado": "1) Crea o reemplaza una funcion ClassInfo que reciba p_Department y p_Course (con %TYPE de classes) y devuelva un VARCHAR2 (RETURN VARCHAR2 IS). 2) Declara internamente v_CurrentStudents, v_MaxStudents y v_PercentFull NUMBER. 3) Con SELECT INTO obten current_students y max_students del curso solicitado. 4) Calcula v_PercentFull = v_CurrentStudents / v_MaxStudents * 100. 5) Con IF/ELSIF/ELSE devuelve 'Full' si =100, 'Some Room' si >80, 'More Room' si >60, 'Lots of Room' si >0, y 'Empty' en otro caso usando RETURN. 6) Cierra con END ClassInfo.",
    "difficulty": 3,
    "solution": "CREATE OR REPLACE FUNCTION ClassInfo(\n\n  p_Department classes.department%TYPE,\n  p_Course     classes.course%TYPE)\n  RETURN VARCHAR2 IS\n\n  v_CurrentStudents NUMBER;\n  v_MaxStudents     NUMBER;\n  v_PercentFull     NUMBER;\nBEGIN\n  SELECT current_students, max_students\n    INTO v_CurrentStudents, v_MaxStudents\n    FROM classes\n    WHERE department = p_Department\n    AND course = p_Course;\n\n  v_PercentFull := v_CurrentStudents / v_MaxStudents * 100;\n\n  IF v_PercentFull = 100 THEN\n    RETURN 'Full';\n  ELSIF v_PercentFull > 80 THEN\n    RETURN 'Some Room';\n  ELSIF v_PercentFull > 60 THEN\n    RETURN 'More Room';\n  ELSIF v_PercentFull > 0 THEN\n    RETURN 'Lots of Room';\n  ELSE\n    RETURN 'Empty';\n  END IF;\nEND ClassInfo;\n/",
    "gaps": {
      "keywords": [
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "IS", "line": 5, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 10, "occurrence": 1, "weight": 1},
        {"token": "INTO", "line": 12, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 19, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 19, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 21, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 21, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 23, "occurrence": 1, "weight": 2},
        {"token": "ELSIF", "line": 25, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 27, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 29, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 30, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [
        {"token": "FUNCTION", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "ClassInfo", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 5, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 20, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 22, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 24, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 26, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 28, "occurrence": 1, "weight": 3},
        {"token": "ClassInfo", "line": 30, "occurrence": 1, "weight": 3}
      ],
      "exceptions": []
    }
  },
  {
    "id": "epd9_modetest",
    "practice": "epd9",
    "label": "ModeTest",
    "title": "Procedimiento que ilustra modos IN, OUT e IN OUT",
    "enunciado": "1) Crea o reemplaza un procedimiento ModeTest con tres parametros NUMBER: p_InParameter IN, p_OutParameter OUT y p_InOutParameter IN OUT. 2) Declara una variable local v_LocalVariable NUMBER:=0. 3) Imprime 'Inside ModeTest:' y comprueba con IF... IS NULL si cada parametro es nulo o muestra su valor. 4) Demuestra los efectos de cada modo: lee p_InParameter, asigna p_OutParameter:=7 (y luego puedes leerla), lee y asigna p_InOutParameter. NOTA: p_InParameter := 7 es ilegal porque IN es de solo lectura. 5) Vuelve a imprimir los valores al final para ver los cambios. 6) Cierra con END ModeTest.",
    "difficulty": 3,
    "solution": "CREATE OR REPLACE PROCEDURE ModeTest (\n  p_InParameter    IN NUMBER,\n  p_OutParameter   OUT NUMBER,\n  p_InOutParameter IN OUT NUMBER) IS\n\n  v_LocalVariable  NUMBER := 0;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE('Inside ModeTest:');\n  IF (p_InParameter IS NULL) THEN\n    DBMS_OUTPUT.PUT('p_InParameter is NULL');\n  ELSE\n    DBMS_OUTPUT.PUT('p_InParameter = ' || p_InParameter);\n  END IF;\n\n  IF (p_OutParameter IS NULL) THEN\n    DBMS_OUTPUT.PUT('  p_OutParameter is NULL');\n  ELSE\n    DBMS_OUTPUT.PUT('  p_OutParameter = ' || p_OutParameter);\n  END IF;\n\n  IF (p_InOutParameter IS NULL) THEN\n    DBMS_OUTPUT.PUT_LINE('  p_InOutParameter is NULL');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('  p_InOutParameter = ' ||\n                         p_InOutParameter);\n  END IF;\n\n  v_LocalVariable := p_InParameter;  \n\n  p_InParameter := 7;  \n  \n  p_OutParameter := 7;  \n\n  v_LocalVariable := p_OutParameter;  \n\n  v_LocalVariable := p_InOutParameter;  \n\n  p_InOutParameter := 8;  \n\n  DBMS_OUTPUT.PUT_LINE('At end of ModeTest:');\n\n  IF (p_InParameter IS NULL) THEN\n    DBMS_OUTPUT.PUT('p_InParameter is NULL');\n  ELSE\n    DBMS_OUTPUT.PUT('p_InParameter = ' || p_InParameter);\n  END IF;\n\n  IF (p_OutParameter IS NULL) THEN\n    DBMS_OUTPUT.PUT('  p_OutParameter is NULL');\n  ELSE\n    DBMS_OUTPUT.PUT('  p_OutParameter = ' || p_OutParameter);\n  END IF;\n\n  IF (p_InOutParameter IS NULL) THEN\n    DBMS_OUTPUT.PUT_LINE('  p_InOutParameter is NULL');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('  p_InOutParameter = ' ||\n                         p_InOutParameter);\n  END IF;\n\nEND ModeTest;\n/",
    "gaps": {
      "keywords": [
        {"token": "IS", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 7, "occurrence": 1, "weight": 1},
        {"token": "IF", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 9, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 11, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 13, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 15, "occurrence": 1, "weight": 2},
        {"token": "ELSE", "line": 17, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 19, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 21, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 26, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 61, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [
        {"token": "PROCEDURE", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "ModeTest", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 2, "occurrence": 1, "weight": 3},
        {"token": "OUT", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "IN OUT", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "ModeTest", "line": 61, "occurrence": 1, "weight": 3}
      ],
      "exceptions": []
    }
  },
  {
    "id": "epd11_st_fu_insert_book",
    "practice": "epd11",
    "label": "ST_FU_INSERT_BOOK",
    "title": "Funcion ST_FU_INSERT_BOOK con excepciones de usuario",
    "enunciado": "1) Crea o reemplaza la funcion ST_FU_INSERT_BOOK que reciba p_TITLE y p_AUTHOR1 (obligatorios) y p_AUTHOR2..p_AUTHOR4 con DEFAULT NULL, todos IN con %TYPE de BOOKS, mas un parametro p_OUT_ERROR OUT VARCHAR2; debe devolver NUMBER. 2) Declara una variable v_NEW_PK %TYPE de BOOKS.CATALOG_NUMBER inicializada a NULL, v_COUNT NUMBER y dos excepciones EX_TITLE_AUTHOR_NULL y EX_BOOK_EXISTS. 3) Inicializa p_OUT_ERROR:=NULL. 4) Si p_TITLE o p_AUTHOR1 son NULL haz RAISE EX_TITLE_AUTHOR_NULL. 5) Cuenta libros con UPPER(TITLE)=UPPER(p_TITLE); si v_COUNT>0 haz RAISE EX_BOOK_EXISTS. 6) Obten la siguiente PK con SELECT NVL(MAX(CATALOG_NUMBER),0)+1 INTO v_NEW_PK. 7) Inserta el libro y haz COMMIT. 8) RETURN v_NEW_PK. 9) En EXCEPTION: WHEN EX_BOOK_EXISTS THEN asigna mensaje al OUT y RETURN; WHEN EX_TITLE_AUTHOR_NULL THEN mensaje y RETURN; WHEN OTHERS THEN mensaje generico y RETURN.",
    "difficulty": 3,
    "solution": "CREATE OR REPLACE FUNCTION ST_FU_INSERT_BOOK(\n    p_TITLE      IN BOOKS.TITLE%TYPE,\n    p_AUTHOR1    IN BOOKS.AUTHOR1%TYPE,\n    p_AUTHOR2    IN BOOKS.AUTHOR2%TYPE DEFAULT NULL,\n    p_AUTHOR3    IN BOOKS.AUTHOR3%TYPE DEFAULT NULL,\n    p_AUTHOR4    IN BOOKS.AUTHOR4%TYPE DEFAULT NULL,\n    p_OUT_ERROR  OUT VARCHAR2\n)\nRETURN NUMBER\nIS\n    v_NEW_PK      BOOKS.CATALOG_NUMBER%TYPE:=NULL;\n    v_COUNT       NUMBER;\n    \n    EX_TITLE_AUTHOR_NULL EXCEPTION;\n    EX_BOOK_EXISTS EXCEPTION;\n\nBEGIN\n    p_OUT_ERROR := NULL;\n\n    IF p_TITLE IS NULL OR p_AUTHOR1 IS NULL THEN\n        RAISE EX_TITLE_AUTHOR_NULL;\n    END IF;\n\n    SELECT COUNT(*)\n    INTO v_COUNT\n    FROM BOOKS\n    WHERE UPPER(TITLE) = UPPER(p_TITLE);\n\n    IF v_COUNT > 0 THEN\n        RAISE EX_BOOK_EXISTS;\n    END IF;\n\n    SELECT NVL(MAX(CATALOG_NUMBER),0) + 1\n    INTO v_NEW_PK\n    FROM BOOKS;\n\n    INSERT INTO BOOKS(\n        CATALOG_NUMBER,\n        TITLE,\n        AUTHOR1,\n        AUTHOR2,\n        AUTHOR3,\n        AUTHOR4\n    )\n    VALUES(\n        v_NEW_PK,\n        p_TITLE,\n        p_AUTHOR1,\n        p_AUTHOR2,\n        p_AUTHOR3,\n        p_AUTHOR4\n    );\n    commit;\n    RETURN v_NEW_PK;\n\nEXCEPTION\n\n    WHEN EX_BOOK_EXISTS THEN\n        p_OUT_ERROR := 'El libro ya existe';\n        RETURN v_NEW_PK;\n\n    WHEN EX_TITLE_AUTHOR_NULL THEN\n        p_OUT_ERROR := 'Debe indicar titulo y primer autor al menos';\n        RETURN v_NEW_PK;\n    WHEN OTHERS THEN \n        p_OUT_ERROR := 'Se ha producido un error inesperado';\n        RETURN v_NEW_PK;\n\nEND ST_FU_INSERT_BOOK;\n/",
    "gaps": {
      "keywords": [
        {"token": "%TYPE", "line": 2, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 3, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 4, "occurrence": 1, "weight": 2},
        {"token": "%TYPE", "line": 11, "occurrence": 1, "weight": 2},
        {"token": "IS", "line": 10, "occurrence": 1, "weight": 2},
        {"token": "BEGIN", "line": 17, "occurrence": 1, "weight": 1},
        {"token": "IF", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 20, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 22, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 25, "occurrence": 1, "weight": 2},
        {"token": "IF", "line": 29, "occurrence": 1, "weight": 2},
        {"token": "THEN", "line": 29, "occurrence": 1, "weight": 2},
        {"token": "END IF", "line": 31, "occurrence": 1, "weight": 2},
        {"token": "INTO", "line": 34, "occurrence": 1, "weight": 2},
        {"token": "END", "line": 69, "occurrence": 1, "weight": 1}
      ],
      "cursors": [],
      "params": [
        {"token": "FUNCTION", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "ST_FU_INSERT_BOOK", "line": 1, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 2, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 3, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 4, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 5, "occurrence": 1, "weight": 3},
        {"token": "IN", "line": 6, "occurrence": 1, "weight": 3},
        {"token": "OUT", "line": 7, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 9, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 54, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 60, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 64, "occurrence": 1, "weight": 3},
        {"token": "RETURN", "line": 67, "occurrence": 1, "weight": 3},
        {"token": "ST_FU_INSERT_BOOK", "line": 69, "occurrence": 1, "weight": 3}
      ],
      "exceptions": [
        {"token": "EXCEPTION", "line": 14, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 15, "occurrence": 1, "weight": 3},
        {"token": "RAISE", "line": 21, "occurrence": 1, "weight": 3},
        {"token": "RAISE", "line": 30, "occurrence": 1, "weight": 3},
        {"token": "EXCEPTION", "line": 56, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 58, "occurrence": 1, "weight": 3},
        {"token": "THEN", "line": 58, "occurrence": 1, "weight": 2},
        {"token": "WHEN", "line": 62, "occurrence": 1, "weight": 3},
        {"token": "WHEN", "line": 65, "occurrence": 1, "weight": 3},
        {"token": "OTHERS", "line": 65, "occurrence": 1, "weight": 3}
      ]
    }
  }
];
