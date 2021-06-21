FROM node:current-alpine AS Builder

COPY . /app

WORKDIR /app

RUN npm install \
    && npm run build

##################################

FROM node:current-alpine

COPY --from=Builder /app /app

WORKDIR /app

EXPOSE 3000

CMD [ "npm", "start" ]
