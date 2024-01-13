FROM node:20.10.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx ngcc -properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .

ARG configuration=production
RUN if [ "$configuration" = "production" ] ; then \
    npm run build ; \
elif [ "$configuration" = "development" ] ; then \
    npm run build-dev ; \
else \
    echo "Nieznana konfiguracja: $configuration. Użyj 'production' lub 'development'."; \
    exit 1 ; \
fi

FROM nginx:stable
COPY --from=build /app/dist/tic-tac-toe-front/browser /usr/share/nginx/html
EXPOSE 80

