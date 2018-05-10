import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Grid, Row, ListGroupItem } from 'react-bootstrap';

const getBsStyle = (isPublic, usernamesEqual) => {
  if (!usernamesEqual && isPublic) {
    return 'success';
  } else if (!usernamesEqual && !isPublic) {
    return 'danger';
  }
  return 'default';
};

const UserItem = ({
  username, usernamesEqual, handleClick, ...props
}) => (
  <ListGroupItem className="darker-onhover">
    <Grid fluid>
      <Row>
        <Col lg={2} md={4} sm={4} xs={12}>
          <strong>{username}</strong>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          {!usernamesEqual &&
          <div>
                The user has a {props.public ? 'public' : 'private'} account.
          </div>
            }
          {usernamesEqual &&
          <div>
                You have a {props.public ? 'public' : 'private'} account.
          </div>
            }
          <Button
            name="gotoUserPage"
            className="pull-right"
            bsStyle={getBsStyle(props.public, usernamesEqual)}
            bsSize="small"
            disabled={!props.public && !usernamesEqual}
            onClick={(e) => {
                handleClick(e, username);
              }}
          >
            {!usernamesEqual && !props.public &&
                'Private'
              }
            {!usernamesEqual && props.public &&
                'Go to the user\'s collection'
              }
            {usernamesEqual &&
                'Go to your user page'
              }
          </Button>
        </Col>
      </Row>
    </Grid>
  </ListGroupItem>
);

UserItem.propTypes = {
  username: PropTypes.string.isRequired,
  usernamesEqual: PropTypes.bool.isRequired,
  public: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

UserItem.defaultProps = {
  public: false,
};

export default UserItem;
