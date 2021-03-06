import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Container, Row, ListGroupItem,
} from 'react-bootstrap';

const getvariant = (isPublic, usernamesEqual) => {
  if (!usernamesEqual && isPublic) {
    return 'success';
  } if (!usernamesEqual && !isPublic) {
    return 'danger';
  }
  return 'outline-dark';
};

const UserItem = ({
  username, usernamesEqual, handleClick, isPublic,
}) => (
  <ListGroupItem className="darker-onhover">
    <Container fluid>
      <Row>
        <Col lg={2} md={4} sm={4} xs={12}>
          <strong>{username}</strong>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          {!usernamesEqual
          && (
          <div>
            The user has a
            {' '}
            {isPublic ? 'public' : 'private'}
            {' '}
            account.
          </div>
          )}
          {usernamesEqual
          && (
          <div>
            You have a
            {' '}
            {isPublic ? 'public' : 'private'}
            {' '}
            account.
          </div>
          )}
          <Button
            name="gotoUserPage"
            className="pull-right"
            variant={getvariant(isPublic, usernamesEqual)}
            size="sm"
            disabled={!isPublic && !usernamesEqual}
            onClick={(e) => {
              handleClick(e, username);
            }}
          >
            {!usernamesEqual && !isPublic
                && 'Private'}
            {!usernamesEqual && isPublic
                && 'Go to the user\'s collection'}
            {usernamesEqual
                && 'Go to your user page'}
          </Button>
        </Col>
      </Row>
    </Container>
  </ListGroupItem>
);

UserItem.propTypes = {
  username: PropTypes.string.isRequired,
  usernamesEqual: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

UserItem.defaultProps = {
  isPublic: false,
};

export default UserItem;
