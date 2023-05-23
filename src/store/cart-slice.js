import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalQuantity: 0,
        changed: false,
    },
    reducers: {
        replaceCart(state, action) {
            //action.payload is an object response from Firebase
            state.totalQuantity = action.payload.totalQuantity
            state.items = action.payload.items;
        },

        addItemToCart(state, action) {
            const addingItem = action.payload;
            const existingItem = state.items.find(item => item.id === addingItem.id);
            state.totalQuantity++;
            if (!existingItem) {
                state.items.push({
                    id: addingItem.id,
                    price: addingItem.price,
                    quantity: 1,
                    totalPrice: addingItem.price,
                    title: addingItem.title
                })
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + addingItem.price
            }
            state.changed = true;
        },
        //When you hit the minus button on the shopping cart
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            //If quantity is 1 and therefore an item is removed from the cart
            if (existingItem.quantity === 1) {
                state.items = state.items.filter(item => item.id !== id)
                //if quantity is greater than 1, just need to reduce the quantity by 1
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
            state.changed = true;
        }
    }
});

export const cartActions = cartSlice.actions;
export default cartSlice;