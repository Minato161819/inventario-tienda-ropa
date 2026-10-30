# SchoolStock — Gestión de inventario escolar

Aplicación web frontend para administrar los recursos de una institución educativa. Permite registrar artículos, controlar entradas y salidas, consultar existencias y generar archivos CSV que pueden abrirse en Excel.

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.8
- `localStorage` para persistencia de datos en el navegador

## Funcionalidades

- **Panel general:** indicadores de artículos, unidades disponibles, alertas de stock y actividad reciente.
- **Inventario:** crear, editar y eliminar artículos; buscar por nombre, código o ubicación; filtrar por categoría y estado de stock.
- **Movimientos:** registrar entradas y salidas. Las salidas no permiten retirar una cantidad superior a la existencia disponible.
- **Reportes:** resumen de existencias por categoría y estado general del inventario.
- **Exportación:** descarga del inventario y del historial de movimientos en CSV compatible con Excel.
- **Persistencia local:** los cambios se conservan en el navegador mediante `localStorage`.
- **Diseño adaptable:** interfaz responsive para computador, tableta y móvil.

## Cómo ejecutar el proyecto

1. Descarga o clona este repositorio.
2. Abre la carpeta del proyecto.
3. Ejecuta `index.html` en un navegador moderno. También puedes abrir la carpeta con Visual Studio Code y usar la extensión **Live Server**.
4. La aplicación carga datos de demostración la primera vez. Puedes crear, editar o eliminar artículos y registrar movimientos.

> Bootstrap se carga desde jsDelivr, por lo que se necesita conexión a internet para cargar los estilos y componentes de Bootstrap. Los datos de la aplicación permanecen en el almacenamiento local del navegador.

## Estructura del proyecto

```text
SchoolStock/
├── index.html
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── app.js
```

## Publicar con GitHub Pages

1. Crea un repositorio público en GitHub, por ejemplo `schoolstock-inventario-escolar`.
2. Sube todos los archivos y carpetas de este proyecto conservando su estructura.
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
6. Cuando GitHub Pages termine de publicar, encontrarás allí la dirección pública de tu aplicación.

## Alcance y mejoras futuras

Esta versión es una demostración frontend: no tiene inicio de sesión, servidor ni base de datos compartida. Los datos se guardan únicamente en el navegador y dispositivo donde se realizan los cambios. Para utilizarlo en una institución real, se recomienda agregar una API, una base de datos (por ejemplo, MySQL o PostgreSQL), autenticación, roles y copias de seguridad.

## Autor

Proyecto de portafolio académico — **Minato161819**.
