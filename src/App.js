import React, { Component } from 'react';
import MouseBackend from 'react-dnd-mouse-backend';
import { DragDropContext, DragSource } from 'react-dnd';
import Condition from './chart-components/condition';
import End from './chart-components/end';
import DrawingBoard from './chart-components/DrawingBoard';
import CustomDragLayer from './chart-components/CustomDragLayer';
import './App.css';

var flowchartData = [{
  childrens: [],
  componentName: 'Condition',
  id: 1,
  statement: 'statement',
  x: 542,
  y: 115,
}, {
  childrens: [],
  componentName: 'Condition',
  id: 2,
  statement: 'new label',
  x: 334,
  y: 280,
}, {
  componentName: 'Connector',
  coordinates: [{
    x: 592,
    y: 165,
    id: 1,
    componentName: 'Condition',
    componentValue: 'statement',
    position: 'left',
  }, {
    id: 2,
    x: 384,
    y: 280,
    position: 'top',
  }],
  id: 3,
}];

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
      },
      flowchartData
    }
  }

  render() {
    return (
      <div className="container">
        <div className="elementsContainer">
          <div>
            Flowchart Components
          </div>
          <br/>
          <svg width='200px' height='300px'>
            <Condition forDisplayOnly={true} />
            <End x={50} y={85} forDisplayOnly={true} />
          </svg>
          <CustomDragLayer />
        </div>
        <DrawingBoard flowchartData={this.state.flowchartData} />
      </div>
    );
  }
}

export default DragDropContext(MouseBackend)(FlowChartContainer);
