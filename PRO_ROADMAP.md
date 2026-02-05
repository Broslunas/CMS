# 🚀 Roadmap: 50 Features para un CMS "Super Pro"

Esta lista está diseñada para elevar la calidad, funcionalidad y experiencia de usuario de Broslunas CMS a un nivel premium y profesional.

## 🎨 UI/UX & Experiencia Visual (Premium Feel)
1.  **Command Palette Global (`Cmd+K`)**: Navegación rápida por archivos, acciones y configuraciones sin usar el ratón.
3.  **Skeleton Loaders Inteligentes**: Reemplazar spinners con esqueletos pulsantes que imitan la estructura del contenido.
4.  **Sistema Toast Avanzado**: Notificaciones apilables, con animaciones de entrada/salida y botón de "Deshacer" acción.
5.  **Menús Contextuales (Click Derecho)**: Acciones rápidas (Renombrar, Borrar, Duplicar) en el explorador de archivos.
6.  **Atajos de Teclado Globales**: `Ctrl+S` para guardar, `Ctrl+P` para previsualizar, etc.
7.  **Breadcrumbs Dinámicos**: Navegación de migas de pan con dropdowns para hermanos de carpeta.
8.  **Modo Zen (Focus Mode)**: Botón para ocultar barras laterales y centrarse solo en el editor.
9.  **Paneles Redimensionables**: Permitir al usuario ajustar el ancho del editor vs la previsualización.
10. **Diseño Glassmorphism**: Toques sutiles de desenfoque y transparencias en modales y barras flotantes.

## ✍️ Editor & Gestión de Contenido (Core)
11. **Edición Multi-curso**: Soporte para editar múltiples líneas a la vez en el editor de código/texto.
12. **Barra de Herramientas Flotante**: Al seleccionar texto, mostrar opciones de formato (Negrita, Link, H1/H2).
13. **Drag & Drop de Imágenes**: Arrastrar imágenes directamente al editor Markdown y subirlas automáticamente.
14. **Pegado Inteligente**: Pegar una imagen del portapapeles y que se convierta en un archivo en `assets`.
15. **Índice Automático (TOC)**: Generar tabla de contenidos lateral navegable para posts largos.
16. **Comandos "Slash" (`/`)**: Menú emergente al escribir `/` para insertar componentes, imágenes o tablas.
17. **Contador en Tiempo Real**: Palabras, caracteres y tiempo de lectura estimado mientras escribes.
18. **Syntax Highlighting en Vivo**: Colores para bloques de código dentro del editor Markdown.
19. **Validación de Schema Visual**: Si falta un campo requerido del frontmatter, marcarlo en rojo visualmente.
20. **Selector de Fecha/Hora Visual**: Calendario pop-up para campos de fecha.

## 🐙 Git & GitHub Integration (DevFlow)
23. **Gestión de Ramas (Branches)**: Crear, cambiar y fusionar ramas desde el dashboard.
24. **Estado de Pull Requests**: Ver si hay PRs abiertos y su estado (aprobado, fallido).
25. **Resolución de Conflictos UI**: Interfaz gráfica para elegir "Mine" o "Theirs" si hay conflictos de edición.
26. **Mensajes de Commit con AI**: Generar mensajes de commit descriptivos automáticamente basados en los cambios.
27. **Indicadores de Estado de Archivo**: Iconos de colores (🟢 Nuevo, 🟡 Modificado, 🔴 Borrado) en el árbol de archivos.
28. **Git Blame Integrado**: Ver quién editó una línea específica y cuándo (hover en el margen).
29. **Indicador de Sync Real-time**: Icono de estado que muestra si los cambios están sincronizados con GitHub.
30. **Commits Selectivos**: Checkbox para elegir qué archivos incluir en un guardado (Commit por partes).

## 🖼️ Media & Assets
31. **Optimización Automática**: Convertir imágenes a WebP/AVIF al subirlas.
32. **Editor de Imágenes Básico**: Recortar, rotar y redimensionar imágenes dentro del CMS.
33. **Librería de Medios Global**: Explorador visual de todas las imágenes del repo con búsqueda y filtros.
34. **Previsualización de SVG**: Renderizar SVGs en lugar de mostrar el código en el explorador.
35. **Integración Unsplash/Pexels**: Buscador de stock photos integrado para insertar directamente.

## 🤖 AI & Automatización (Gemini Power)
36. **Corrector Gramatical AI**: Revisión de ortografía y estilo con un click.
37. **Reescritura de Tono**: Botones para "Hacer más formal", "Hacer más corto", "Hacer más divertido".
38. **Generador SEO Automático**: Sugerir Title y Meta Description basados en el contenido del post.
39. **Auto-Tagging**: AI analiza el texto y sugiere etiquetas/categorías relevantes.
40. **Chat con tu Contenido**: Asistente lateral para hacer preguntas sobre tus propios posts ("¿Qué dije sobre X en el post Y?").

## ⚙️ Sistema & Workflow
41. **Workflow de Publicación**: Estados visuales (Borrador -> En Revisión -> Programado -> Publicado).
42. **Roles de Usuario**: Diferenciar entre Admin (todo) y Editor (solo editar contenido, no borrar).
43. **Audit Logs**: Registro de actividad (quién entró, quién editó qué y cuándo).
44. **Webhooks Trigger UI**: Botón para disparar un "Rebuild" en Vercel/Netlify manualmente.
45. **Soporte PWA**: Hacer el CMS instalable como app en escritorio y móvil.
46. **Widgets Personalizables**: Dashboard con widgets movibles (Métricas, Últimos posts, Calendario).
47. **Soporte i18n Nativo**: UI para gestionar traducciones de campos si el contenido es multiidioma.
48. **Bloqueo de Archivos**: Avisar si otro usuario está editando el mismo archivo (soft-lock).
49. **Papelera de Reciclaje**: "Soft delete" que mueve archivos a una carpeta `_trash` antes de borrar permanentemente.
50. **Onboarding Tour**: Guía interactiva paso a paso para nuevos usuarios la primera vez que entran.
