# Build stage
FROM node:21 as build-stage
WORKDIR /app
COPY package*.json ./
## If you want to significantly speed up the build, use yarn instead of npm:
# RUN yarn install
RUN npm install
COPY . .
# RUN yarn build
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
