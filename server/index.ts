import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import http from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware - BEFORE proxy
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (!path.startsWith("/@") && !path.includes("node_modules")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// API Proxy Middleware - MUST come after logging but before other routes
app.use('/api', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: req.originalUrl, // Use originalUrl to include /api prefix
    method: req.method,
    headers: {
      ...req.headers,
      host: 'localhost:4000'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Set response status and headers
    res.status(proxyRes.statusCode || 500);
    
    // Copy headers from backend response
    Object.keys(proxyRes.headers).forEach(key => {
      const value = proxyRes.headers[key];
      if (value !== undefined) {
        res.setHeader(key, value);
      }
    });
    
    // Pipe response back to client
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Backend API unavailable', error: error.message });
    }
  });

  // Handle request body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
});

(async () => {
  const server = createServer(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Setup Vite in development or serve static files in production
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve on specified port (default 5000)
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Frontend server running on http://localhost:${port}`);
    log(`📡 Connecting to backend API at http://localhost:4000/api`);
  });
})();
