# Guía de Implementación SEO para FWSA

## 📋 Configuración Completada

### ✅ 1. Servicio SEO Creado
- **Ubicación**: `src/app/services/seo.service.ts`
- **Funcionalidades**:
  - Actualización dinámica de meta tags
  - Open Graph para redes sociales
  - Twitter Cards
  - JSON-LD Schema.org
  - URLs canónicas

### ✅ 2. Index.html Optimizado
- Meta tags base configurados
- Open Graph y Twitter Cards
- Idioma español (es-CO)
- Geo-localización para La Guajira
- Theme colors

---

## 🔧 Cómo Implementar SEO en Cada Componente

### Paso 1: Inyectar el Servicio SEO

En cada componente TypeScript (`.ts`), importa e inyecta el servicio:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';

export class TuComponente implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.setSEO();
  }

  private setSEO(): void {
    this.seoService.updateMetaTags({
      title: 'Título de la Página',
      description: 'Descripción optimizada para SEO (150-160 caracteres)',
      keywords: 'palabra clave 1, palabra clave 2, palabra clave 3',
      ogUrl: 'https://www.fwsa.org.co/ruta-pagina',
      ogImage: 'https://www.fwsa.org.co/assets/images/pagina-og.png'
    });
  }
}
```

---

## 📄 Configuración SEO por Página

### **Página Inicio (Home)**
```typescript
this.seoService.updateMetaTags({
  title: 'Inicio',
  description: 'Fundación Wopu Süpula Atüja (FWSA) - Organización sin ánimo de lucro dedicada al desarrollo integral de comunidades vulnerables en La Guajira mediante educación, emprendimiento y sostenibilidad.',
  keywords: 'FWSA, fundación La Guajira, desarrollo social Colombia, educación vulnerable, emprendimiento social',
  ogUrl: 'https://www.fwsa.org.co/',
  ogImage: 'https://www.fwsa.org.co/assets/images/home-og.png'
});

// Agregar Schema de Organización
this.seoService.generateOrganizationSchema();
```

### **Quiénes Somos**
```typescript
this.seoService.updateMetaTags({
  title: 'Quiénes Somos',
  description: 'Conoce nuestra historia, misión, visión y valores. Somos una fundación comprometida con el desarrollo social, humano y económico de las comunidades de La Guajira, Colombia.',
  keywords: 'misión FWSA, visión fundación, valores institucionales, historia FWSA, organización social La Guajira',
  ogUrl: 'https://www.fwsa.org.co/quienes-somos',
  ogImage: 'https://www.fwsa.org.co/assets/images/quienes-somos-og.png'
});
```

### **Equipo**
```typescript
this.seoService.updateMetaTags({
  title: 'Nuestro Equipo',
  description: 'Conoce al equipo humano detrás de FWSA. Profesionales comprometidos con el desarrollo integral y el bienestar de las comunidades en La Guajira.',
  keywords: 'equipo FWSA, directivos fundación, talento humano, profesionales desarrollo social',
  ogUrl: 'https://www.fwsa.org.co/equipo',
  ogImage: 'https://www.fwsa.org.co/assets/images/equipo-og.png'
});
```

### **Programas**
```typescript
this.seoService.updateMetaTags({
  title: 'Nuestros Programas',
  description: 'Descubre nuestros programas sociales, educativos y comunitarios. Trabajamos en formación integral, emprendimiento, empleabilidad, salud mental y medio ambiente en La Guajira.',
  keywords: 'programas sociales, formación integral, emprendimiento La Guajira, educación ambiental, salud mental comunitaria',
  ogUrl: 'https://www.fwsa.org.co/programas',
  ogImage: 'https://www.fwsa.org.co/assets/images/programas-og.png'
});
```

### **Impacto**
```typescript
this.seoService.updateMetaTags({
  title: 'Nuestro Impacto Social',
  description: 'Conoce el impacto social de FWSA. Trabajamos con niños, jóvenes, adultos y comunidades vulnerables en La Guajira para fortalecer capacidades y generar oportunidades.',
  keywords: 'impacto social, beneficiarios FWSA, comunidades vulnerables, desarrollo La Guajira, cambio social',
  ogUrl: 'https://www.fwsa.org.co/impacto',
  ogImage: 'https://www.fwsa.org.co/assets/images/impacto-og.png'
});
```

### **Contacto**
```typescript
this.seoService.updateMetaTags({
  title: 'Contacto',
  description: 'Contáctanos para más información sobre nuestros programas, voluntariado o donaciones. Ubicados en La Guajira, Colombia. WhatsApp: +57 311 495 2911',
  keywords: 'contacto FWSA, donar fundación, voluntariado La Guajira, contacto fundación Colombia',
  ogUrl: 'https://www.fwsa.org.co/contacto',
  ogImage: 'https://www.fwsa.org.co/assets/images/contacto-og.png'
});
```

---

## 🏷️ Jerarquía Correcta de Headings (H1-H6)

### Reglas Importantes:
1. **Un solo H1 por página** - Debe ser el título principal
2. **H2 para secciones principales**
3. **H3 para subsecciones**
4. **Nunca saltar niveles** (no ir de H1 a H3)

### Ejemplo de Estructura Correcta:

```html
<!-- CORRECTO -->
<h1>Nuestro Equipo</h1>  <!-- Solo uno por página -->
  <h2>Cuerpo Directivo</h2>  <!-- Sección principal -->
    <h3>Presidente</h3>  <!-- Subsección -->
    <h3>Vicepresidente</h3>
  <h2>Equipo Operativo</h2>
    <h3>Coordinadores</h3>

