import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('/api/services')
      .then(res => setServices(res.data.services))
      .catch(console.error);
  }, []);

  return (
    <Container className="mt-5">
      <h2>Our Services</h2>
      <Row>
        {services.map(s => (
          <Col md={4} key={s.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{s.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}