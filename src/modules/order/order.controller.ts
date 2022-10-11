import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as orderService from './order.service';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).send(order);
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['status', 'type']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const order = await orderService.getOrderById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const order = await orderService.updateOrderById(id, req.body);
  res.send(order);
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  await orderService.deleteOrderById(id);
  res.status(httpStatus.NO_CONTENT).send();
});
