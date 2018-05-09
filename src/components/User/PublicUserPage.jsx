import React from 'react';
import PropTypes from 'prop-types';
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
  usernameFromPath: PropTypes.string.isRequired,
};
