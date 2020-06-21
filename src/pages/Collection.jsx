import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import ListItems from '../components/Collection/ListItems';
import Filter from '../components/Filter/Filter';
import SignInJumbotron from '../components/CommonComponents/SignInJumbotron';

class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/records',
    };
  }

  render() {
    const { url } = this.state;
    const { authenticated } = this.props;

    return (
      <div>
        <Container fluid>
          <Row className="show-grid">
            <Col lg={2} md={2}>
              {authenticated
                && <Filter />}
            </Col>
            {/* <Col lg={8} md={8} sm={12} xs={12}>
              {authenticated
                && <ListItems url={url} />}
              {!authenticated
                && <SignInJumbotron />}
            </Col> */}
            <Col lg={2} md={2} />
          </Row>
        </Container>
      </div>
    );
  }
}

Collection.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated || false,
});

export default connect(mapStateToProps)(Collection);
