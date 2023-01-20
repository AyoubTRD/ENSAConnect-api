import dotenv from 'dotenv';
dotenv.config();

import './util/mailing';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { buildSchema } from 'type-graphql';

import { UserResolver } from './resolvers/user.resolver';
import { PostResolver } from './resolvers/post.resolver';

import { initDb } from './util/database';
import { restRouter } from './rest';
import { MediaFileResolver } from './resolvers/mediafile.resolver';
import { ChatResolver } from './resolvers/chat.resolver';
import { MessageResolver } from './resolvers/message.resolver';

async function main() {
  initDb();
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      PostResolver,
      MediaFileResolver,
      ChatResolver,
      MessageResolver,
    ],
    emitSchemaFile: true,
  });

  const app = express();

  app.use(cors());

  app.use('/rest', restRouter);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        req,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT;
  if (!port) {
    console.error('No port was set in the environment variables!');
    return;
  }
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

main();
