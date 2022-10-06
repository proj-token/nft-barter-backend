import express, { Router } from 'express';
import assetRoute from './asset.route';
import collectionRoute from './collection.route';
import orderRoute from './order.route';

const router = express.Router();
interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/assets',
    route: assetRoute,
  },
  {
    path: '/collections',
    route: collectionRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
