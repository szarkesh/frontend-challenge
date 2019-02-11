import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import {findDOMNode} from 'react-dom'
import {DragSource, DropTarget, ConnectDropTarget, ConnectDragSource, DropTargetMonitor, DropTargetConnector, DragSourceConnector, DragSourceMonitor} from 'react-dnd'
import flow from 'lodash/flow'


const cardSource = {
  beginDrag(props){
    return{
      id: props.id,
      index: props.index,
    }
  }
}
const cardTarget = {
  hover(props, monitor, component){
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    if(dragIndex === hoverIndex){
      return;
    }

    const hoverBoundingRect = (findDOMNode(component,)).getBoundingClientRect()

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top)/2

    const clientOffset = monitor.getClientOffset();

    const hoverClientY =  clientOffset.y - hoverBoundingRect.top

    if(dragIndex < hoverIndex && hoverClientY< hoverMiddleY){
      return;
    }

    props.moveCard(dragIndex, hoverIndex)

    monitor.getItem().index = hoverIndex
  }
}

class DraggableCartComponent extends React.Component{
  render(){
    const{
      text,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props
    const opaque = isDragging ? 0 : 1;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(<button class = "cartElementButton" style={{opacity: opaque}}>{this.props.text}</button>)
      )
    )
  }
}

export default flow(
  DragSource(
    'cart',
    cardSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  ),

  DropTarget('cart', cardTarget, (connect) =>({
    connectDropTarget: connect.dropTarget(),
  }))
)(DraggableCartComponent)
