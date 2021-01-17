import * as React from "react";
import * as ReactDOM from "react-dom";

export class Hello extends React.Component {
    render() {
        return (
            <h1>Welcome to React!!</h1>
        );
    }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
