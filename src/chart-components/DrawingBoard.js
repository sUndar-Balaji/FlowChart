import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';
import Condition, { cardSource, collect as collectCondition } from './condition';
import End, { cardSource as endCardSource, collect as endCardCollect } from './end';
import ComponentConnector from './Connector';

let newComp = null;
let observer = null;
let componentCounter = 0;
window.lineCounter = 0;

window.addEventListener('keyup', function (e) {
  window.removeComponent(e);
}, false);

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
        componentName: Object.keys(monitor.getItem())[0],
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
    window.removeComponent = this.removeComponent.bind(this);
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
    if (window.createNewCopies !== true) {
      let componentAlreadyExist = false;
      let updatedComponent = this.state.chartComponents.map(function (component) {
        if (component.id === window.recentlyDraggedComponentID) {
          componentAlreadyExist = true;
          return { ...component, ...dropLocation };
        }

        return { ...component };
      });

      if (componentAlreadyExist) {
        this.setState({chartComponents: updatedComponent});
      } else {
        this.setState({chartComponents: [...this.state.chartComponents, { component, ...dropLocation, id: ++componentCounter }]});
      }
    } else {
        this.setState({chartComponents: [...this.state.chartComponents, { component, ...dropLocation, id: ++componentCounter }]});
    }
  }

  addConnectorLines = (coordinates) => {
    this.setState({
      chartComponents: [
        ...this.state.chartComponents, 
        { 
          component: ComponentConnector, 
          coordinates, 
          id: ++componentCounter,
        }
      ]
    });
  }

  updateComponentDragPosition = (id, latestCoordinates) => {
    let updateComponent = false;
    let chartComponents = this.state.chartComponents.map(function (component) {
      if ('coordinates' in component) {
        let foundParent = { ...component };
        foundParent.coordinates.forEach(function (componentCoordinate) {
          if (componentCoordinate.id === id) {
            if (componentCoordinate.x !== latestCoordinates.x && componentCoordinate.y !== latestCoordinates.y) {
              componentCoordinate.x = latestCoordinates.x + (latestCoordinates.width / 2);
              componentCoordinate.y = latestCoordinates.y;
              updateComponent = true;
            }
          }
        });

        return foundParent;
      }

      return component;
    });

    if (updateComponent) {
      this.setState({chartComponents});
    }
  }

  removeComponent = (e) => {
    if (e.which === 46) {
      let updatedComponents;
      this.componentToBeDeleted = window.selectedComponent;
      updatedComponents = this.state.chartComponents.filter((component) => { 
        if (component.id !== this.componentToBeDeleted) {
          return true;
        }

        return false;
      });
      this.setState({chartComponents: updatedComponents});
      window.componentConnector = [];
    }
  }
  
  render() {
    const { connectDropTarget, isOver, canDrop, draggedItem } = this.props;

    return connectDropTarget(
      <div style={this.state.rectStyle} className='drawing-board' onClick={this.removeComponent}>
        <svg>
          {
            this.state.chartComponents.map((componentDetails, index) => {
              let Component = componentDetails.component,
                componentName = componentDetails.componentName;
              if (componentName === 'Condition' || componentName === 'End') {
                let NewComp;
                if (componentName === 'Condition') {
                  NewComp = DragSource('Condition', cardSource, collectCondition)(Condition);
                } else if (componentName === 'End') {
                  NewComp = DragSource('End', endCardSource, endCardCollect)(End);
                }

                return <NewComp 
                        forDisplayOnly={false} 
                        x={componentDetails.x - this.state.currentComponentOffset.x} 
                        y={componentDetails.y} 
                        id={componentDetails.id} 
                        key={index}
                        updateComponentDragPosition={this.updateComponentDragPosition} />
              } else {
                return <Component 
                          key={index} 
                          coordinates={componentDetails.coordinates} 
                          startingPoint={this.state.currentComponentOffset} 
                          id={componentDetails.id} />
              }
            })
          }
        </svg>
      </div>
    );
  }
}

export default DropTarget(['Condition', 'End'], squareTarget, collect)(DrawingBoard);
