import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import {DragSource } from 'react-dnd'


const courseSource = {
  beginDrag(props) {
    return props.course
  },

  endDrag(props, monitor, component){
    if(!monitor.didDrop()){
      return;
    }
    return props.handleDrop(props.id)
  }
}

function collect(connect, monitor){
  return{
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}
class DragButton extends React.Component{
  render(){
    const {isDragging, connectDragSource, course} = this.props;
    return connectDragSource(
      <div>
        <button class="courseElementButton" onClick={this.props.onClick}>{this.props.name}</button>
      </div>
    );
  }
}
export default DragSource('course', courseSource, collect)(DragButton);
