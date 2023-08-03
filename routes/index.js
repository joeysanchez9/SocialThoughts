const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes)
console.log('route connected for route index');

router.use((req, res) => res.send('Unknown route'));

module.exports = router;