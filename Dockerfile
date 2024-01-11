FROM node:20.10.0-alpine AS build

ARG NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx ngcc -properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .

RUN if [ "$NODE_ENV" = "production" ] ; then npm run build; else npm run build-dev; fi

FROM nginx:stable
COPY --from=build /app/dist/tic-tac-toe-front/browser /usr/share/nginx/html
EXPOSE 80

