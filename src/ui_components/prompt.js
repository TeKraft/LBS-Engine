'use strict';
const React = require('react');
//custom files required
//data
const config = require('../data_components/config.json');
const layers = require('../data_components/layers.json');
//logic
const logger = require('../business_components/logger.js');

class Prompt extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.endGame = this.endGame.bind(this);

        this.state = {
            value: this.props.defaultValue,
            gps: this.props.gps,
            spots: this.props.spots
        };

    }

    componentDidMount() {
        var that = this;

        // do stuff here
    }

    endGame() {
        try {
            this.props.onEndGameChange(true);
        } catch(e) {
            console.log('Error:\n' + e);
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h1>hello</h1>
                    <input type="text" placeholder={this.state.gps[0]} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
                    <input type="text" placeholder={this.state.gps[1]} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
                    <p>kjar aelrkjearvlk vealvrkeaörvHO voern voVILÖKVCnövjarv üraoirhv oi ovihaäorivn voriv naödkjfbv aoa </p>
                </div>
                <div>
                    <button onClick={this.endGame}>close</button>
                </div>
            </div>
        )
    }
}

module.exports = {
    Prompt: Prompt
}