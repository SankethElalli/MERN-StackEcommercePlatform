const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const proxyConfig = {
    target: 'http://backend:5001',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req) => {
      // Log proxy requests
      console.log(`Proxying ${req.method} ${req.url} to ${proxyConfig.target}`);
      if (req.body) {
        console.log('Request body:', req.body);
      }
    },
    onProxyRes: (proxyRes, req) => {
      // Log proxy responses
      console.log(`Received response for ${req.method} ${req.url}: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Proxy error: ' + err.message);
    }
  };

  // API endpoints proxy
  app.use('/api', createProxyMiddleware({
    ...proxyConfig,
    timeout: 300000, // 5 minutes timeout for video uploads
    maxContentLength: 100 * 1024 * 1024, // 100MB max file size
  }));

  // Static file proxies
  app.use('/uploads', createProxyMiddleware(proxyConfig));
  app.use('/videos', createProxyMiddleware(proxyConfig));
};
