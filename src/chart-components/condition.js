import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { DragSource } from 'react-dnd';

export const cardSource = {
  beginDrag(props) {
    if (props.forDisplayOnly === true) {
      window.createNewCopies = true;
    } else {
      window.createNewCopies = false;
    }

    window.recentlyDraggedComponentID = props.id;
    return {
      Condition: DragSource('Condition', cardSource, collect)(Condition),
    };
  },
};

/**
 * Specifies the props to inject into your component.
 */
export function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop(),
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
      },
      x: 0,
      y: 0,
    }
  }

  markPosition = (e) => {
    let selectedComponent = ReactDom.findDOMNode(this).getBoundingClientRect();
    window.selectedComponent = this.props.id;
    if (this.props.forDisplayOnly !== true) {
      this.setState({rectStyle: {...this.state.rectStyle, border: '2px solid red'}});
      e.persist();
      window.componentConnector = window.componentConnector || [];
      if (window.componentConnector.length === 0) {
        window.componentConnector.push({x: (selectedComponent.x + selectedComponent.width / 2), y: (selectedComponent.y + selectedComponent.height), id: this.props.id});
      } else {
        window.componentConnector.push({x: (selectedComponent.x + selectedComponent.width / 2), y: selectedComponent.y, id: this.props.id});
      }

      if (window.componentConnector.length === 2) {
        window.addConnectorLines(window.componentConnector);
        window.componentConnector = [];
      }
    }

    if (this.props.id !== undefined) {
      window.recentlyDraggedComponentID = this.props.id;
    }
  }

  componentDidMount() {
    const { connectDragSource, x, y, didDrop, id, isDragging, updateComponentDragPosition, forDisplayOnly } = this.props;
    if (didDrop && updateComponentDragPosition) {
      updateComponentDragPosition(id, ReactDom.findDOMNode(this).getBoundingClientRect());
    }
  }
  
  render() {
    const { connectDragSource, x, y, didDrop, id, isDragging, updateComponentDragPosition, forDisplayOnly } = this.props;
    if (didDrop && id !== undefined) {
      window.recentlyDraggedComponentID = id;      
    }

    return connectDragSource(
      <g onClick={this.markPosition}>
        <rect x={x} y={y} style={this.state.rectStyle}></rect>
        <text x={x ? x + 15: 15} y={y ? y + 30 : 30} fill='#fff'>Statement</text>
      </g>
    );
  }
}

export default DragSource('Condition', cardSource, collect)(Condition);
