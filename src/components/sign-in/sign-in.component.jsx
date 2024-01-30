import React from 'react';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import {auth, signInWithGoogle} from '../../firebase/firebase.utils.js';
import './sign-in.styles.scss';
import { ampli } from '../../ampli/index.js';

class SignIn extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            email: '',
            password: ''
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        const {email, password} = this.state;

        try{
          await auth.signInWithEmailAndPassword(email, password);
          this.setState({ email: "", password: "" });
        }catch(error){
          console.log(error)
        }
    }
    handleSignIn = () => {
      ampli.loginCompleted({Tipo : "Email/Password"});
    }
    
    handleSignInWithGoogle = () => {
      signInWithGoogle();
      ampli.loginCompleted({Tipo:"Google"});
    }
    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    render(){
        return (
          <div className="sign-in">
            <h2>I already have an account</h2>
            <span>Sign in with your email and password</span>

            <form onSubmit={this.handleSubmit}>
              <FormInput
                name="email"
                type="email"
                handleChange={this.handleChange}
                value={this.state.email}
                label="email"
                required
              />

              <FormInput
                name="password"
                type="password"
                value={this.state.password}
                handleChange={this.handleChange}
                label="password"
                required
              />
              <div className='buttons' >
                <CustomButton onClick={()=> this.handleSignIn()} type="submit"> Sign In </CustomButton>
                <CustomButton onClick={()=> this.handleSignInWithGoogle()} isGoogleSignIn > Sign in with Google </CustomButton>
              </div>
            </form>
          </div>
        );
    }
}

export default SignIn;