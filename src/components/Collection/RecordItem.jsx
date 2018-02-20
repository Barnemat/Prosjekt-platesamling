import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Panel, Grid, Col, Row, Collapse, Image, Well } from 'react-bootstrap';
import Rating from 'react-rating';
import { checkTimePassed } from '../../util.js';
import no_record_img from '../../assets/img/no_record_img.png';

export default class RecordItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      expand: false,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    const {
      notes,
      wikiDesc,
      wikiImg
    } = this.props.record;

    if(notes || wikiDesc || wikiImg) this.setState({ expand: !this.state.expand });
  }

  render() {
    return (
      <ListGroupItem onClick={this.toggleExpand}>
        <Grid fluid>
          {this.state.expand ?
            <ExpandedView record={this.props.record} image={this.props.record.image.data} />
          :
            <MinimizedView record={this.props.record} image={this.props.record.image.data} />
        }
        </Grid>
      </ListGroupItem>
    );
  }
}

RecordItem.propTypes = {
  record: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.num,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};

const MinimizedView = ({ record, image }) => (
  <Row>
    {record.wikiImg || image ?
      <Col lg={2} md={4} sm={8}>
        <Image src={`data:image/jpeg;base64,${image}` || record.wikiImg} rounded responsive />
      </Col>
    :
      <Col lg={2} md={4} sm={8}>
        <Image src={no_record_img} rounded responsive />
      </Col>
    }
    <Col lg={10} md={8} sm={4}>
      <Grid fluid>
        <Row>
          <Col lg={8} md={8} sm={4}>
            <h4>{record.artist} - {record.title}</h4>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h6>Format:</h6>
            <h6>{record.format}</h6>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h6>Rating:</h6>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={record.rating}
              readonly
            />
          </Col>
        </Row>
        <Row>
          <Col lg={8} md={8} sm={4}>
            <small>{checkTimePassed(record.date)}</small>
          </Col>
        </Row>
      </Grid>
    </Col>
  </Row>
);

MinimizedView.propTypes = {
  record: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.num,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};

const ExpandedView = ({ record, image }) => (
  <Row>
    {record.wikiImg || image ?
      <Col lg={4} md={4} sm={4} xs={4}>
        <Image src={`data:image/jpeg;base64,${image}` || record.wikiImg} rounded responsive />
      </Col>
      :
      <Col lg={2} md={4} sm={8} xs={6}>
        <Image src={no_record_img} rounded responsive />
      </Col>
    }
    <Col lg={8} md={8} sm={8} xs={8}>
      <Grid fluid>
        <Row>
          <Col lg={8} md={8} sm={8} xs={8}>
            <h4>{record.artist} - {record.title}</h4>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h5><b>Format:</b></h5>
            <h5>{record.format}</h5>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h5><b>Rating:</b></h5>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={record.rating}
              readonly
            />
          </Col>
        </Row>
        <Row>
        {record.wikiDesc &&
          <Col lg={12} md={12} sm={12} xs={12}>
            <h5><b>Description:</b></h5>
            {record.wikiDesc + ' '}
            {(record.wikiHref && <a href={record.wikiHref} target="blank">Wikipedia</a>) || 
              <a href="https://en.wikipedia.com" target="blank">Wikipedia</a>
            }
          </Col>
        }
        </Row>
        <Row>
          {record.notes &&
            <Col lg={12} md={12} sm={12} xs={12}>
              <h5><b>Notes:</b></h5>
              {record.notes}
            </Col>
          }
        </Row>
        <Row>
          <Col lg={8} md={8} sm={8} xs={8}>
            <h6>{checkTimePassed(record.date)}</h6>
          </Col>
        </Row>
      </Grid>
    </Col>
  </Row>
);

ExpandedView.propTypes = {
  record: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.num,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};
