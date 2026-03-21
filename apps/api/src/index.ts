import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from './middleware/auth.js';
import { load as loadAgents } from './agents/registry.js';

const app = express();
const PORT = process.env.API_PORT ?? 3001;

app.use(cors({ origin: process.env.WEB_URL ?? 'http://localhost:5173' }));
app.use(express.json());
app.use(clerkMiddleware());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Mount route handlers (M3)
// app.use('/api/pipelines', requireUser, syncUser, pipelineRoutes);
// app.use('/api/agents', requireUser, agentRoutes);
// app.use('/api/usage', requireUser, usageRoutes);
// app.use('/api/billing', billingRoutes);

async function start() {
  loadAgents();
  app.listen(PORT, () => {
    console.log(`[API] Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('[API] Failed to start:', err);
  process.exit(1);
});
