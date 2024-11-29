import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About: React.FC = () => {
    return (
        <div className="about-page bg-light py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-lg">
                            <Card.Body>
                                <h2 className="text-center mb-4">About Us</h2>
                                <p className="lead">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet suscipit risus, in ultricies eros. Morbi ac eros vel nulla cursus tincidunt. Quisque eu orci non erat venenatis tempus non non erat.
                                </p>
                                <p>
                                    Fusce dapibus metus at dui pharetra, ac iaculis turpis pretium. Donec egestas nisi turpis, eu tincidunt lectus vestibulum at. Ut malesuada nisi non urna rhoncus, ac vehicula tortor bibendum. Nunc gravida metus eget orci tincidunt, in vestibulum sapien vehicula.
                                </p>
                                <p>
                                    Mauris ac dolor quis nulla dapibus ultricies sed ac nisl. Curabitur in nisl nec turpis lobortis tincidunt et sit amet lorem. Integer varius sit amet dui eget convallis. Duis euismod feugiat metus id pretium. Etiam tristique risus vel metus hendrerit, a placerat orci varius.
                                </p>
                                <h4>Our Values</h4>
                                <ul>
                                    <li>Integrity</li>
                                    <li>Innovation</li>
                                    <li>Customer-Centric Approach</li>
                                    <li>Excellence</li>
                                </ul>
                                <h4>Contact Us</h4>
                                <p>
                                Have questions? Reach out to our support team at <strong>support@fishshop.com</strong> or call us at <strong>(123) 456-789</strong>.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
