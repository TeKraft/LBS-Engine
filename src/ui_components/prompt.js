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
        this.nextQuestion = this.nextQuestion.bind(this);

        this.state = {
            value: this.props.defaultValue,
            gps: this.props.gps,
            spots: this.props.spots,
            selected: this.props.selected,
            scores: this.props.scores,
            score: this.props.score,
            numberOfQuestions: this.props.numberOfQuestions
        };

    }

    componentDidMount() {
        var that = this;

        // do stuff here
    }

    endGame() {
        let score = {spot: 'Botanical Garden', score: 10};
        try {
            this.props.onEndGameChange(score);
            this.setState({selected: false});
        } catch(e) {
            console.log('Error:\n' + e);
        }
    }

    nextQuestion() {
        this.setState({
            selected: true
        });
    }

    render() {
        if (this.state.selected === true) {
            this.state.numberOfQuestions++;
            return(
                <div>
                    <h1>Question {this.state.numberOfQuestions}</h1>
                    <div>
                        <button onClick={this.endGame}>close</button>
                        <button onClick={this.nextQuestion}>Submit</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div>
                        <h1>Select location</h1>
                        <input type="text" placeholder={this.state.gps[0]} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
                        <input type="text" placeholder={this.state.gps[1]} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
                        <p>
                            kjar aelrkjearvlk vealvrkeaörvHO voern 
                            voVILÖKVCnövjarv üraoirhv oi ovihaäorivn voriv naödkjfbv aoa
                        </p>
                    </div>
                    <div>
                        <button onClick={this.endGame}>close</button>
                        <button onClick={this.nextQuestion}>Submit</button>
                    </div>
                </div>
            )
        }
    }
}

module.exports = {
    Prompt: Prompt
}