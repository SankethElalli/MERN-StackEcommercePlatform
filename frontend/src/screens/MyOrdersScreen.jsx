import React from 'react';
import { Table, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

const MyOrdersScreen = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col>
          <h1>My Orders</h1>
          <p className='text-muted'>Track and manage your order history</p>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : orders.length === 0 ? (
        <Message>
          You haven't placed any orders yet. <Link to='/' className='text-primary'>Start shopping</Link>
        </Message>
      ) : (
        <div className='table-responsive'>
          <Table hover striped className='table-sm'>
            <thead className='bg-dark'>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className='text-muted'>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      <Badge bg='success' pill>
                        Paid {order.paidAt.substring(0, 10)}
                      </Badge>
                    ) : (
                      <Badge bg='danger' pill>
                        Not Paid
                      </Badge>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <Badge bg='success' pill>
                        Delivered {order.deliveredAt.substring(0, 10)}
                      </Badge>
                    ) : (
                      <Badge bg='warning' text='dark' pill>
                        In Transit
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Link 
                      to={`/order/${order._id}`}
                      className='btn btn-dark btn-sm'
                      title='View Order'
                    >
                      <FaEye /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default MyOrdersScreen;
