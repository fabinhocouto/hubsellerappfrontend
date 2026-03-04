# Etapa 1: Construir a aplicação Angular
FROM node:22.12.0 AS build

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

ENV NODE_ENV=production
ENV npm_config_cache=/tmp/npm-cache

# Instalar as dependências
RUN rm -rf node_modules package-lock.json
RUN npm install --verbose -g @angular/cli && npm install
RUN npm install @angular-devkit/build-angular --force

# Copiar o código-fonte do projeto
COPY . .

# Construir a aplicação Angular
RUN npm run build --configuration=production

# Etapa 2: Servir a aplicação Angular com um servidor HTTP estático
FROM nginx:alpine

# Copiar os arquivos gerados no build do Angular para o Nginx
COPY --from=build /app/dist/hubseller-app-frontend /usr/share/nginx/html

# Expor a porta 80 para acessar o aplicativo
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
