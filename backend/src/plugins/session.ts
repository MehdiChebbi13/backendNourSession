import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

export default fp(async (app) => {
  console.log('[session] plug-in loaded');     
  const redis = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');

  app.addHook('preHandler', async (req, reply) => {
    const { r, t } = req.query as { r?: string; t?: string };
    let sid = req.cookies.sid;

    if (!sid || !(await redis.exists(sid))) {
      if (!r || !t) {
        reply.status(400).send({ error: 'Missing restaurant or table ID' });
        return;
      }

      sid = `sess_${randomUUID()}`;
      await redis.setex(sid, 60 * 120, JSON.stringify({ restaurant: r, table: t }));
      console.log('[session] creating sid', sid);


      reply.setCookie('sid', sid, {
        path: '/',
        maxAge: 60 * 120,
        httpOnly: true,
        sameSite: 'lax',
        secure: false // set true when using HTTPS
      });
    }

    const cached = await redis.get(sid);
    if (!cached) {
      reply.status(401).send({ error: 'Session expired or not found' });
      return;
    }

    const sessionData = JSON.parse(cached);
    (req as any).sid = sid;
    (req as any).restaurant = sessionData.restaurant;
    (req as any).table = sessionData.table;
  });
});
