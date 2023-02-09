import { Address } from "../types/Address";
import { CartItem } from "../types/CartItem";
import { Product } from "../types/Product";
import { Tenant } from "../types/Tenant";
import { User } from "../types/User";

const TempyOneProduct: Product = {
    id: 1,
    image: "/tmp/burguer.png",
    categoryName: "Tradicional",
    name: "Texas Burger",
    price: 25.50,
    min: 1,
    max: 20,
    description: "2 Blends de carne de 150g, Queijo Cheddar, Bacon Caramelizado, Salada, Molho da casa, Pão brioche artesanal"
}

export const useApi = (tenantSlug: string) => ({

    getTenant: (): boolean | Tenant => {
        switch(tenantSlug) {
            case 'b7Burguer':
                return {
                    slug: 'b7Burguer',
                    name: 'b7Burguer',
                    mainColor: '#FB9400',
                    secondColor: '#fff9f2',
                    image: "/tmp/logo.png",
                }
                break;
            case 'b7Pizza':
                return {
                    slug: 'b7Pizza',
                    name: 'b7Pizza',
                    mainColor: '#6AB70A',
                    secondColor: '#E0E0E0',
                    image: "/tmp/logopizza.png",
                }
                break;
            default: return false;
        }

    },

    getAllProducts: async () => {
        let products = [];

        for(let q = 0; q < 10; q++) {
            products.push({
                ...TempyOneProduct,
                id: q + 1,
            })
        }

        return products
    },

    getProduct: async (id: number) => {
        return {...TempyOneProduct, id};
    },

    authorizeToken: async (token: string): Promise<User | false> => {
        if(!token) return false;

        return {
            name: 'Diego',
            email: 'diego@teste.com',
            avatar: 'https://github.com/Diego-Batista.png'
        }
    },

    getCartProducts: async (cartCookie: string) => {
        let cart: CartItem[] = [];
        if(!cartCookie) return cart;

        const cartJson = JSON.parse(cartCookie);
        for(let i in cartJson) {
            if(cartJson[i].id && cartJson[i].qt) {
                const product = {
                    ...TempyOneProduct,
                    id: cartJson[i].id
                };
                cart.push({
                    qt: cartJson[i].qt,
                    product
                })
            }
        }

        return cart;
    },

    getUserAddresses: async (email: string) => {
        const addresses: Address[] = [];

        for(let i=0;i<5;i++){
            addresses.push({
                id: i + 1,
                street: 'Rua das Flores',
                number: `${i + 1}00`,
                cep: '9999999',
                city: 'São Paulo',
                neighborhood: 'Jardins',
                state: 'Sp'
            })
        }

        return addresses;
    },

    getUserAddress: async (addressid: number) => {
        let address: Address = {
            id: addressid,
            street: 'Rua das Flores',
            number: `${addressid}00`,
            cep: '9999999',
            city: 'São Paulo',
            neighborhood: 'Jardins',
            state: 'Sp'
        }

        return address;
    },

    addUserAddress: async (address: Address) => {
        return { ...address, id: 9}
    },

    editUserAddress: async (newAddressData: Address) => {
        return true;
    },

    getShippingPrice: async function (address: Address) {
         return 9.16
    }

});