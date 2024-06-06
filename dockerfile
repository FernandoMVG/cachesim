# Usa una imagen base oficial de Node.js (aquí usamos Node.js 16 como ejemplo)
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación estará corriendo
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]
