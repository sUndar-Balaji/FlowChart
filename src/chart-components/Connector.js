import React, { Component } from 'react';

class ComponentConnector extends Component {
	constructor() {
		super();
	}

	render() {
		const [initialPoint, endPoint] = this.props.coordinates;

		return (
			<line 
				x1={initialPoint.x - this.props.startingPoint.x} 
				y1={initialPoint.y - this.props.startingPoint.y} 
				x2={endPoint.x - this.props.startingPoint.x} 
				y2={endPoint.y - this.props.startingPoint.y} 
				strokeWidth='2px' 
				stroke='black' 
				/>
		);
	}
}

export default ComponentConnector;