<!-- INCORRECTO ❌ -->
<h1>Título Principal</h1>
<h1>Otro Título Principal</h1>  <!-- ❌ Dos H1 -->
<h3>Subtítulo</h3>  <!-- ❌ Saltó el H2 -->
```

---

## 🖼️ Atributos ALT en Imágenes

### Reglas para ALT Text:
1. **Descriptivo y específico**
2. **50-125 caracteres** (óptimo)
3. **Incluir palabras clave naturalmente**
4. **No iniciar con "imagen de..."**

### Ejemplos:

```html
<!-- CORRECTO ✅ -->
<img src="/assets/hero.jpg" 
     alt="Niños sonrientes en taller educativo de FWSA en La Guajira">

<img src="/team/presidente.jpg" 
     alt="Juan Pérez, Presidente de Fundación Wopu Süpula Atüja">

<img src="/programs/environment.jpg"
     alt="Comunidad participando en programa de educación ambiental">

<!-- INCORRECTO ❌ -->
<img src="/foto.jpg" alt="Imagen">  <!-- ❌ Dema siado genérico -->
<img src="/equipo.jpg" alt="">  <!-- ❌ ALT vacío  -->
<img src="/programa.jpg">  <!-- ❌ Sin ALT -->
```

---

## 📊 Checklist de SEO por Página

- [ ] Servicio SEO inyectado y configurado
- [ ] Meta title único y descriptivo
- [ ] Meta description entre 150-160 caracteres
- [ ] Keywords relevantes
- [ ] Open Graph configurado
- [ ] URL canónica correcta
- [ ] Solo un H1 por página
- [ ] Jerarquía de headings correcta (H1 → H2 → H3)
- [ ] Todas las imágenes tienen ALT descriptivo
- [ ] Enlaces internos relevantes
- [ ] Contenido original y de calidad

---

## 🎯 Palabras Clave Principales para FWSA

1. **Primarias**:
   - Fundación La Guajira
   - Desarrollo social Colombia
   - FWSA
   - Wopu Süpula Atüja

2. **Secundarias**:
   - Educación comunidades vulnerables
   - Emprendimiento social La Guajira
   - Salud mental comunitaria
   - Sostenibilidad ambiental
   - ONG Colombia

3. **Long-tail (cola larga)**:
   - Fundación sin ánimo de lucro La Guajira
   - Programas educativos comunidades vulnerables Colombia
   - Apoyo psicosocial La Guajira
   - Desarrollo económico La Guajira

---

## 🔗 Enlaces Internos Estratégicos

Asegúrate de enlazar páginas relacionadas:

- Inicio → Programas, Quiénes Somos, Donar
- Quiénes Somos → Equipo, Programas, Impacto
- Programas → Impacto, Contacto, Donar
- Equipo → Quiénes Somos, Contacto
- Impacto → Programas, Donar
- Contacto → Todas las páginas

---

## 📱 Imágenes Open Graph Recomendadas

Crea estas imágenes para compartir en redes sociales:

- **Tamaño**: 1200x630 px
- **Formato**: PNG o JPG
- **Peso**: < 1MB
- **Contenido**: Logo + Mensaje clave

**Imágenes necesarias**:
- `/assets/images/og-image.png` (general)
- `/assets/images/home-og.png`
- `/assets/images/quienes-somos-og.png`
- `/assets/images/equipo-og.png`
- `/assets/images/programas-og.png`
- `/assets/images/impacto-og.png`
- `/assets/images/contacto-og.png`

---

## 🚀 Próximos Pasos

1. **Implementar SEO en cada componente** siguiendo los ejemplos anteriores
2. **Revisar jerarquía de headings** en todos los HTML
3. **Agregar ALT a todas las imágenes**
4. **Crear imágenes Open Graph** para cada página
5. **Configurar Google Search Console** (cuando tengas dominio definitivo)
6. **Configurar Google Analytics**
7. **Generar sitemap.xml**
8. **Crear archivo robots.txt**

---

## 📞 Información de Contacto a Actualizar

Recuerda actualizar estos datos en `seo.service.ts`:

- **Website URL**: `https://www.fwsa.org.co`
- **Email**: `contactofwsa@gmail.com`
- **Teléfono**: `+57 311 495 2911`
- **Redes Sociales**: URLs reales de Facebook, Instagram, LinkedIn

---

**¿Necesitas ayuda?** Este documento te guiará paso a paso para implementar SEO profesional en toda la aplicación.
