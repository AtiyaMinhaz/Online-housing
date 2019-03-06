import React, { Component } from 'react';
import Map from '../Map';
import Filter from '../Filter';

class Main extends Component {
  constructor() {
    super();
    this.state = { housing: [], filter: { id: 0 } };
    this.updateFilter = this.updateFilter.bind(this);
    this.updateHousing = this.updateHousing.bind(this);
  }

  updateFilter(data) {
    this.setState({ filter: data });
  }

  updateHousing(data) {
    this.setState({ housing: data });
  }

  render() {
    return (
      <div className="container-flex">
        <Map housing={this.state.housing} filter={this.state.filter} updateHousing={this.updateHousing} />
        <Filter updateFilter={this.updateFilter} />
      </div>
    );
  }
}

export default Main;
