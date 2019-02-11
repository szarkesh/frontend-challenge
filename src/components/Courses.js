import React from 'react'
import courses from '../data/courses'
import Cart from './Cart.js'
import { DragDropContext } from 'react-dnd'
import DragButton from './DragButton'
import { DropTarget } from 'react-dnd'

class Courses extends React.Component {
    constructor(props) {
        super(props);

        var credits = []
        var requests = []
        for (var i=0; i<courses.length; i++){
          var searchReq = 'https://api.pennlabs.org/registrar/search?q=' + courses[i].dept + "-" + courses[i].number.toString();
          var apiRequest = fetch(searchReq).then(function(response){
                return response.json()
          });
          requests.push(apiRequest);
        }
        console.log("number of requests" + requests.length);
        var output = [];

        Promise.all(requests).then(
            function(values){
            for (var i=0; i<values.length; i++){
              output.push(values[i])
            }
            return output;
          });

        console.log(output);
        // for (var i=0; i<courses.length; i++){
        //     var searchReq = 'https://api.pennlabs.org/registrar/search?q=' + courses[i].dept + "-" + courses[i].number.toString();
        //     console.log(searchReq);
        //     fetch(searchReq)
        //         .then(
        //           function(response) {
        //             if (response.status !== 200) {
        //               console.log('Looks like there was a problem. Status Code: ' +
        //                 response.status);
        //               return;
        //             }
        //
        //             // Examine the text in the response
        //             response.json().then(function(data) {
        //               console.log(searchReq)
        //               console.log(data);
        //               credits.append(data.courses[0].credits)
        //             });
        //           }
        //         )
        //         .catch(function(err) {
        //           console.log('Fetch Error :-S', err);
        //         });
        // }
        //console.log(this.state.credits);

        this.state = {
            popup: false,
            courseClicked: 0,
            coursesInCart: [],
            removeButtons: [],
            credits: [],
            search: "",
        };

    }

    dropItem(e){
      this.addCourseToCart(e);
    }
    setPopupTrue(number){
      if(number == this.state.courseClicked){
        this.setState(state => ({
  						popup: false,
              courseClicked: 0
  				}));
      }

      else{
        this.setState(state => ({
  						popup: true,
              courseClicked: number
  				}));
      }
    }

    closePopup(){
      this.setState(state => ({
            popup: false,
            courseClicked: 0
        }));
    }

    addCourseToCart(number){
      console.log("TRYING TO ADD" + number);
      if(this.state.coursesInCart.indexOf(number)>=0){
        console.log("course already in cart");
        return;
      }
      var current = this.state.coursesInCart;
      current.push(number)
      this.setState(state => ({
            coursesInCart: current
        }));
      console.log("after adding" + this.state.coursesInCart)
    }

    removeCourseFromCart(number){
        console.log("what the courses should be"  + this.state.coursesInCart.filter(i => i != number));
        this.setState(state => ({
              coursesInCart: this.state.coursesInCart.filter(i => i != number)
          }));
    }

    handleSearchChange(event){
      this.setState({popup:false, courseClicked:0, search: event.target.value});
      this.forceUpdate()
      console.log(this.state.value);
    }
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
                        ?   <div class="courseDescription" style={{borderRadius: "5px"}} onClick={() => this.setPopupTrue(number.toString())}>
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
                        : <DragButton key={1} name={dept + " " + number.toString()} id={number.toString()} course=<button>hi</button> handleDrop={(e)=> this.dropItem(e)} onClick={()=>this.setPopupTrue(number.toString())}/>
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
