import { FastifyPluginAsync } from 'fastify';


const chatRoute: FastifyPluginAsync = async (app) => {
  app.get('/chat', { websocket: true }, (conn, req) => {
    const { sid, restaurant, table } = req as any;

    conn.on('message', async (messageBuffer) => {
      const text = messageBuffer.toString();
      console.log(`[WS] Received from ${sid}:`, text);

      try {
        const queryParams = new URLSearchParams({
          session_id: sid,
          restaurant_id: restaurant,
        });

        const response = await fetch(`http://localhost:8000/chat?${queryParams.toString()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text }),
        });

        if (!response.body) {
          conn.send('[error] No response body from agent');
          return;
        }

        // Stream the response chunks back to client
        for await (const chunk of response.body as any) {
          conn.send(chunk);
        }
      } catch (err) {
        console.error('[WS] Error:', err);
        conn.send('[error] Failed to reach AI agent');
      }
    });
  });
};

export default chatRoute;
