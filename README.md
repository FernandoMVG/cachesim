<div align="center">
  <h1>
    CacheSim - Simulador de caché
  </h1>

<h4>
    Realiza las diferentes tecnicas de mapeo de caché
  </h4>

[![GitHub jfbenitezz](https://img.shields.io/badge/by-fjbenitezz-purple)](https://github.com/fjbenitezz)
[![GitHub FernandoMVG](https://img.shields.io/badge/by-FernandoMVG-blue)](https://github.com/FernandoMVG)
[![GitHub sets018](https://img.shields.io/badge/by-sets018-green)](https://github.com/sets018)

</div>

# Simulador de Mapeo de Caché

## Listado de Estudiantes

- Felipe Jose Benitez Avilez
- Fernando Mateo Valencia Gómez
- Set Salas Redondo

## Resumen y Justificación de la Herramienta

Este proyecto es un simulador de mapeo de caché que abarca los tres tipos principales de mapeo: mapeo directo, completamente asociativo y set asociativo. La herramienta ha sido desarrollada para ofrecer una comprensión práctica de cómo funcionan las diferentes técnicas de mapeo de caché en arquitecturas de sistemas computacionales.

### Resumen

El simulador permite a los usuarios visualizar y experimentar cómo se gestionan y almacenan los datos en la memoria caché de un sistema. Al utilizar esta herramienta, los usuarios pueden:

- Simular mapeo directo: Asignar cada bloque de memoria principal a una única línea de caché específica.
- Simular mapeo completamente asociativo: Permitir que cualquier bloque de memoria principal pueda ser almacenado en cualquier línea de caché.
- Simular mapeo set asociativo: Dividir la caché en un conjunto de vías donde cada bloque de memoria principal puede ser almacenado en cualquier línea dentro de un conjunto específico.

### Justificación

La caché es un componente crítico en el rendimiento de los sistemas modernos. Comprender su funcionamiento y las diferencias entre los distintos tipos de mapeo es importante para los estudiantes y profesionales en ciencias de la computación. Este simulador proporciona una plataforma interactiva para explorar y aprender los principios y operaciones detrás de cada tipo de mapeo de caché.

Algunas de las razones que justifican el desarrollo de esta herramienta incluyen:

- **Educación:** Facilitar la enseñanza y el aprendizaje de conceptos complejos de organización y arquitectura de computadores.
- **Visualización:** Proporcionar una visualización clara y dinámica del funcionamiento de la caché.
- **Experimentación:** Permitir la experimentación con diferentes configuraciones y parámetros para entender mejor el impacto de las decisiones de diseño en el rendimiento del sistema.

## Funcionalidades Sugeridas para Futuras Mejoras

### Comparación de Configuraciones en una Sola Página

Implementar una pestaña que permita comparar distintas configuraciones de mapeo de caché en una sola página. Por ejemplo, los usuarios podrían ver cómo se diferencian el mapeo directo y el mapeo por set asociativo cuando se utiliza la misma secuencia de accesos a memoria. Esta funcionalidad permitiría una comparación visual directa y detallada, facilitando la comprensión de las ventajas y desventajas de cada configuración.

### Generación de Estadísticas y Gráficas

Añadir una funcionalidad que permita generar estadísticas detalladas y gráficas sobre el rendimiento de cada configuración. Esto incluiría métricas como tasa de fallos de caché (cache miss rate), latencia de acceso, y eficiencia de utilización de la caché. Los usuarios podrían visualizar gráficos interactivos que les permitan analizar el comportamiento de la caché bajo diferentes cargas de trabajo, facilitando la interpretación de los datos y comprensión del sistema.

## Instalación y Ejecución

### Clonar el repositorio
```
git clone https://github.com/FernandoMVG/cachesim.git
```
```
cd cachesim
```

### Ejecución con Docker
Asegúrate de tener Docker instalado y ejecutando en tu sistema.

- Este comando es para construir la imagen con Docker Compose e iniciar el `http://localhost:3000`
```
docker-compose up --build
```

- Si la imagen ya esta construida solo ejecuta:
```
docker-compose up
```
- Si deseas ejecutar los contenedores en segundo plano:
```
docker-compose up -d
```

Accede a la aplicación a través de `http://localhost:3000` en tu navegador.

### Ejecución sin Docker
Ve a la carpeta `app` y ejecuta:

```
npm install
```
```
npm start
```
Accede a la aplicación a través de `http://localhost:3000` en tu navegador.
