# Merchant Portal

## Getting Started

### Install

`yarn` installs the dependencies for each workspace
`docker-compose up -d` creates a postgres instance
`yarn setup` sets up the db

### Run

`yarn start` starts both server and client in dev mode

### Dev Proxy

In dev the backend is proxied from localhost:3001 to localhost:3000 (see setupProxy.js for the config)
