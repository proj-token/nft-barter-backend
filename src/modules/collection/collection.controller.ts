import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as collectionService from './collection.service';

const getCollections = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['address', 'type']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await collectionService.queryCollections(filter, options);
  res.send(result);
});

export default getCollections;
