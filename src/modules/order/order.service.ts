import httpStatus from 'http-status';
import Order from './order.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreateOrder, IOrder, IOrderDoc, Status, UpdateOrder } from './order.interfaces';

/**
 * Create a order
 * @param {NewCreateOrder} order
 * @returns {Promise<IOrderDoc>}
 */
export const createOrder = async (createOrderBody: NewCreateOrder): Promise<IOrderDoc> => {
  const order: IOrder = { ...createOrderBody, taker: '0x', status: Status.Active };
  return Order.create(order);
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get order by id
 * @param {string} id
 * @returns {Promise<IOrderDoc | null>}
 */
export const getOrderById = async (id: number): Promise<IOrderDoc | null> => Order.findOne({ orderId: id });

/**
 * Update order by id
 * (only update status Active -> Filled)
 * @param {number} id
 * @param {UpdateOrder} updateBody
 * @returns {Promise<IOrderDoc | null>}
 */
export const updateOrderById = async (id: number, updateBody: UpdateOrder): Promise<IOrderDoc | null> => {
  const order = await getOrderById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  order.taker = updateBody.taker;
  order.status = updateBody.status;
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {number} id
 * @returns {Promise<IOrderDoc | null>}
 */
export const deleteOrderById = async (id: number): Promise<IOrderDoc | null> => {
  const order = await getOrderById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (order.status === Status.Filled) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete filled order ');
  }
  await order.remove();
  return order;
};
