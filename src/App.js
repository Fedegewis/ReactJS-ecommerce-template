import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import HomePage from './pages/homepage/homepage.component'
import ShopPage from './pages/shop/shop.component'
import CheckoutPage from './pages/checkout/checkout.component'

import SignInAndSignUp from './pages/sign-in-sign-up/sign-in-sign-up.component'
import Header from './components/header/header.component'

import { createStructuredSelector } from 'reselect';
import { auth, createUserProfileDocument } from "./firebase/firebase.utils.js";
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selector';

import "./App.css";

import { ampli } from './ampli/index.ts';
import * as braze from "@braze/web-sdk";

class App extends React.Component{
  unsubscribeFromAuth = null

  componentDidMount(){
    const {setCurrentUser} = this.props
    

    //---------------------------------------------AMPLITUDE-----------------------------------------------------------
    const AMPLITUDE_API_KEY = '0265e5f320a74be0ca52d7fc0320a62b';
  
    
    ampli.load({client:{apiKey:AMPLITUDE_API_KEY}})
    ampli.client.setUserId('21321343');

    //---------------------------------------------AMPLITUDE-----------------------------------------------------------

    //--------------------------------------BRAZE----------------------------------------------------------------------
    braze.initialize('0431d032-d354-4af8-8f9d-6b06c21bd3d6', {
      baseUrl: "sdk.iad-06.braze.com"
    });
    braze.openSession();
    braze.changeUser("FEDE_123");
    braze.getUser().setEmail("federico.gewisgold@productminds.io");
    braze.requestPushPermission();
    if(braze.isPushSupported() === true){
      braze.isPushPermissionGranted();
      
    }

    
    //--------------------------------------BRAZE----------------------------------------------------------------------

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth){
        const userRef = await createUserProfileDocument(userAuth)

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          })
        });
      }
      
      setCurrentUser(userAuth)
      
    })
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth()
  }

  render(){
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path='/checkout' component={CheckoutPage} />
          <Route 
          exact
          path="/signin" 
          render={() => 
            this.props.currentUser ? (

              <Redirect to='/' />
              ) : (
                <SignInAndSignUp/>
                )
              } 
            />
        </Switch>
      </div>
    )
  }  
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
}) 

const mapDispatchToProps = dispatch =>({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
