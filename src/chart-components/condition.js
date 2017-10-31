import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

export const cardSource = {
  beginDrag(props) {
    return {
      Condition: DragSource('Condition', cardSource, collect)(Condition),
    };
  }
};

/**
 * Specifies the props to inject into your component.
 */
export function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class Condition extends Component {
  constructor() {
    super();
    this.state = {
      rectStyle: {
        width: '100px',
        height: '50px',
        backgroundColor: '#999', 
      }
    }
  }

  markPosition = (e) => {
    if (this.props.forDisplayOnly !== true) {
      this.setState({rectStyle: {...this.state.rectStyle, border: '2px solid red'}});
      e.persist();
      window.componentConnector = window.componentConnector || [];
      window.componentConnector.push({x: e.clientX, y: e.clientY});
      if (window.componentConnector.length === 2) {
        window.addConnectorLines(window.componentConnector);
        window.componentConnector = [];
      }
    }
  }
  
  render() {
    const { connectDragSource, x, y } = this.props;
    return connectDragSource(
      <rect x={x} y={y} style={this.state.rectStyle} onClick={this.markPosition}></rect>
    );
  }
}

export default DragSource('Condition', cardSource, collect)(Condition);
