import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import ReactDom from 'react-dom';

export const cardSource = {
  beginDrag(props) {
    if (props.forDisplayOnly === true) {
      window.createNewCopies = true;
    } else {
      window.createNewCopies = false;
    }

    window.recentlyDraggedComponentID = props.id;
    return {
      End: DragSource('End', cardSource, collect)(End),
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
    didDrop: monitor.didDrop(),
  };
}

class End extends Component {
  constructor() {
    super();
  }

  markPosition = (e) => {
    let selectedComponent = ReactDom.findDOMNode(this).getBoundingClientRect();
    window.selectedComponent = this.props.id;
    if (this.props.forDisplayOnly !== true) {
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

  editComponentName = () => {    
    if (this.props.updateComponentName) {
      this.props.updateComponentName(this.props.id);
    }
  }

  componentDidMount() {
    const { connectDragSource, x, y, didDrop, id, isDragging, updateComponentDragPosition, forDisplayOnly } = this.props;

    if (didDrop && updateComponentDragPosition) {
      updateComponentDragPosition(id, ReactDom.findDOMNode(this).getBoundingClientRect());
    }
  }
  
  render() {
    let { connectDragSource, isDragging, x, y, id, didDrop } = this.props;
    if (didDrop && id !== undefined) {
      window.recentlyDraggedComponentID = id;      
    }

    return connectDragSource(
      <g>
        <ellipse cx={x} cy={y} rx="50" ry="25" onClick={this.markPosition}/>
        <text x={x - 35} y={y + 5} fill='#fff' onClick={this.editComponentName}>{this.props.value || 'statement'}</text>
      </g>
    );
  }
}

export default DragSource('End', cardSource, collect)(End);
