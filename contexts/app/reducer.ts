import { DataType, ActionType, Actions} from './types';

export const reducer = (state: DataType, action: ActionType) => {
    switch(action.type) {
        case Actions.SET_TENANT:
            return {...state, tenant: action.payload.tenant};
            break;
        case Actions.SET_SHIPPING_ADDRESS:
            return {...state, shippingAddress: action.payload.shippingAddress};
            break;
        case Actions.SET_SHIPPING_PRICE:
            return {...state, shippingPrice: action.payload.shippingPrice};
            break;
        default: return state;
    }
}