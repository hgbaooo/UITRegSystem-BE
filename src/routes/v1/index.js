// routes/v1/index.js
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const regulationRoute = require('./regulation.route');
const notificationRoute = require('./notification.route');
const formRoute = require('./form.route');
const formTypeRoute = require('./formType.route');
const config = require('../../config/config');
const logger = require('../../config/logger'); // import logger

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/regulations',
    route: regulationRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/forms',
    route: formRoute,
  },
  {
    path: '/form-types',
    route: formTypeRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const showDocs = process.env.SHOW_DOCS === 'true';
if (config.env === 'development' || showDocs) {
  logger.info(`Enabling /docs route. SHOW_DOCS=${showDocs}`);
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

// Log all routes
router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    logger.info(`Route: ${r.route.path}`);
  }
});

module.exports = router;
