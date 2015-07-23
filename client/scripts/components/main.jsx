var React = require('react');
// var Reflux = require('reflux');
// var Actions = require('../actions/actions');
// var User = require('../stores/user.store');
var Nav = require('./navbar.jsx');

class Main extends React.Component {
  render() {
    this.newFunction();
    return (
      <div>
        <Nav />
      </div>
    );
  }

}

module.exports = Main;
