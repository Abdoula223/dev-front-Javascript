const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware pour générer des identifiants incrémentaux
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/smartphones') {
    // Récupérer la liste actuelle des smartphones
    const db = router.db.get('smartphones').value();
    // Trouver l'ID le plus élevé
    const maxId = db.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
    // Attribuer un nouvel ID incrémental
    req.body.id = maxId + 1; // ID numérique
  }
  next();
});

// Appliquer les middlewares et le routeur
server.use(middlewares);
server.use(router);

// Démarrer le serveur
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});