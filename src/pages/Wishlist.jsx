import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import SignInJumbotron from '../components/CommonComponents/SignInJumbotron';
import ListWishlistItems from '../components/Wishlist/ListWishlistItems';
import Filter from '../components/Filter/Filter';

class Wishlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/wishlist',
      recordUrl: 'http://localhost:8080/api/records',
    };
  }

  render() {
    const { url, recordUrl } = this.state;
    const { authenticated } = this.props;

    return (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2}>
              {authenticated
                && <Filter wishlist />}
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              {authenticated
                && <ListWishlistItems url={url} recordUrl={recordUrl} />}
              {!authenticated
                && <SignInJumbotron />}
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

Wishlist.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated || false,
});

export default connect(mapStateToProps)(Wishlist);
