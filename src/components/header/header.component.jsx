import React, { Children } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { auth } from "../../firebase/firebase.utils.js";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import CartIcon from "../cart-icon/cart-icon.component";
import CartDropdown from "../cart-dropdown/cart-dropdown.component.jsx";
import { selectCartHidden } from "../../redux/cart/cart.selectors.js";
import { selectCurrentUser } from "../../redux/user/user.selector.js";

import "./header.styles.scss";
import * as amplitude from '@amplitude/analytics-browser';

const SignOut = () => {
  auth.signOut();
  amplitude.track('Signed Out');
}

const ExternalLink = ({ href, children }) => {
  amplitude.track('Clicked on contact');

  return (
    <a className="option" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const Header = ({ currentUser, hidden }) => (
  <div className="header">
    <Link className="logo-container" to="/">
      <Logo className="logo" />
    </Link>

    <div className="options">
      <Link className="option" to="/shop">
        SHOP
      </Link>

      <ExternalLink href="https://amplitude.com/sales-contact">
        CONTACT
      </ExternalLink>

      {currentUser ? (
        <div className="option" onClick={() => SignOut()}>
          SIGN OUT
        </div>
      ) : (
        <Link className="option" to="/signin">
          SIGN IN
        </Link>
      )}
      <CartIcon />
    </div>
    {hidden ? null : <CartDropdown />}
    <p className="king">&#169 2021</p>
  </div>
);

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden,
});

export default connect(mapStateToProps)(Header);
