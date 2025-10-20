import { createServer } from './server/index.ts';

const port = 3000;

createServer().then(app => {
  app.listen(port, () => {
    console.log(`🚀 EcoTrack Backend server running on port ${port}`);
    console.log(`🔧 API: http://localhost:${port}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
