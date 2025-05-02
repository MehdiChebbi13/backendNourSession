import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma';

const messageRoute: FastifyPluginAsync = async (app) => {
  app.post('/messages', async (req, res) => {
    const { sid, restaurant, table } = req as any;
    const { role, text } = req.body as { role?: string; text?: string };

    if (!role || !text) {
      return res.status(400).send({ error: 'Missing role or text' });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        sid,
        role,
        text,
      },
    });

    return res.status(201).send({ id: message.id });
  });
};

export default messageRoute;
