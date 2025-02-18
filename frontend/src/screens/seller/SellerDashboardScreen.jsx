import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap'; // Remove Button import
import { Link } from 'react-router-dom';
import { FaBox, FaExclamationCircle, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetDashboardStatsQuery } from '../../slices/sellerApiSlice';
import { format } from 'date-fns';

const SellerDashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  return (
    <>
      <h1>Seller Dashboard</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Row>
            <Col md={3}>
              <Card className='my-3 p-3'>
                <Card.Body className='text-center'>
                  <FaMoneyBillWave size={30} className='mb-2' />
                  <Card.Title>Total Sales</Card.Title>
                  <Card.Text className='h2'>₹{stats.totalSales.toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className='my-3 p-3'>
                <Card.Body className='text-center'>
                  <FaBox size={30} className='mb-2' />
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text className='h2'>{stats.productStats.total}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className='my-3 p-3 bg-warning text-white'>
                <Card.Body className='text-center'>
                  <FaExclamationCircle size={30} className='mb-2' />
                  <Card.Title>Low Stock</Card.Title>
                  <Card.Text className='h2'>{stats.productStats.lowStock}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className='my-3 p-3 bg-danger text-white'>
                <Card.Body className='text-center'>
                  <FaShoppingCart size={30} className='mb-2' />
                  <Card.Title>Out of Stock</Card.Title>
                  <Card.Text className='h2'>{stats.productStats.outOfStock}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className='my-3'>
            <Col>
              <Card>
                <Card.Header>
                  <h3>Recent Orders</h3>
                </Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>CUSTOMER</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{format(new Date(order.createdAt), 'MMM dd yyyy')}</td>
                          <td>{order.user.name}</td>
                          <td>₹{order.totalPrice}</td>
                          <td>
                            {order.isPaid ? (
                              format(new Date(order.paidAt), 'MMM dd yyyy')
                            ) : (
                              <span className='text-danger'>Not Paid</span>
                            )}
                          </td>
                          <td>
                            <Link 
                              to={`/order/${order._id}`}
                              className='btn btn-dark btn-sm'
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h3>Monthly Sales</h3>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.monthlyOrders.map((month) => (
                        <tr key={`${month._id.year}-${month._id.month}`}>
                          <td>{format(new Date(month._id.year, month._id.month - 1), 'MMMM yyyy')}</td>
                          <td>₹{month.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SellerDashboardScreen;
