import React from 'react';
import { connect } from 'react-redux';
import CustomButton from '../custom-button/custom-button.component.jsx';
import { addItem }from '../../redux/cart/cart.actions.js';

import './collection-item.styles.scss';
import * as amplitude from '@amplitude/analytics-browser';

const CollectionItem = ({item, addItem}) => {
    const {name, price, imageUrl} = item;


    const addItemToCart = (item) => {
      addItem(item);
       const eventProperties = {
         product: item,
         };
      amplitude.track('Added product to cart', eventProperties);
    }
   


    return (
      <div className="collection-item">
        <div
          className="image"
          style={{
            backgroundImage: `url(${imageUrl})`
          }}
        />
        <div className="collection-footer">
          <span className="name"> {name} </span>
          <span className="price"> {price} </span>
        </div>

        <CustomButton onClick={() => addItemToCart(item)} inverted>Add to cart</CustomButton>
      </div>
    );
}

const mapDispatchToProps = dispatch => ({
    addItem: item => dispatch(addItem(item))
})

export default connect(null, mapDispatchToProps) (CollectionItem);