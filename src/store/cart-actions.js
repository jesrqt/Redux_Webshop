import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";


export const fetchCartData = () => {
    return async (dispatch) => {

        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_FIREBASE_URL}cart.json`);
            
            if (!response.ok) {
                throw new Error('Retrieving cart data failed!');
            };
            
            const jsonResponse = await response.json();
            return jsonResponse;
        };

        try {
            const cartData = await fetchData();
            dispatch(cartActions.replaceCart({
                items: cartData.items || [], // If cartData.items is falsy, provide an empty array
                totalQuantity: cartData.totalQuantity
            }));

        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Retrieving cart data failed'
            }))
        };
    }
}


//action creators that returns a thunk
export const sendCartData = (cart) => {
    // returns a thunk with dispatch as an argument.
    // dispatch argument makes it possible for the useEffect to dispatch the thunk
    return async (dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'Sending...',
            message: 'Sending cart data!'
        }));

        const sendRequest = async () => {
            const response = await fetch(`${process.env.REACT_APP_FIREBASE_URL}cart.json`, {
                method: 'PUT',
                body: JSON.stringify(cart),
            });

            if (!response.ok) {
                throw new Error('Sending cart data failed');
            };
        };

        try {
            await sendRequest();

            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success!',
                message: 'Sent cart data successfully',
            }))

        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sending cart data failed!',
            }))
        }
    };
};