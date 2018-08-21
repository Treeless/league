const API = "http://localhost:8080/api";
class TodoApp extends React.Component {
    // LEARNING REACT: Code from https://reactjs.org/ and changed

    //Setup state and event listeners
    constructor(props) {
        super(props);
        this.state = { loading: false, account: {}, matches: [], text: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Initially render the screen
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                "League of Legends Statistics"
            ),
            React.createElement(
                "form", { onSubmit: this.handleSubmit },
                React.createElement("input", {
                    id: "summoner-name-input",
                    onChange: this.handleChange,
                    value: this.state.text
                }),
                React.createElement(
                    "button",
                    null,
                    "Search"
                )
            ),
            React.createElement(MatchList, { matches: this.state.matches }),
        );
    }

    handleChange(e) {
        this.setState({ text: e.target.value }); //Set the summoner name
    }

    handleSubmit(e) {
        e.preventDefault();
        var self = this;

        if (!this.state.text.length) {
            // TODO throw error
            return;
        }

        self.setState({
          loading: true
        })

        // TODO show loading
        console.log("DISPLAY LOADING ICON (change state)");

        // MAKE API CALL
        axios.get(API + '/' + this.state.text + '/matches.json', {
                crossdomain: true
            })
            .then(function(response) {
                var data = response.data;
                console.log(data);
                self.setState(prevState => ({
                    account: data.account,
                    matches: data.matches,
                    loading: false
                }));
            })
            .catch(function(error) {
                console.log(error);
                // TODO display error
            });
    }
}

// List of matches
class MatchList extends React.Component {
    render() {

        //DEV
        if (this.props.matches.length > 0)
            console.log(this.props.matches[0]);
        else {
            return React.createElement("div", null, React.createElement("h3", null, "No matches found"));
        }

        if(this.props.loading){
            React.createElement("div", null, React.createElement("<span>Loading...</span>"));
        }

        return React.createElement(
            "ul",
            null,
            this.props.matches.map(match => React.createElement(MatchItem, match))
        );
    }
}

//Each match item component in the match list componen
class MatchItem extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div class={(this.props.outcome) ? "match-listing victory" : "match-listing loss" }>
        <div class='block' id='block1'>
            <div id='outcome'>
                <span>{(this.props.outcome) ? "Victory" : "Defeat" }</span>
            </div>
            <div id='game-length'>
                <span>{this.props.gameLength}m</span>
            </div>
        </div>
        <div class='block' id='block2'>
            <div id='champName'>
                <span>{this.props.championName}</span>
            </div>
            <div id='spells'>
                <div>
                    <img src="..." />
                    <img src="..." />
                </div>
                <div>
                    <img src="..." />
                    <img src="..." />
                </div>
            </div>
        </div>
        <div class='block' id='block3'>
            <div id='stats'>
                <div>
                    <span id='kills'>{ this.props.kills }</span> / <span id='deaths'>{ this.props.deaths }</span> / <span id='assists'>{ this.props.assists }</span>
                </div>
            </div>
            <div id='kda'>
                { parseFloat(this.props.KDA).toFixed(2) }:1 KDA
            </div>
        </div>
        <div class='block' id='block4'>
            <div id='champlevel'>
                <span>Level {this.props.championLevel}</span>
            </div>
            <div id='creepkills'>
                <div><span>T: {this.props.totalCreepScore} ({parseFloat(this.props.creepScorePerMin).toFixed(2)}) CS</span></div>
            </div>
        </div>
        <div class='block' id='block5'>
            <div id='items-bought'>
                <div>
                    <img src={ this.props.items[0]} />
                    <img src={ this.props.items[1]} />
                    <img src={ this.props.items[2]} />
                    <img src={ this.props.items[3]} />
                </div>
                <div>
                    <img src={ this.props.items[4]} />
                    <img src={ this.props.items[5]} />
                    <img src={ this.props.items[6]} />
                    <img src={ this.props.items[7]} />
                </div>
            </div>
        </div>
    </div>)
  }
}

ReactDOM.render(React.createElement(TodoApp, null), document.getElementById("root"));