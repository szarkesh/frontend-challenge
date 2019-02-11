import React from 'react'
import courses from '../data/courses'
import Cart from './Cart.js'
import { DragDropContext } from 'react-dnd'
import DragButton from './DragButton'
import { DropTarget } from 'react-dnd'

//Main class to represent courses and handle showing descriptions, dragging
//courses to the cart
class Courses extends React.Component {
    constructor(props) {
        super(props);

        // fetches API (not working, waiting on response from Cameron)
        // var credits = []
        // var requests = []
        // for (var i=0; i<courses.length; i++){
        //   var searchReq = 'https://api.pennlabs.org/registrar/search?q=' + courses[i].dept + "-" + courses[i].number.toString();
        //   var apiRequest = fetch(searchReq).then(function(response){
        //         return response.json()
        //   });
        //   requests.push(apiRequest);
        // }
        // console.log("number of requests" + requests.length);

        // var output = [];
        // Promise.all(requests).then(
        //     function(values){
        //     for (var i=0; i<values.length; i++){
        //       output.push(values[i])
        //     }
        //     return output;
        //   });
        //
        // console.log(output);

        this.state = {
            popup: false,
            courseClicked: 0,
            coursesInCart: [],
            removeButtons: [],
            credits: [],
            search: "",
        };

    }

    // when item dropped in the cart, adds the course to cart
    dropItem(e){
      this.addCourseToCart(e);
    }

    // updates the state to have description open for course passed in
    // actual rendering done in render()
    openCourseDescription(number){
      this.setState(state => ({
						popup: true,
            courseClicked: number
				}));
    }

    //closes any description that may be open
    closeCourseDescription(){
      this.setState(state => ({
            popup: false,
            courseClicked: 0
        }));
    }

    //adds a course, given by its number, to the cart
    addCourseToCart(number){
      if(this.state.coursesInCart.indexOf(number)>=0){ // if already in cart return
        return;
      }
      var current = this.state.coursesInCart;
      current.push(number)
      this.setState(state => ({
            coursesInCart: current
        }));
    }

    //removes a course, given by its number, from the cart
    removeCourseFromCart(number){
        this.setState(state => ({
              coursesInCart: this.state.coursesInCart.filter(i => i != number)
          }));
    }

    //updates the search query state and closes any open descriptions when search
    //query changed
    handleSearchChange(event){
      this.setState({popup:false, courseClicked:0, search: event.target.value});
      this.forceUpdate()
    }

    //renders the course cart, as well as the course list
    render(){
        return(
          <div>
            <Cart courses={this.state.coursesInCart} key={this.state.coursesInCart} onChange={this.removeCourseFromCart.bind(this)}/>
            <div class="search">
                <div style={{fontWeight: 'bold'}}> Available courses: </div>
                <input style={{fontSize: '1em', padding: '5px 10px', marginBottom: '5px'}} type="text" placeholder="Filter courses..." onChange={this.handleSearchChange.bind(this)}/>
            </div>
          <div class="container">
            {courses.map(({ dept, number, title, description, prereqs }) => (
              <div key={number.toString()}>
              { ((dept.toLowerCase()+" "+number.toString()).includes(this.state.search.toLowerCase())||
                title.toLowerCase().includes(this.state.search.toLowerCase())||
                description.toLowerCase().includes(this.state.search.toLowerCase())) &&
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
                            {this.state.coursesInCart.indexOf(number.toString())>=0
                                ? <button class="addRemoveButton" style={{backgroundColor: "#e74c3c"}} onClick={() => this.removeCourseFromCart(number.toString())}> Remove from cart</button>
                                : <button class="addRemoveButton" style={{backgroundColor: "#3498DB"}} onClick={() => this.addCourseToCart(number.toString())}> Add to cart</button>
                              }
                            </div>
                          </div>
                        : <DragButton key={1} name={dept + " " + number.toString()} id={number.toString()} course=<button>hi</button> handleDrop={(e)=> this.dropItem(e)} onClick={()=>this.openCourseDescription(number.toString())}/>
                      }
                    </div>
                  }
              </div>
            ))}
          </div>
          </div>

        )

    }
}
export default Courses;
