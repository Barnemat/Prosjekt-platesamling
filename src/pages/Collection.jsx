import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import ListItems from '../components/Collection/ListItems';

export default class Collection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12}>
              <ListItems />
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}
