import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: process.env.WEB_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Mount route handlers
// app.use('/api/auth', authRoutes);
// app.use('/api/pipelines', pipelineRoutes);
// app.use('/api/agents', agentRoutes);
// app.use('/api/usage', usageRoutes);
// app.use('/api/billing', billingRoutes);

app.listen(PORT, () => {
  console.log(`[API] Server running on port ${PORT}`);
});
