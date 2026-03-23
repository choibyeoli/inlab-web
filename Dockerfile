## Build + static serve (Vite SPA) for Synology Docker
## - builder: node builds `dist`
## - runner: nginx serves `dist` on port 8210

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

## Build-time env (optional). If not provided, map SDK will be skipped.
ARG VITE_KAKAO_MAPS_APPKEY=""
ENV VITE_KAKAO_MAPS_APPKEY="${VITE_KAKAO_MAPS_APPKEY}"

RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8210

