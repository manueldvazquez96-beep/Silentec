# Handoff: SILENTEC App Mayorista (Frontend)

## Overview
App mobile-first B2B para el **Portal Mayorista de SILENTEC** (marca de repuestos de suspensión y chasis de COARDEL). Permite a clientes mayoristas: iniciar sesión, ver cuenta corriente, navegar el catálogo, buscar por OE/ST, consultar un asistente IA técnico, ver reportes de compras, armar pedidos y gestionar su cuenta.

## About the Design Files
Los archivos en este paquete son **referencias de diseño creadas en HTML** — prototipos que muestran el look & feel y el comportamiento esperado. **No son código de producción para copiar y pegar.**

La tarea es **recrear estos diseños en el stack real del proyecto** (React Native, Flutter, Swift, Kotlin, o la PWA que elijan) usando los patrones, librerías y design system del codebase existente. Si aún no hay un stack definido, recomendamos **React Native + Expo** para iOS/Android, o **Next.js PWA** si la distribución es web.

## Fidelity
**Alta fidelidad (hifi)** — Los mockups tienen:
- Colores exactos de la paleta oficial SILENTEC (ver Design Tokens)
- Tipografía final (Gotham + Proxima Nova, del manual de marca)
- Spacing, border-radius y jerarquía definitivos
- Estados de interacción (hover, active, focus)
- Copy en español (es-AR) listo para producción

El desarrollador debe reproducir la UI pixel-perfect con las librerías del codebase.

## Screens

