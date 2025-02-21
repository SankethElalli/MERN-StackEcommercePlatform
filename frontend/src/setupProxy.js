const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const proxyConfig = {
    target: 'http://localhost:5001',
    changeOrigin: true
  };

  app.use('/api', createProxyMiddleware(proxyConfig));
  app.use('/uploads', createProxyMiddleware(proxyConfig));
  app.use('/videos', createProxyMiddleware(proxyConfig));
};
