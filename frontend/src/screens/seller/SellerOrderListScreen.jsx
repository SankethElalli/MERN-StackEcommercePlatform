import React from 'react';
import { Table, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaCheck, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetSellerOrdersQuery, useDeliverOrderMutation } from '../../slices/sellerApiSlice';
import { toast } from 'react-toastify';

const SellerOrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetSellerOrdersQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const deliverHandler = async (orderId) => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>

      {loadingDeliver && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <Badge bg='success'>Paid {order.paidAt?.substring(0, 10)}</Badge>
                  ) : (
                    <Badge bg='danger'>Not Paid</Badge>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <Badge bg='success'>Delivered {order.deliveredAt?.substring(0, 10)}</Badge>
                  ) : (
                    <Badge bg='warning'>Pending</Badge>
                  )}
                </td>
                <td>
                  <div className='d-flex align-items-center gap-2'>
                    <Link 
                      to={`/order/${order._id}`} 
                      className='btn btn-dark btn-sm'
                      title="View Details"
                    >
                      <FaEye />
                    </Link>
                    {order.isPaid && !order.isDelivered && (
                      <Button 
                        variant='success'
                        className='btn-sm'
                        onClick={() => deliverHandler(order._id)}
                        title="Mark as Delivered"
                      >
                        <FaCheck />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SellerOrderListScreen;
