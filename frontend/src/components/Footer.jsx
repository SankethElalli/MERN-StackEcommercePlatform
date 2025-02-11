import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>WesternStreet &copy; {currentYear}</p>
            <div className='social-icons'>
              <a href='https://github.com/mrsscsprojects' target='_blank' rel='noopener noreferrer'>
                <FaGithub />
              </a>
              <a href='mailto:mrsscsprojects@gmail.com'>
                <FaEnvelope />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
