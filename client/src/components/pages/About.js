import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="container-about">
        <p>
          This tool aggregates the online housing market into a single map. Each marker on the map represents a housing opportunity. Click
          on a marker for more detail!
        </p>
        <br />
        <a href="https://github.com/andyy5">GitHub</a>
      </div>
    );
  }
}

export default About;
