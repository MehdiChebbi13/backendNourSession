import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma';

const chatRoute: FastifyPluginAsync = async (app) => {
  app.get('/chat', { websocket: true }, (conn, req) => {
    const { sid, restaurant, table } = req as any;

    conn.on('message', async (messageBuffer) => {
      const userText = messageBuffer.toString();
      // a) persist USER turn
    await prisma.message.create({
      data: {
        role: 'user',
        text: userText,
        session: {
          connectOrCreate: {
            where: { sid },
            create: { sid, restaurant, table },
          },
        },
      },
    });

      
        const queryParams = new URLSearchParams({
          session_id: sid,
          restaurant_id: restaurant,
        });

        const response = await fetch(`http://localhost:8000/chat?${queryParams.toString()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userText }),
        });

        if (!response.body) {
          conn.send('[error] No response body from agent');
          return;
        }
        
        // Stream the response chunks back to client
        const chunks: Buffer[] = [];
        for await (const chunk of response.body as any) chunks.push(chunk); 
                           // keep for final DB insert

        const full = Buffer.concat(chunks).toString('utf8');
        conn.send(JSON.stringify({ response: full })); // send to client
        
        const fullRaw = Buffer.concat(chunks).toString('utf8');  // ③ full reply text
        let agentText = fullRaw;

        try {
          const parsed = JSON.parse(fullRaw);
          if (typeof parsed === 'object' && parsed.response) {
            agentText = parsed.response;          // pick the field you need
          }
        } catch (_) {
          /* not JSON, keep raw text */
        }
        // c) persist AGENT turn once completed
        await prisma.message.create({
          data: {
            role: 'agent',
            text: full,
            sid,
          },
        });
    });
  });
};

export default chatRoute;
