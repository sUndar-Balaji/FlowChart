import React, { Component } from 'react';
import MouseBackend from 'react-dnd-mouse-backend';
import { DragDropContext, DragSource } from 'react-dnd';
import Condition from './chart-components/condition';
import End from './chart-components/end';
import DrawingBoard from './chart-components/DrawingBoard';
import CustomDragLayer from './chart-components/CustomDragLayer';
import './App.css';

class FlowChartContainer extends Component {
  constructor() {
    super();
    this.state = {
      svgStyle: {
        width: '800px',
        height: '600px',
        backgroundColor: '',
      },
      elementsWrapper: {
        transform: 'translate(10px, 10px)',
        WebkitTransform: 'translate(10px, 10px)',
        height: '800',
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="elementsContainer">
          <svg width='200px' height='300px'>
            <Condition forDisplayOnly={true} />
            <End forDisplayOnly={true} />
          </svg>
          <CustomDragLayer />
        </div>
        <DrawingBoard />
      </div>
    );
  }
}

export default DragDropContext(MouseBackend)(FlowChartContainer);
