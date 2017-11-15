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

    if (props.updateDraggedComponentId) {
      props.updateDraggedComponentId(props.id);
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
    this.state = {
      style: {
        fill: '#f50057',
      }, 
      markers: {
        left: {
          x: 0,
          y: 0,
          display: 'none',
        },
        top: {
          x: 0,
          y: 0,
          display: 'none',
        }, 
        right: {
          x: 0,
          y: 0,
          display: 'none',
        },
        bottom: {
          x: 0,
          y: 0,
          display: 'none',
        }
      }
    }
  }

  markPosition = (position, e) => {
    let selectedComponent = ReactDom.findDOMNode(this).getBoundingClientRect();
    window.selectedComponent = this.props.id;
    if (this.props.forDisplayOnly !== true) {
      e.persist();
      window.componentConnector = window.componentConnector || [];
      /*if (window.componentConnector.length === 0) {
        window.componentConnector.push({x: (selectedComponent.x + selectedComponent.width / 2), y: (selectedComponent.y + selectedComponent.height), id: this.props.id});
      } else {
        window.componentConnector.push({x: (selectedComponent.x + selectedComponent.width / 2), y: selectedComponent.y, id: this.props.id});
      }*/

      let connectingPoint;
      if (position === 'left') {
        connectingPoint = {
          x: selectedComponent.x, 
          y: (selectedComponent.y + selectedComponent.height / 2), 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        };
      } else if (position === 'top') {
        connectingPoint = {
          x: selectedComponent.x + selectedComponent.width / 2, 
          y: selectedComponent.y, 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        };
      } else if (position === 'right') {
        connectingPoint = {
          x: selectedComponent.x + selectedComponent.width, 
          y: selectedComponent.y + selectedComponent.height / 2, 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        };
      } else {
        connectingPoint = {
          x: selectedComponent.x + selectedComponent.width / 2, 
          y: selectedComponent.y + selectedComponent.height, 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        };
      }

      if (window.componentConnector.length === 1 && window.componentConnector[0].id === this.props.id) {
        window.componentConnector[0] = connectingPoint;
      } else {
        window.componentConnector.push(connectingPoint);
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

  setSelectedComponent = () => {
    window.selectedComponent = this.props.id;
  }

  editComponentName = () => {    
    if (this.props.updateComponentName) {
      this.props.updateComponentName(this.props.id);
    }
  }

  componentDidMount() {
    let selectedComponent = ReactDom.findDOMNode(this).getBoundingClientRect();
    const { connectDragSource, x, y, didDrop, id, isDragging, updateComponentDragPosition, forDisplayOnly } = this.props;

    if (didDrop && updateComponentDragPosition) {
      updateComponentDragPosition(id, ReactDom.findDOMNode(this).getBoundingClientRect());
    }

    this.setState({
      markers: {
        left: {
          x: this.props.x || 0,
          y: (this.props.y || 0) + selectedComponent.height / 2,
          display: 'block',
        },
        top: {
          x: (this.props.x || 0) + selectedComponent.width / 2,
          y: this.props.y || 0,
          display: 'block',
        },
        right: {
          x: (this.props.x || 0) + selectedComponent.width - 5,
          y: (this.props.y || 0) + selectedComponent.height / 2,
        }, 
        bottom: {
          x: (this.props.x || 0) + selectedComponent.width / 2,
          y: (this.props.y || 0) + selectedComponent.height - 5,
        }
      }
    });
  }

  toggleMarkers = (action) => {
    this.setState({displayMarkers: action === 'display' && this.props.forDisplayOnly === false ? true : false});
  }
  
  render() {
    let { connectDragSource, isDragging, x, y, id, didDrop } = this.props;
    if (didDrop && id !== undefined) {
      window.recentlyDraggedComponentID = id;      
    }

    if (this.props.forDisplayOnly === false) {
      x += 50;
      y += 25;
    }

    return connectDragSource(
      <g
        onClick={this.setSelectedComponent}
        onMouseOver={this.toggleMarkers.bind(this, 'display')}
        onMouseOut={this.toggleMarkers.bind(this, 'hide')}>
        <ellipse style={this.state.style} cx={x} cy={y} rx="50" ry="25"/>
        <g className={this.state.displayMarkers ? 'marker display-block' : 'marker display-none'}>
          <rect 
            width='5px'
            height='5px'
            fill='blue'
            x={this.state.markers.left.x}
            y={this.state.markers.left.y}
            onClick={this.markPosition.bind(this, 'left')}
            />
          <rect 
            width='5px'
            height='5px'
            fill='blue'
            display={this.state.markers.top.display}
            x={this.state.markers.top.x}
            y={this.state.markers.top.y}
            onClick={this.markPosition.bind(this, 'top')}
            />
          <rect 
            width='5px'
            height='5px'
            fill='blue'
            display={this.state.markers.right.display}
            x={this.state.markers.right.x}
            y={this.state.markers.right.y}
            onClick={this.markPosition.bind(this, 'right')}
            />
          <rect 
            width='5px'
            height='5px'
            fill='blue'
            display={this.state.markers.bottom.display}
            x={this.state.markers.bottom.x}
            y={this.state.markers.bottom.y}
            onClick={this.markPosition.bind(this, 'bottom')}
            />
        </g>
        <text x={x - 35} y={y + 5} fill='#fff' onClick={this.editComponentName}>{this.props.value || 'statement'}</text>
      </g>
    );
  }
}

export default DragSource('End', cardSource, collect)(End);
