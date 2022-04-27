import { Component } from "react";
export class ErrorBoundary extends Component<any, {error:any},any> {
  constructor(props) {
    super(props);
    this.state = {error: ""};
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({error: `${error.name}: ${error.message}`});
  }

  render() {
    const {error} = this.state;
    if (error) {
      return (
        <div>{error}</div>
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}