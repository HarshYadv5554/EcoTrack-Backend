import express from 'express';
import cors from 'cors';
import { createServer } from './server/index.ts';

const app = express();
const port = 5174;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Create the API server
createServer().then(apiServer => {
  // Mount API routes
  app.use('/api', apiServer);
  
  // Serve static files from the client build
  app.use(express.static('dist/spa'));
  
  // Handle React Router - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile('dist/spa/index.html', { root: '.' });
  });
  
  app.listen(port, () => {
    console.log(`🚀 EcoTrack Development server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
