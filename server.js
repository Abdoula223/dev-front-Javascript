const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware pour générer des identifiants incrémentaux
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/smartphones') {
    const db = router.db.get('smartphones').value();
    const maxId = db.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
    req.body.id = maxId + 1;
  }
  next();
});

// Appliquer les middlewares et le routeur
server.use(middlewares);
server.use(router);

// ⚠️ Utiliser le port fourni par Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server is running on port ${PORT}`);
});
