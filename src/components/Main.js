import React from 'react'
import Cart from './Cart.js'
import Courses from './CourseList'
import {Modal, Button} from 'react-materialize'

//Main class to represent courses and handle showing descriptions, dragging
//courses to the cart
class Main extends React.Component {
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
            <Courses search={this.state.search} coursesInCart={this.state.coursesInCart} addCourseToCart = {this.addCourseToCart.bind(this)} removeCourseFromCart = {this.removeCourseFromCart.bind(this)}/>
          </div>

        )

    }
}
export default Main;
