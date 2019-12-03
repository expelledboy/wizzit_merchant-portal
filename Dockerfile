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
COPY server/package.json ./
RUN yarn install --production
RUN cp -R node_modules node_modules.prod
RUN yarn install
COPY . .

FROM base AS release
COPY --from=build /opt/app/server ./
COPY --from=build /opt/app/node_modules.prod ./node_modules
ENV PATH /opt/app/node_modules/.bin:$PATH
CMD yarn start
