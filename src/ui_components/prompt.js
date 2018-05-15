// import Popup from 'react-popup';

'use strict';
const React = require('react');
const Popup = require('react-popup');
// const leaflet = require('react-leaflet');
//custom files required
//data
const config = require('../data_components/config.json');
const layers = require('../data_components/layers.json');
//logic
// const locationManager = require('../business_components/locationManager.js');
const logger = require('../business_components/logger.js');
// const OfflineLayer = require('../business_components/offlineLayer.js');

class Prompt extends React.Component {
    constructor(props) {
        super(props);

        console.log(this.state);
        console.log(this.props);

        this.state = {
            value: this.props.defaultValue
        };

        // this.onChange = (e) => this._onChange(e);
    }

    render() {
        return (
          <div className='popup'>
            <div className='popup_inner'>
              <h1>{this.props.text}</h1>
            <button onClick={this.props.closePopup}>close me</button>
            </div>
          </div>
        );
      }
}

module.exports = {
    Prompt: Prompt
}