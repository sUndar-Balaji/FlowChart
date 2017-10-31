import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';
import Condition, { cardSource, collect as collectCondition } from './condition';
import ComponentConnector from './Connector';

let newComp = null;
let observer = null;

const squareTarget = {
  canDrop(props) {
    return true;
  },

  drop(props, monitor, component) {
    let droppedComponent = monitor.getItem()[Object.keys(monitor.getItem())[0]].DecoratedComponent;
    publish(
      DragSource('', 
        cardSource, 
        collectCondition
      )(droppedComponent), { 
        x: monitor.getSourceClientOffset().x,
        y: monitor.getSourceClientOffset().y,
      }
    );
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggedItem: monitor.getItem(),
  }
}

function observe(fn) {
  observer = fn;
}

function publish(component, dropLocation) {
  observer(component, dropLocation);
}

class DrawingBoard extends Component {
  constructor() {
    super();
    this.state = {
      rectStyle: {/*
        width: '100px',
        height: '50px',*/
      },
      currentComponentOffset: {
        x: 0, 
        y: 0,
      },
      chartComponents: [],
    }
    this.observe = observe(this.addDroppedComponent.bind(this));
    window.addConnectorLines = this.addConnectorLines;
  }

  componentDidMount() {
    this.setState({
      currentComponentOffset: { 
        x: ReactDom.findDOMNode(this).getBoundingClientRect().x,
        y: ReactDom.findDOMNode(this).getBoundingClientRect().y, 
      }
    });
  }

  componentWillUnmount() {
    observer = null;
  }

  addDroppedComponent(component, dropLocation) {
    this.setState({chartComponents: [...this.state.chartComponents, { component, ...dropLocation }]});
  }

  addConnectorLines = (coordinates) => {
    this.setState({chartComponents: [...this.state.chartComponents, { component: ComponentConnector, coordinates }]});
  }
  
  render() {
    const { connectDropTarget, isOver, canDrop, draggedItem } = this.props;

    return connectDropTarget(
      <div style={this.state.rectStyle} className='drawing-board'>
        Drop here
        <svg>
          {
            this.state.chartComponents.map((componentDetails, index) => {
              let Component = componentDetails.component;
              if ('x' in componentDetails) {
                return <Component x={componentDetails.x - this.state.currentComponentOffset.x} y={componentDetails.y} key={index} />
              } else {
                return <Component key={index} coordinates={componentDetails.coordinates} startingPoint={this.state.currentComponentOffset} />
              }
            })
          }
        </svg>
      </div>
    );
  }
}

export default DropTarget(['Condition', 'End'], squareTarget, collect)(DrawingBoard);
