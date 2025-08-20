const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: path.join(__dirname, '/') });

// Middleware pour générer des IDs incrémentaux
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/smartphones') {
    const db = router.db.get('smartphones').value();
    const maxId = db.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
    req.body.id = maxId + 1;
  }
  next();
});

// Appliquer middlewares et API JSON
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server + Frontend is running on port ${PORT}`);
});
