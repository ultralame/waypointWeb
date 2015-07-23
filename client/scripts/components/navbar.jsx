'use strict';

var React = require('react');

class Nav extends React.Component {
  render() {
    return (
      <div>
        ======= Jane Doe ====== <a href='/logout'>Logout</a>
      </div>
    );
  }
}

module.exports = Nav;
