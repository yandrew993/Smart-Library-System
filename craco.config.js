const cracoConfig = {
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
  
        // Add custom middleware here if needed
        // Example:
        // devServer.app.get('/api/test', (req, res) => res.json({ status: 'ok' }));
  
        return middlewares;
      },
    },
  };
  
  export default cracoConfig;