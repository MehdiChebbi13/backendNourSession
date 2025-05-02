import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import ws from '@fastify/websocket';

export const build = () => {
  const app = Fastify({ logger: true });
  app.register(cookie, { secret: 'cookie-secret' });
  app.register(ws);

  app.get('/health', async () => ({ ok: true }));
  return app;
};

if (require.main === module) {
  build()
    .listen({ port: 3000, host: '0.0.0.0' })
    .catch(console.error);
}
