/* import { FastifyPluginAsync } from 'fastify';
import fetch from 'node-fetch';  // if not already installed, run: pnpm add node-fetch

const chatRoute: FastifyPluginAsync = async (app) => {
  app.get('/chat', { websocket: true }, (conn, req) => {
    const { sid, restaurant, table } = req as any;

    conn.socket.on('message', async (messageBuffer) => {
      const text = messageBuffer.toString();
      console.log(`[WS] Received from ${sid}:`, text);

      try {
        // Forward to Python RAG agent
        const response = await fetch(`${process.env.AGENT_URL ?? 'http://localhost:8000/agent'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sid, text, restaurant, table }),
        });

        if (!response.body) {
          conn.socket.send('[error] No response body from agent');
          return;
        }

        // Stream response chunks back to client
        for await (const chunk of response.body as any) {
          conn.socket.send(chunk);
        }
      } catch (err) {
        console.error('[WS] Error:', err);
        conn.socket.send('[error] Failed to reach AI agent');
      }
    });
  });
};

export default chatRoute;
 */