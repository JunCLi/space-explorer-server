# Space Explorer - Server

## Table of Contents
1. [The Server](#the-server)
2. [Installation](#installation)
3. [Technologies used](#technologies-used)
4. [Purpose and other Features](#purpose-and-other-features)

## The Server
This is the server in which the space-explorer client will run with. It is built primarily on Node, GraphQL and Apollo-server.

Launch details and list of launches are obtained from the publically availabvle [spaceX Api.](https://github.com/r-spacex/SpaceX-API) It will let you "book" and "cancel" fake trips by changing the status on an internal postgres database. Of course, everything is fake and just a demonstration piece for the portfolio project.

## Installation

Instantiate the postgres database with `yarn db:resetandseed` and then start the server with `NODE_ENV=development yarn start:dev`.

If you want the front-end react-native client to run the server with, you can get it [here.](https://github.com/JunCLi/space-explorer-client)

### Main Technologies
1. [React Native](https://facebook.github.io/react-native/) version 0.60.5
2. [GraphQL](https://graphql.org/)
3. [ApolloServer](https://www.apollographql.com/)
4. [Postgres](https://www.postgresql.org/)
5. [node-cron](https://www.npmjs.com/package/node-cron)

