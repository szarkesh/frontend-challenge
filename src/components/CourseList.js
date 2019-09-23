import courses from '../data/courses'
import React from 'react';
import { DragDropContext } from 'react-dnd'
import DragButton from './DraggableCourseButton'
import { DropTarget } from 'react-dnd'
import {Modal} from 'react-materialize'
import ModalCourseDescription from './ModalCourseDescription';

//The Cart class represents the 'cart' section of the UI, and contains
//functions to export to PDF.
//Cart takes in as a prop the current course list, as determined by courses.js
class Courses extends React.Component{

  constructor(props) {
      super(props);
      console.log("hi");
      this.state = {
        courseClicked:-1,
        popup: false,
      }
  }

  // updates the state to have description open for course passed in
  // actual rendering done in render()
  openCourseDescription(number){
    this.setState(state => ({
          popup: true,
          courseClicked: number
      }));
  }

  closeCourseDescription(number){
    this.setState(state => ({
          popup: false,
          courseClicked: -1
      }));


  }

  render(){
    var query = this.props.search.toLowerCase();
    console.log(this.props.coursesInCart);
    return (
      <div>
          <ModalCourseDescription/>
          <div class="container">
              {courses.map(({ dept, number, title, description, prereqs }) => (
                <div key={number.toString()}>
                { ((dept.toLowerCase()+" "+number.toString()).includes(query)||
                  title.toLowerCase().includes(query)||
                  description.toLowerCase().includes(query)) &&
                  <div>
                      { number.toString() == this.state.courseClicked
                        ?   <div class="courseDescription" style={{borderRadius: "5px"}} onClick={() => this.closeCourseDescription()}>
                            <div class="leftRight">
                                <p> <b>{dept} {number}: {title}</b> </p>
                                {(prereqs!=undefined) &&
                                <p>{"Prerequisites: " + prereqs.toString()}</p>}
                            </div>
                            <p>{description} </p>
                            <div style={{textAlign: "center"}}>
                            {this.props.coursesInCart.indexOf(number.toString())>=0
                                ? <button class="addRemoveButton" style={{backgroundColor: "#e74c3c"}} onClick={() => this.props.removeCourseFromCart(number.toString())}> Remove from cart</button>
                                : <button class="addRemoveButton" style={{backgroundColor: "#3498DB"}} onClick={() => this.props.addCourseToCart(number.toString())}> Add to cart</button>
                              }
                            </div>
                          </div>
                        : <DragButton inCart={this.props.coursesInCart.includes(number.toString())} key={1} name={dept + " " + number.toString()} id={number.toString()} course=<button>hi</button> handleDrop={(e)=> this.props.addCourseToCart(e)} onClick={()=>this.openCourseDescription(number.toString())}/>
                      }
                      </div>
                    }
                </div>
              ))}
          </div>
      </div>
    );
  }

}
export default Courses; // the cart component as a whole is a drop target for courses
