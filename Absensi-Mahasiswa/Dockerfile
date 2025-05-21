# Gunakan image Node.js versi 22.13.1 sebagai base image untuk build aplikasi
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Jalankan Nginx di kontainer
CMD ["nginx", "-g", "daemon off;"]
