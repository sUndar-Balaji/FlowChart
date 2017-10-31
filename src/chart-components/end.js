import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      End: DragSource('End', cardSource, collect)(End),
    };
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class End extends Component {
  constructor() {
    super();
  }

  markPosition = (e) => {
    if (this.props.forDisplayOnly !== true) {
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
    let { connectDragSource, isDragging, x, y } = this.props;
    x = x || '24px';
    y = y || '85px';

    return connectDragSource(
      <circle r='20px' cx={x} cy={y} onClick={this.markPosition} />
    );
  }
}

export default DragSource('End', cardSource, collect)(End);
