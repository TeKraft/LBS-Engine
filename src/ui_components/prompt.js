'use strict';
const React = require('react');
const Button = require('react-bootstrap/lib/Button');
const Alert = require('react-bootstrap/lib/Alert');
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
        this.selectSpot = this.selectSpot.bind(this);
        this.submitSpot = this.submitSpot.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);

        this.state = {
            value: this.props.defaultValue,
            gps: this.props.gps,
            spots: this.props.spots,
            selected: this.props.selected,
            scores: this.props.scores,
            score: this.props.score,
            questionnaire: this.props.questionnaire,
            numberOfQuestions: this.props.numberOfQuestions,
            qset: null,
            selectedSpot: null,
            selectedAnswer: null
        };

    }

    componentDidMount() {
        var that = this;
        // do stuff here
    }

    /**
     * Function to close the Prompt component and return to the map
     */
    endGame() {
        let score = {
            spot: 'Botanical Garden',
            score: 10,
            scores: this.state.scores
        };
        try {
            this.props.onEndGameChange(score);
            this.setState({selected: false});
        } catch(e) {
            console.log('Error:\n' + e);
        }
    }

    /**
     * Function to set state of the spot that was selected by the user
     */
    selectSpot() {
        if (this.state.selectedSpot !== null) {
            let mySpot = this.state.selectedSpot;
            let spots = layers['T-spots'].items;
            let i = spots.findIndex((spot) => spot.name === mySpot);
            if (i >= 0) {
                this.state.qset = spots[i].qset;
                // TODO: check for score of selected spot
                this.setState({
                    selected: true
                });
            } else {
                <Alert bsStyle='warning'><strong>Attention!</strong> No spot found.</Alert>
            }
        } else {
            <Alert bsStyle='danger'><strong>Attention!</strong> Please select a spot.</Alert>
        }
    }

    /**
     * Function to update new metadata to question template
     */
    nextQuestion() {
        if (this.state.selectedAnswer !== null) {
            this.setState({
                selectedAnswer: null
            });
        } else {
            <Alert bsStyle='danger'><strong>Attention!</strong> Please select an answer.</Alert>
        }

        if (this.state.qset === null || this.state.numberOfQuestions === this.state.qset.length - 1) {
            this.setState({
                questionnaire: false
            })
        }
    }

    /**
     * 
     * @param {String} spot name of the spot 
     */
    makeSpotButton(spot) {
        return (
            <Button bsSize='large' key={spot} value={spot} onClick={() => this.submitSpot(spot)} block>{spot}</Button>
        )
    }

    /**
     * 
     * @param {Object} item object of a single answer [letter, value] 
     */
    makeAnswerButton(item) {
        let answer = Object.entries(item)[0];
        return (
            <Button bsSize='large' ref={answer[0]} key={answer[0]} value={answer[1]} onClick={() => this.submitAnswer(answer)} block>{answer[1]}</Button>
        )
    }

    /**
     * 
     * @param {String} spot name of selected spot 
     */
    submitSpot(spot) {
        this.state.selectedSpot = spot;
    }

    /**
     * 
     * @param {Array} answer array containing letter and value of answer
     */
    submitAnswer(answer) {
        if (this.state.selectedAnswer === null) {
            this.state.selectedAnswer = answer;
            let selectedBut = this.refs[this.state.selectedAnswer[0]];
            if (this.state.selectedAnswer[0] === this.state.qset[this.state.numberOfQuestions - 1].Answer) {
                // TODO if right answer was selected
                // let correctBut = this.ref[this.state.qset];
            } else {
                // TODO wrong answer was selected
            }
        } else {
            // TODO no selection possible anymore
        }
    }

    render() {
        if (this.state.selected === false) {
            // render if component is first time loaded and user has to select a spot
            var listOfSpots = this.state.spots.map(this.makeSpotButton, this);
            return (
                <div>
                    <div>
                        <h1>Select Spot</h1>
                        <input type="text" placeholder={this.state.gps[0]} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
                        <input type="text" placeholder={this.state.gps[1]} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
                        <div>
                            {listOfSpots}
                        </div>
                    </div>
                    <div>
                        <Button bsStyle="primary" onClick={this.endGame}>close</Button>
                        <Button bsStyle="primary" onClick={this.selectSpot}>Submit</Button>
                    </div>
                </div>
            )
        } else if (this.state.questionnaire === true) {
            // render to show questions
            this.state.numberOfQuestions++;
            var listOfAnswers = this.state.qset[this.state.numberOfQuestions - 1].Options.map(this.makeAnswerButton, this);
            return (
                <div>
                    <h1>Question {this.state.numberOfQuestions}</h1>
                    <div>
                        <h2>{this.state.qset[this.state.numberOfQuestions - 1].Question}</h2>
                        {listOfAnswers}
                    </div>
                    <div>
                        <Button bsStyle="primary" onClick={this.endGame}>close</Button>
                        <Button bsStyle="primary" onClick={this.nextQuestion}>Next</Button>
                    </div>
                </div>
            )
        } else {
            // render to show scoreboard at the end of the questionnaire
            return (
                <div>
                    <h1>Scoreboard</h1>
                    <div>
                        <p>scores should be here</p>
                    </div>
                    <div>
                        <Button bsStyle="primary" onClick={this.endGame}>close</Button>
                    </div>
                </div>
            )
        }
    }
}

module.exports = {
    Prompt: Prompt
}