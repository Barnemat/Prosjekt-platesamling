import React from 'react';
import axios from 'axios';
import {
  FormControl,
  FormGroup,
  Button,
  Glyphicon,
  InputGroup,
  ControlLabel,
  Collapse,
  OverlayTrigger,
  Checkbox,
  Well,
  Image,
  Grid,
  Col,
  Row } from 'react-bootstrap';
  import DefaultFormGroup from '../components/Collection/FormComponents/DefaultFormGroup';
  import { setLoadingCursor } from '../util';

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/user',
      username: '',
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password } = this.state;
    setLoadingCursor(true);

    axios.post(this.state.url, { username, email, password })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        setLoadingCursor(false);
      });
    
    this.setState({
      username: '',
      email: '',
      password: '',
    });
  }

  render() {
    const { username, email } = this.state;
    return (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12} xs={12}>
              <form onSubmit={this.handleSubmit}>
                <DefaultFormGroup
                  id="formControlsUsername"
                  name="username"
                  value={username}
                  type="text"
                  label="Username"
                  placeholder="Username..."
                  onChange={this.handleChange}
                />
                <DefaultFormGroup
                  id="formControlsEmail"
                  name="email"
                  value={email}
                  type="email"
                  label="Email"
                  placeholder="Email..."
                  onChange={this.handleChange}
                />
                <DefaultFormGroup
                  id="formControlsPassword"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password..."
                  onChange={this.handleChange}
                />
                <Button bsStyle="primary" type="submit">
                  Register
                </Button>
              </form>
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}
