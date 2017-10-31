import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import Condition from './condition';
import End from './end';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};  

function getItemStyles(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

class CustomDragLayer extends Component {
  renderItem(type, item) {
    switch (type) {
      case 'Condition':
        return (
          <Condition forDisplayOnly={true} />
        );
        break;
      case 'End':
        return (
          <End forDisplayOnly={true} />
        );
        break;
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          <svg>
            {this.renderItem(itemType, item)}
          </svg>
        </div>
      </div>
    );
  }
}

function collectDragLayer(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export default DragLayer(collectDragLayer)(CustomDragLayer);