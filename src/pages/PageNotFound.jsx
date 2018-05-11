import React from 'react';
import { Col, Grid, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import image from '../assets/img/logo-vanlig.png';

const PageNotFound = () => (
  <Grid fluid>
    <Row className="show-grid">
      <Col lg={2} md={2} />
      <Col lg={8} md={8} sm={12} xs={12}>
        <div className="text-center">
          <h1>Page not found</h1>
          <p>
            The page you are looking for does not exist.
          </p>
          <Link to="/">Return to front page</Link>
        </div>
        <div className="text-center huge-margin-top">
          <Image src={image} />
        </div>
      </Col>
      <Col lg={2} md={2} />
    </Row>
  </Grid>
);

export default PageNotFound;