### 1. Login (`ScreenLogin`)
- **Propósito**: autenticación del cliente mayorista
- **Layout**: vertical, padding `64px 26px 32px`, radial gradient sutil azul arriba-derecha
- **Elementos**:
  - Badge "PORTAL MAYORISTA" (border azul 1px, 10px mono font, letter-spacing 1.5px)
  - Logo SILENTEC azul (ancho 240px) — `assets/silentec-logo-azul.png`
  - Slogan "Soporte en tu camino." (15px, weight 600)
  - Subtítulo mono "Diseñado para durar" (10px, uppercase, letter-spacing 2px)
  - Input email/usuario (altura 52px, border radius 12px, border 1px)
  - Input contraseña (mismo estilo, con ícono de ojo)
  - Link "¿Olvidaste tu contraseña?" (color accent, 13px)
  - Botón primario "Ingresar" (52px alto, bg #1834FF, color blanco, uppercase, weight 700)
  - Link "Solicitá acceso" (color accent)
  - Footer: "Respaldado por COARDEL · 55 años · AR" (mono, 10px, textDim)

### 2. Home / Inicio (`ScreenHome`)
- **Propósito**: dashboard del cliente
- **Layout**: scroll vertical, bottom padding 110px (para tab bar)
- **Secciones**:
  - Header greeting: logo chico (130px) + badge "B2B · MAYORISTA" + saludo + nombre de cliente ("REPUESTOS DEL CENTRO")
  - Tarjeta Cuenta Corriente: saldo disponible grande (36px, weight 800), límite, próximo vencimiento
  - Grid de accesos rápidos (4 íconos): Catálogo · Pedidos · Asistente · Cuenta
  - Carrusel "Destacados" (productos con código ST, precio, % off)
  - Banner de novedades / promociones

### 3. Catálogo (`ScreenCatalog`)
- **Propósito**: navegación del catálogo
- **Elementos**:
  - Top bar con "Catálogo" + ícono filtro
  - Input de búsqueda full-width con ícono lupa + botón "Escanear OE" (cámara)
  - Tabs de categorías (Amortiguadores, Rótulas, Bieletas, Axiales, Extremos)
  - Filtros chips: Marca vehículo, Modelo, Año
  - Lista de productos: imagen 56px + código ST + nombre + precio + stock
- **Interacción**: tap en producto → ScreenDetail

### 4. Detalle de producto (`ScreenDetail`)
- **Propósito**: ficha técnica de un repuesto
- **Elementos**:
  - Botón back + ícono share
  - Imagen producto full-bleed 280px
  - Código ST grande (mono, 20px, color accent)
  - Nombre + marca + modelo compatible
  - Precio + descuento mayorista aplicado
  - Specs técnicas (medidas, material, peso, garantía)
  - Tab "Compatibilidad" con lista de vehículos
  - Footer fijo: qty selector (-/+) + botón "Agregar · $XX" (altura 52px)

### 5. Asistente IA / Chat (`ScreenChat`)
- **Propósito**: consultas técnicas (compatibilidad, alternativas)
- **Elementos**:
  - Top bar: ícono asistente (42px, radius 11px, bg accent) + "Asistente SILENTEC" + status "● En línea · Catálogo 2026"
  - Scroll de mensajes: burbujas 78% max-width, user a la derecha (bg accent, #fff) / assistant a la izquierda (bg surface, border)
  - Códigos ST en respuestas se renderean bold con mono font y color accent
  - Chips de sugerencias: "↳ Ver juego completo Ranger", "↳ Alternativa económica", etc.
  - Input fijo abajo: textarea + botón enviar (ícono paper-plane)

### 6. Reportes (`ScreenReports`)
- **Propósito**: historial de compras y métricas
- **Elementos**:
  - Top bar "Reportes" + subtítulo "MIS COMPRAS Y PEDIDOS"
  - Chips de rango: 30 días / 90 días / Año / Todo
  - Card hero: total comprado ($ 1.254.350, 36px weight 800), delta vs. trimestre anterior en verde, contador de unidades/pedidos, **bar chart mini** (12 barras, últimas 2 en color accent, grid 4 columnas con labels ENE/FEB/MAR/ABR centrados)
  - Sección "MÁS COMPRADAS": ranking con número 01-05, nombre, código ST, cantidad, total
  - Sección "HISTORIAL DE PEDIDOS": cards con ID, fecha, estado (badge), total, ítems

### 7. Pedido / Carrito (`ScreenCart`)
- **Propósito**: confirmar pedido
- **Elementos**:
  - Top bar "Pedido" + badge "X ÍTEMS"
  - Card "ENTREGA EN": dirección del depósito del cliente
  - Lista de items: código ST + nombre + qty selector + subtotal
  - Resumen: subtotal, descuento mayorista (-5%, en verde), IVA 21%
  - Total grande (26px, weight 800)
  - Botón "Confirmar pedido · $XXX" (54px, bg accent)
  - Nota: "Se descontará de cuenta corriente"

### 8. Perfil / Cuenta (`ScreenProfile`)
- **Propósito**: datos del cliente y configuración
- **Elementos**:
  - Header con avatar + nombre empresa + CUIT + número de cuenta
  - Grid de stats: Comprado YTD, Pedidos, Plazo, Descuento
  - Grupos de opciones (Mis datos, Domicilios, Notificaciones, Soporte, Legales)
  - Botón "Cerrar sesión"
  - Footer version: "SILENTEC v1.0.0 · RESPALDADO POR COARDEL"

## Tab Bar (`STTabBar`)
Persistente en Home, Catálogo, Asistente, Reportes, Carrito.
- 5 ítems con íconos + label
- Ítem activo: color accent, dot indicador arriba
- Bottom safe-area inset

## Interactions & Behavior

- **Navegación**: stack navigation con back button. Login es root; después del login se va al tab navigator.
- **Persistencia**: current screen en localStorage/AsyncStorage para resumir sesión
- **Animaciones**:
  - Push/pop horizontal (iOS default, 300ms ease-out)
  - Tab change: fade 150ms
  - Splash screen de SILENTEC: 600ms, fade-out 400ms
- **Formularios**: validación en submit; errores inline en rojo `#C62828` debajo del input
- **Loading states**: skeleton screens (no spinners) en cards
- **Empty states**: ilustración del símbolo SILENTEC al 30% opacidad + CTA

## State Management
- `currentUser` (cliente mayorista autenticado)
- `cart` (items del carrito, persistido)
- `catalog` (productos, cacheado)
- `orders` (historial, fetch on-demand)
- `theme` (corporate / industrial / engineering — por ahora corporate)

## Design Tokens

### Colores oficiales (Brand Guidelines SILENTEC 2025)
```
PRIMARIO
  Azul:     #1834FF  (Pantone 285C · CMYK 100/52/0/0)
  Negro:    #000000  (Pantone Process Black C)
  Blanco:   #FFFFFF

TEMA CORPORATIVO (default, light)
  bg:            #F5F6F9
  surface:       #FFFFFF
  surface2:      #FAFBFD
  surface3:      #EBEEF4
  border:        rgba(0,0,0,0.08)
  borderStrong:  rgba(0,0,0,0.14)
  text:          #000000
  textMuted:     #5A6075
  textDim:       #8A90A5
  accent:        #1834FF
  accentDim:     #1229D6
  accentSoft:    rgba(24,52,255,0.08)
  success:       #1E8F52
  warn:          #B07A10
  danger:        #C62828
  chip:          #EEF0F6

SHADOW
  0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.04)
```

### Tipografía (Brand Guidelines)
```
PRIMARIA: Gotham
  Black   → títulos
  Bold    → subtítulos
  Book    → slogan
  Light   → textos de lectura

SECUNDARIA: Proxima Nova
  Regular → bajadas y textos cortos

FALLBACK WEB: Montserrat (geometría similar a Gotham)
MONO (códigos ST/OE): JetBrains Mono
```

### Spacing scale
4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 26 / 28 / 32 / 40 / 54 / 64

### Border radius
6 / 8 / 11 / 12 / 14 / 16 / 24

### Typography scale (px)
9 (mono label) · 10 (mono caption) · 11 · 12 · 13 · 14 · 15 (body) · 17 · 20 · 26 · 36 (hero) · 40

## Assets
Todos en `assets/`:
- `silentec-logo-azul.png` · logo horizontal azul
- `silentec-logo-blanco.png` · logo horizontal blanco (para fondos oscuros/azul)
- `silentec-simbolo-azul.png` · símbolo (isotipo) azul
- `silentec-simbolo-blanco.png` · símbolo blanco
- `silentec-logo-horizontal.svg` · vector del manual
- `silentec-logo-slogan.svg` · logo + slogan "Soporte en tu camino"
- `app-icon-180.png` · ícono app iOS 180×180
- `app-icon-192.png` · ícono PWA 192×192
- `app-icon-512.png` · ícono PWA 512×512
- `app-icon-1024.png` · App Store / maskable
- `splash-iphone.png` · splash 1170×2532 (iPhone 14/15)
- `splash-iphone-pro-max.png` · splash 1290×2796 (Pro Max)
- `brand-guidelines.pdf` · manual de marca completo

## Files incluidos en este handoff

### Prototipo HTML (referencia)
- `SILENTEC App.html` — vista de grilla con las 8 pantallas (para review de diseño)
- `app.html` — versión PWA pantalla-completa (runtime móvil)
- `manifest.webmanifest` — PWA manifest
- `components/ios-frame.jsx` — frame iOS 26 (solo para mockup, no para prod)
- `components/tokens.jsx` — tokens de color y tipografía
- `components/icons.jsx` — set de íconos stroke
- `components/logo.jsx` — wrapper del logo
- `components/data.jsx` — data mock (productos, pedidos, chat)
- `components/screens-1.jsx` — Login, Home, Catálogo, Detalle
- `components/screens-2.jsx` — Chat, Reportes, Carrito, Perfil

### Recomendaciones de implementación
- **Stack sugerido**: React Native + Expo (iOS/Android de una) o Next.js 14 + Tailwind si van PWA
- **Librerías UI**: NativeWind o Tamagui (RN) · shadcn/ui (Next)
- **Navigation**: React Navigation (stack + tabs) · Next App Router
- **Fonts**: cargar Gotham desde licencia corporativa (COARDEL); fallback Montserrat de Google Fonts
- **Iconos**: reemplazar los SVG inline con Lucide o Phosphor, manteniendo stroke-width 2
- **Charts**: Victory Native / Recharts para los bar charts de Reportes
- **Forms**: React Hook Form + Zod
- **API**: asumir REST contra backend de COARDEL (endpoints TBD)

## Notas de negocio
- Cliente es siempre **mayorista B2B** — no hay checkout público, todo es cuenta corriente
- Códigos: **ST** es el código interno SILENTEC, **OE** es el código original de fábrica (Ford OEM, etc.)
- El asistente IA debe responder en español rioplatense informal, usando códigos ST/OE en bold mono
- Descuento mayorista base 5%, variable por cliente (se lee del backend)
- Todos los precios en ARS, formato `$ 1.234.567` (punto como separador de miles, sin decimales)

## Validación
Antes de dar por terminada la implementación, verificar:
- [ ] Los 8 screens renderean según los mockups HTML
- [ ] El logo oficial del manual de marca se usa (no recreaciones)
- [ ] Color #1834FF se aplica en accent (no variaciones)
- [ ] Gotham se carga correctamente (o fallback Montserrat weight 900/800/700/600)
- [ ] Tab bar funciona en los 5 screens indicados
- [ ] Bar chart de Reportes tiene labels ENE/FEB/MAR/ABR alineados al grid
- [ ] Safe area insets respetados en iPhone con notch
- [ ] Splash screen muestra logo SILENTEC sobre fondo #1834FF

---

**Contacto diseño**: archivos HTML de referencia incluidos
**Manual de marca**: `assets/brand-guidelines.pdf` (febrero 2025)
