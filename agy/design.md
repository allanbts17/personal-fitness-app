# 🎨 Guía de Estilo — Material Login Form
*Basado en el diseño de “Material” de puikinsh/login-forms*

---

## 🧠 Filosofía del diseño

El formulario utiliza principios de **Material Design**:
- Uso de **elevación y sombras** para resaltar superficies.  
- **Transiciones suaves** y retroalimentación visual (p. ej., efecto ripple o states en botones).  
- **Jerarquía clara** de información y espaciado consistente.  
- Interacciones que sugieren tacto y movimiento para dar realismo a los elementos. :contentReference[oaicite:1]{index=1}

---

## 🎨 Paleta de colores

Aunque el repositorio no expone variables CSS directamente (no hay CSS visible en el HTML publicado), el estilo “Material” clásico sugiere usar el sistema de paletas de Google Material a partir de:

### 🎯 Paleta base recomendada
> Puedes extraer esto del estándar de Material Design y adaptarlo a tus necesidades de branding 📌 :contentReference[oaicite:2]{index=2}

| Rol del color | Ejemplo HEX | Uso sugerido |
|---------------|-------------|--------------|
| **Primario (Main)** | `#1976D2` | Botones principales, encabezados |
| **Primario (light)** | `#42A5F5` | Estados hover, acentos suaves |
| **Primario (dark)** | `#1565C0` | Sombras más profundas, accents oscuros |
| **Surface / Fondo blanco** | `#FFFFFF` | Fondo del formulario |
| **Texto principal oscuro** | `rgba(0, 0, 0, 0.87)` | Labels y texto principal estándar |
| **Texto secundario** | `rgba(0, 0, 0, 0.6)` | Texto de menor jerarquía |
| **Error** | `#D32F2F` | Estados de error en formularios |

> **Nota:** Material Design recomienda generar la paleta completa (50–900 y variantes A) para accesibilidad y consistencia usando herramientas de color de Material. :contentReference[oaicite:3]{index=3}

---

## 🔤 Tipografía

El sitio en el ejemplo no carga explícitamente una fuente desde la vista (HTML), pero un formulario Material típico usa:

### 📌 Fuentes recomendadas
- **Roboto** (primaria) – tipografía estándar de Material Design.  
  - Variantes: 300, 400, 500, 700  
  - Tamaños:  
    - Título/Form Header: **24–32px**  
    - Label de entrada: **16px**  
    - Texto de botón: **14–16px**  
    - Texto de ayuda o hipervínculos: **12–14px**

Ejemplo importación Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
