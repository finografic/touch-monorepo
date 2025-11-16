# Sistema de Emparejamiento de Perfiles de Temperatura

📅 Jul 13, 2025

## Descripción General

Este documento explica cómo funciona el sistema de emparejamiento de perfiles de temperatura en la aplicación de servicio de bebidas. Está dirigido tanto a desarrolladores como a partes interesadas no técnicas (como clientes) que puedan necesitar entender o justificar el comportamiento del sistema.

---

## El Problema

- Los usuarios pueden seleccionar cualquier temperatura inicial y final (en incrementos de 0,5°C) para su bebida.
- La base de datos del backend solo contiene un **conjunto limitado de perfiles de temperatura** para cada pedido (por ejemplo, de 4 a 12 por pedido), no todos los valores posibles de temperatura.
- Necesitamos proporcionar al usuario el perfil de temperatura más apropiado, incluso si no hay una coincidencia exacta para su selección.

---

## La Solución: Emparejamiento Más Cercano en el Cliente

### 1. **Obtener Todos los Perfiles para el Pedido**

- Cuando el usuario configura una bebida, el frontend obtiene **todos los perfiles de temperatura disponibles** para el pedido seleccionado desde el backend.
- El backend solo filtra por `orderId` y devuelve todos los perfiles para ese pedido.

### 2. **Algoritmo de Emparejamiento en el Cliente**

- Cuando el usuario selecciona una temperatura, el frontend utiliza un algoritmo simple para encontrar el **perfil disponible más cercano**:
  - Compara la temperatura inicial seleccionada por el usuario con la temperatura de cada perfil disponible.
  - El perfil con la menor diferencia es elegido como la "mejor coincidencia".
- Esto asegura que, incluso si el usuario elige una temperatura que no está presente en la base de datos, el sistema siempre proporciona la mejor opción disponible.

### 3. **Retroalimentación al Usuario**

- La interfaz muestra el perfil disponible más cercano y todas las temperaturas de perfil disponibles para mayor transparencia.
- Si la selección del usuario no coincide exactamente con un perfil, la interfaz muestra claramente qué perfil se está utilizando.

---

## ¿Por Qué Este Enfoque?

- **Flexibilidad:** El frontend puede cambiar fácilmente la lógica de emparejamiento, agregar umbrales o interpolar entre perfiles sin cambios en el backend.
- **Rendimiento:** Solo se necesita una solicitud al backend por pedido, y la lógica es rápida y fácil de almacenar en caché.
- **Experiencia de Usuario:** El usuario siempre obtiene un resultado razonable y la interfaz nunca se "rompe" ni lo deja sin opciones.
- **Mantenibilidad:** El sistema es fácil de depurar, ampliar y explicar a las partes interesadas.

---

## Ejemplo

Supongamos que los perfiles disponibles para un pedido están en 0°C, 10°C, 20°C y 30°C. Si el usuario selecciona 9°C, el sistema lo emparejará con el perfil de 10°C (el más cercano disponible).

---

## Limitaciones

- Si los perfiles disponibles son escasos o están agrupados en un extremo del rango de temperaturas, la "mejor coincidencia" aún puede estar lejos de la selección del usuario. Esto es una consecuencia natural de tener datos limitados.
- El sistema puede ampliarse en el futuro para usar emparejamiento o interpolación más avanzada si es necesario.

---

## Resumen

- El sistema siempre proporciona el mejor perfil de temperatura disponible para la selección del usuario.
- Toda la lógica se maneja en el cliente para máxima flexibilidad y transparencia.
- Este enfoque es robusto, fácil de mantener y amigable para el usuario.
