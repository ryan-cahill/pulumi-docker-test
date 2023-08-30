FROM docker:dind

WORKDIR /app

RUN apk update && apk add nodejs npm 

COPY . .

RUN npm ci
RUN npm run grpc:generate
