import React from 'react'
import courses from '../data/courses'
import jsPDF from 'jspdf'
import DragButton from './DragButton'
import { DropTarget } from 'react-dnd'
import DraggableCartComponent from './DraggableCartComponent'


function collect(connect, monitor){
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem()
  }
}
// <button class = "cartElementButton">{dept} {number}: {title}</button>
class Cart extends React.Component{
  constructor(props) {
      super(props);
          console.log("reinstantiating cart")
          this.state = {
            courseList: props.courses,
          };
        }



  moveCard (dragIndex, hoverIndex){
    console.log("card moved!");
    console.log(hoverIndex);
    console.log(dragIndex);
    const dragCard = this.state.courseList[dragIndex]
    const currentOrder = this.state.courseList;
    var cardToPutBack = currentOrder.splice(dragIndex,1);
    console.log("Card to put back" + cardToPutBack);
    currentOrder.splice(hoverIndex, 0, cardToPutBack[0]);
    console.log(currentOrder);
    this.setState(state => ({
            courseList: currentOrder

        }));
    // this.setS  tate(state => ({
    //         cards: {
    //           $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    //         },
    //
    //     }));
    // const { cards } = this.state;
    // const dragCard = cards[dragIndex]
    //
    //
    // this.setState(state => ({
    //         cards: {
    //           $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    //         },
    //
    //     }));
  }
  export(){
      var doc = new jsPDF();
      doc.setFontType("bold");
      doc.text('Course List', 20, 20);
      doc.setFontType("normal");
      var y=35;
      for(var i = 0, textlength = this.state.courseList.length ; i < textlength ; i++) {
          var courseInfo = courses.find(obj => {return obj.number.toString() == this.state.courseList[i]})
          var splitTitle = doc.splitTextToSize(courseInfo.description, 180);
          //loop thru each line and output while increasing the vertical space
          doc.setFontSize(15);
          doc.text(20, y, "CIS " + this.state.courseList[i] + ": " + courseInfo.title);
          y= y+5;
          doc.setFontSize(10);
          for(var c = 0, stlength = splitTitle.length ; c < stlength ; c++){
              doc.text(20, y, splitTitle[c]);
              y = y + 4;

          }
          doc.setDrawColor(200,200,200);
          doc.line(20, y, 160, y);
          y=y+8;

          if (y>240){
            y=35;
            doc.addPage();
          }

      }
      doc.save('a4.pdf');
  }

  changeHandler(e){
    if (typeof this.props.onChange === 'function') {
            this.props.onChange(e.target.value);
        }
  }

  render(){
    console.log("rerendering cart");
    if (this.state.courseList.length ==0){
      const {connectDropTarget, hovered, item} = this.props
      const backgroundColor = hovered ? 'lightgreen' : 'white' ;
      this.moveCard = this.moveCard.bind(this);
      return connectDropTarget(

      <div style={{
        marginTop: '1.5rem',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        background: backgroundColor,
        padding: '1rem',
        marginBottom: '1.5rem',
        borderRadius: '4px',
      }}>
        <h4>Course Cart</h4>

        <p>Your cart is currently empty! Drag courses here to add them, or click to see descriptions.</p>
      </div>)
    }
    else{
      console.log("CURRENT COURSES are " + this.state.courseList);
      const {connectDropTarget, hovered, item} = this.props
      const backgroundColor = hovered ? 'lightgreen' : 'white' ;
      this.moveCard = this.moveCard.bind(this);
      var coursesToShow = [];
      for (var i=0; i<this.state.courseList.length; i++){
        const getCourse = courses.filter(course => course.number.toString() == this.state.courseList[i])[0];
        coursesToShow.push(getCourse)
      }
      console.log("Course length" + coursesToShow[0].number);
      return connectDropTarget(
        <div style={{
          marginTop: '1.5rem',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          background: backgroundColor,
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
            <div>
              <div class="leftRight">
                <b>Course Cart</b>
                <div style={{marginLeft: "50px", color: "gray"}}> (drag around courses to reorder your preferences) </div>
              </div>
              {coursesToShow.map(({ dept, number, title, description },i) => (
                <div key={number.toString()}>
                  <div class= "cart">
                      <div style={{color: 'gray', fontSize:'0.8em'}}>{i+1}</div>
                      <DraggableCartComponent key = {number.toString()} index = {i} id = {number.toString()} text = {dept + " " + number + ": " + title} moveCard = {this.moveCard} />
                      <button class = "removeButton" onClick= {() => this.props.onChange(number.toString())}> &times; </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
                <button class = "exportButton" onClick={() => this.export()}> Export Course List &rarr;</button>
            </div>
        </div>
      )
    }
  }
}
export default DropTarget('course', {}, collect)(Cart)
