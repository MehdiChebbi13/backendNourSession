import 'dotenv/config';   
import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import messageRoute from './routes/message';
import sessionPlugin from './plugins/session';
import chatRoute from './routes/chat';

export const build = () => {
  const app = Fastify({ logger: true });

  // plugins that we’ll wire up later
  app.register(cookie, { secret: 'cookie-secret' });
  app.register(websocket);
  app.register(sessionPlugin);
  app.register(messageRoute);
  app.register(chatRoute);
  // quick health check
  app.get('/health', async () => ({ ok: true }));
  

  return app;
};

if (require.main === module) {
  const app = build();
  app
    .listen({ port: 3000, host: '0.0.0.0' })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
}
