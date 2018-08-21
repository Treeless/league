const API = "http://localhost:8080/api";
class TodoApp extends React.Component {
    // LEARNING REACT: Code from https://reactjs.org/ and changed

    constructor(props) {
        super(props);
        this.state = { account: {}, matches: [], text: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                "League of Legends Statistics"
            ),
            React.createElement(MatchList, { matches: this.state.matches }),
            React.createElement(
                "form", { onSubmit: this.handleSubmit },
                React.createElement("input", {
                    id: "new-todo",
                    onChange: this.handleChange,
                    value: this.state.text
                }),
                React.createElement(
                    "button",
                    null,
                    "Search"
                )
            )
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
                    matches: data.matches
                }));
            })
            .catch(function(error) {
                console.log(error);
                // TODO display error
            });
    }
}

class MatchList extends React.Component {
    render() {

        console.log(this.props);
        return React.createElement(
            "ul",
            null,
            this.props.matches.map(match => React.createElement(
                "li", { key: match.gameId },
                match //TODO, make more sophisticated
            ))
        );
    }
}

ReactDOM.render(React.createElement(TodoApp, null), document.getElementById("root"));