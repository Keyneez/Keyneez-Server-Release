FROM node:18-alpine AS base

# intsall dependencies development
FROM base AS deps
WORKDIR /usr/src/app

COPY prisma ./prisma/
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
RUN yarn run generate

#build
FROM base AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

RUN yarn run build

RUN yarn install --froze-lockfile --production;
RUN yarn run generate

# deploy
FROM base AS deploy

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./

ENTRYPOINT [ "node","dist/src/main.js" ]

EXPOSE 4000
