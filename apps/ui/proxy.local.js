module.exports = [
  {
    context: '/api',
    target: 'http://localhost:3000',
    secure: false,
    logLevel: 'info',
    changeOrigin: true,
  },
];
