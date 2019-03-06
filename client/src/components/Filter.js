import React, { Component } from 'react';
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class Filter extends Component {
  constructor() {
    super();
    this.date = getCurrentDate();
    this.count = 1;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    let formData = {
      id: this.count,
      location: e.target.location.value,
      type: e.target.type.value,
      postingDate: e.target.postingDate.value,
      priceFrom: e.target.priceFrom.value,
      priceTo: e.target.priceTo.value,
      bedrooms: e.target.bedrooms.value === 'studio' ? 0 : e.target.bedrooms.value,
      craigslist: e.target.craigslist.checked,
      kijiji: e.target.kijiji.checked,
      facebook: e.target.facebook.checked
    };
    this.props.updateFilter(formData);
    this.count++;
  }

  render() {
    return (
      <Form className="container-filter" onSubmit={this.onSubmit}>
        <FormGroup>
          <Label for="inputLocation">Location</Label>
          <Input type="select" name="location" id="inputLocation">
            <option>Metro Vancouver</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="inputType">Type</Label>
          <Input type="select" name="type" id="inputType">
            <option>rental</option>
            <option>for sale</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="inputPostingDate">Posting Date</Label>
          <Input type="date" name="postingDate" id="inputPostingDate" placeholder="date placeholder" defaultValue={this.date} />
        </FormGroup>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="inputPriceFrom">Price From</Label>
              <Input type="text" name="priceFrom" id="inputPriceFrom" />
            </FormGroup>
          </Col>
          <Col md={5}>
            <FormGroup>
              <Label for="inputPriceTo">To</Label>
              <Input type="text" name="priceTo" id="inputPriceTo" />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="inputBedrooms">Bedrooms</Label>
          <Input type="select" name="bedrooms" id="inputBedrooms">
            <option />
            <option>studio</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="inputSources">Sources:</Label>
          <div>
            <CustomInput type="checkbox" name="craigslist" id="inputCraigslist" label="Craigslist" defaultChecked />
            <CustomInput type="checkbox" name="kijiji" id="inputKijiji" label="Kijiji" defaultChecked />
            <CustomInput type="checkbox" name="facebook" id="inputFacebook" label="Facebook" defaultChecked />
          </div>
        </FormGroup>
        <center>
          <Button className="btn-block">Filter</Button>
        </center>
      </Form>
    );
  }
}

function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}-${month}-${day}`;
}

export default Filter;
