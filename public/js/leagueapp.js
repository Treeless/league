class TodoApp extends React.Component {
    // LEARNING REACT: Code from https://reactjs.org/ and changed

    constructor(props) {
        super(props);
        this.state = { items: [], text: '' };
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
                "TODO"
            ),
            React.createElement(MatchList, { items: this.state.items }),
            React.createElement(
                "form", { onSubmit: this.handleSubmit },
                React.createElement(
                    "label", { htmlFor: "new-todo" },
                    "What needs to be done?"
                ),
                React.createElement("input", {
                    id: "new-todo",
                    onChange: this.handleChange,
                    value: this.state.text
                }),
                React.createElement(
                    "button",
                    null,
                    "Add #",
                    this.state.items.length + 1
                )
            )
        );
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();


        if (!this.state.text.length) {
            return;
        }
        const newItem = {
            text: this.state.text,
            id: Date.now()
        };
        this.setState(prevState => ({
            items: prevState.items.concat(newItem),
            text: ''
        }));
    }
}

class MatchList extends React.Component {
    render() {
        return React.createElement(
            "ul",
            null,
            this.props.items.map(match => React.createElement(
                "li", { key: item.id },
                match //TODO, make more sophisticated
            ))
        );
    }
}

ReactDOM.render(React.createElement(TodoApp, null), document.getElementById("root"));