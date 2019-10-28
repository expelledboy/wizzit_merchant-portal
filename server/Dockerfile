# base image for dev and prod release
FROM alpine:3.9 AS base
WORKDIR /opt/app
RUN apk add --no-cache nodejs npm yarn
COPY .deps ./
RUN [ ! -s .deps ] || apk --no-cache add $(cat .deps)

# build dependancies
FROM base AS build
RUN apk add --no-cache build-base bash python
COPY .build-deps ./
RUN [ ! -s .build-deps ] || apk --no-cache add $(cat .build-deps)
COPY yarn.lock ./
COPY package.json ./
RUN npm set progress=false && npm config set depth 0
RUN yarn install --production
RUN mv node_modules node_modules.prod
COPY . .
RUN yarn install
RUN yarn build

FROM base AS dev
RUN apk add --no-cache build-base bash python
COPY .build-deps ./
RUN [ ! -s .build-deps ] || apk --no-cache add $(cat .build-deps)
CMD npm rebuild --update-binary && yarn start

FROM base AS release
COPY --from=build /opt/app/dist ./
COPY --from=build /opt/app/node_modules.prod ./node_modules
CMD yarn start
