import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma';

const messageRoute: FastifyPluginAsync = async (app) => {
    app.post('/messages', async (req, res) => {
        const { sid, restaurant, table } = req as any;
      
        if (!sid) {
          console.error('[POST /messages] Missing sid');
          return res.status(401).send({ error: 'Session cookie missing or expired' });
        }
      
        const { role, text } = req.body as { role?: string; text?: string };
        if (!role || !text) {
          return res.status(400).send({ error: 'Missing role or text' });
        }
      
        const message = await prisma.message.create({
            data: {
              role,
              text,
              session: {
                connectOrCreate: {
                  where: { sid },
                  create: {
                    sid,
                    restaurant,
                    table,
                  },
                },
              },
            },
          });
      
        return res.status(201).send({ id: message.id });
      });
      app.get('/messages', async (req, res) => {
        const { sid } = req as any;
      
        if (!sid) {
          return res.status(401).send({ error: 'Session missing' });
        }
      
        const messages = await prisma.message.findMany({
          where: { sid },
          orderBy: { createdAt: 'asc' },
        });
      
        return res.send({ messages });
      }); 
};

export default messageRoute;
