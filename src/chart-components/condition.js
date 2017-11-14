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

    if (props.updateComponentDragPosition) {
      props.updateDraggedComponentId(props.id);
    }
    window.recentlyDraggedComponentID = props.id;
    return {
      Condition: DragSource('Condition', cardSource, collect)(Condition),
    };
  },

  endDrag(props) {
    if (props.updateComponentDragPosition) {
      props.updateComponentDragPosition(props.id);
    }
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

class Condition extends Component {
  constructor() {
    super();
    this.state = {
      rectStyle: {
        width: '100px',
        height: '50px',
        fill: '#00796b', 
      },
      x: 0,
      y: 0,
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
      this.setState({rectStyle: {...this.state.rectStyle, border: '2px solid red'}});
      e.persist();
      window.componentConnector = window.componentConnector || [];

      if (position === 'left') {
        window.componentConnector.push({
          x: selectedComponent.x, 
          y: (selectedComponent.y + selectedComponent.height / 2), 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        });
      } else if (position === 'top') {
        window.componentConnector.push({
          x: selectedComponent.x + selectedComponent.width / 2, 
          y: selectedComponent.y, 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        });
      } else if (position === 'right') {
        window.componentConnector.push({
          x: selectedComponent.x + selectedComponent.width, 
          y: selectedComponent.y + selectedComponent.height / 2, 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        });
      } else {
        window.componentConnector.push({
          x: selectedComponent.x + selectedComponent.width, 
          y: selectedComponent.y + selectedComponent.height, 
          id: this.props.id, 
          componentName: this.constructor.name,
          componentValue: this.props.value,
          position,
        });
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
    })
  }

  componentWillUnmount() {
    let selectedComponent = ReactDom.findDOMNode(this).getBoundingClientRect();
    const { connectDragSource, x, y, didDrop, id, isDragging, updateComponentDragPosition, forDisplayOnly } = this.props;
    if (didDrop && updateComponentDragPosition) {
      //updateComponentDragPosition(id, ReactDom.findDOMNode(this).getBoundingClientRect());
    }
  }
  
  render() {
    const { connectDragSource, x, y, didDrop, id, isDragging, updateComponentDragPosition, forDisplayOnly } = this.props;
    if (didDrop && id !== undefined) {
      window.recentlyDraggedComponentID = id;      
    }

    return connectDragSource(
      <g>
        <rect 
          x={x} 
          y={y} 
          style={this.state.rectStyle} 
          onClick={this.markPosition}>
        </rect>
        <rect 
          width='5px'
          height='5px'
          fill='red'
          display={this.state.markers.left.display}
          x={this.state.markers.left.x}
          y={this.state.markers.left.y}
          onClick={this.markPosition.bind(this, 'left')}
          />
        <rect 
          width='5px'
          height='5px'
          fill='red'
          display={this.state.markers.top.display}
          x={this.state.markers.top.x}
          y={this.state.markers.top.y}
          onClick={this.markPosition.bind(this, 'top')}
          />
        <rect 
          width='5px'
          height='5px'
          fill='red'
          display={this.state.markers.right.display}
          x={this.state.markers.right.x}
          y={this.state.markers.right.y}
          onClick={this.markPosition.bind(this, 'right')}
          />
        <rect 
          width='5px'
          height='5px'
          fill='red'
          display={this.state.markers.bottom.display}
          x={this.state.markers.bottom.x}
          y={this.state.markers.bottom.y}
          onClick={this.markPosition.bind(this, 'bottom')}
          />
        <text 
          x={x ? x + 15: 15} 
          y={y ? y + 30 : 30} 
          fill='#fff'
          onClick={this.editComponentName}>
          {this.props.value || 'statement'}
        </text>
      </g>
    );
  }
}

let newConditionComponent = DragSource('Condition', cardSource, collect)(Condition)

export default newConditionComponent;
