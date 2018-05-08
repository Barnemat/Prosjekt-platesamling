import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Button,
  Glyphicon,
  Collapse,
  OverlayTrigger,
  Well,
  Image,
  Grid,
  Col,
  Row } from 'react-bootstrap';
import ListItems from '../Collection/ListItems';

export default class PublicUserPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recordUrl: 'http://localhost:8080/api/records',
    };
  }

  render() {
    const { recordUrl } = this.state;
    const { usernameFromPath } = this.props;
    return (
      <div>
        <ListItems
          url={recordUrl}
          publicUsername={usernameFromPath}
        />
      </div>
    );
  }
}

PublicUserPage.propTypes = {
  url: PropTypes.string.isRequired,
  usernameFromPath: PropTypes.string.isRequired,
};
