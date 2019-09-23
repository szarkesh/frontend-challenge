import React from 'react';
import {Modal, Button} from 'react-materialize';

class ModalCourseDescription extends React.Component{
  render(){
    var dept, number, title, description, prereqs;
    ({dept, number, title, description,prereqs} = this.props.courseInfo);
    return (<Modal trigger=<Button> test </Button>>
                <div class="courseDescription" style={{borderRadius: "5px"}} onClick={() => this.closeCourseDescription()}>
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
            </Modal>);
  }
}

//uses flow class to allow for same object to be drag source and drag target
//since we need to drag these buttons over each other to change the order.
export default ModalCourseDescription;
