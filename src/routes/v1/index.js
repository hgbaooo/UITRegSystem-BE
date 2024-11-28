const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const regulationRoute = require('./regulation.route');
const notificationRoute = require('./notification.route');
const formRoute = require('./form.route');
const formTypeRoute = require('./formType.route');
const config = require('../../config/config');

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
    path: '/regulation',
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
    path: '/formTypes',
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

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
