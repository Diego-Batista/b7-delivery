import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Cart.module.css';
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';
import Head from 'next/head';
import Header from '../../components/Header';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { useFormatter } from '../../libs/useFormatter';
import { CartItem } from '../../types/CartItem';
import { useRouter } from 'next/router';

const Cart = (data: HomeProps) => {
  const { setToken, setUser } = useAuthContext(); 
  const { tenant, setTenant } = useAppContext();
  
  
  const formartter = useFormatter();
  const router = useRouter();

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    if(data.user) setUser(data.user);
  }, [])

  // product control
  const [cart, setCart] = useState<CartItem[]>(data.cart)

  // Shipping
  const [ shippingInput, SetShippingInput ] = useState('');
  const [shippingAddress, SetShippingAddress] = useState('');
  const [ shippingPrice, SetShippingPrice] = useState(0);
  const [ shippingTime, SetShippingTime] = useState(0);
  const handleShippingCalc = () => {
    SetShippingAddress('Rua das Flores - Jardins da Serra - Campina Pequena')
    SetShippingPrice(9.50)
    SetShippingTime(20)
  }

  // Resume
  const [ subtotal, setSubtotal ] = useState(0);
  useEffect(() => {
    let sub = 0;
    for(let i in cart) {
      sub += cart[i].product.price * cart[i].qt
    }
    setSubtotal(sub)

  }, [cart])
  const handleFinish = () => {
    router.push(`/${data.tenant.slug}/checkout`)
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Sacola | {data.tenant.name}</title>
      </Head>

      <Header
        backHref={`/${data.tenant.slug}`}
        color={data.tenant.mainColor}
        title="Sacola"
      />

      <div className={styles.productsQuantity}>
        {cart.length} {cart.length === 1 ? 'item': 'itens'}
      </div>

      <div className={styles.productsList}>

      </div>

      <div className={styles.shippingArea}>
        <div className={styles.shippingTitle}>Calcular frete e prazo</div>
        <div className={styles.shippingForm}>
          <InputField
            color={data.tenant.mainColor}
            placeholder="Digite seu cep"
            value={shippingInput}
            onChange={newValue => SetShippingInput(newValue)}
          />
          <Button
            color={data.tenant.mainColor}
            label="OK"
            onClick={handleShippingCalc}
          />
        </div>
      </div>

      {shippingTime > 0 && 
        <div className={styles.shippingInfo}>
          <div className={styles.shippingAddress}>{shippingAddress}</div>
          <div className={styles.shippingTime}>
            <div className={styles.shippingTimeText}>Receba em até {shippingTime} minutos</div>
            <div 
              className={styles.shippingPrice}
              style={{color: data.tenant.mainColor}}
            >
              {formartter.formatPrice(shippingPrice)}
            </div>
          </div>
        </div>
      }
      <div className={styles.resumeArea}>
        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formartter.formatPrice(subtotal)}</div>
        </div>
        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formartter.formatPrice(shippingPrice) : '--'}</div>
        </div>
        <div className={styles.resumeLine}></div>
        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div className={styles.resumeRightBig} style={{color: data.tenant.mainColor}}>{formartter.formatPrice(shippingPrice + subtotal)}</div>
        </div>
        <div className={styles.resumeButton}>
          <Button
            color={data.tenant.mainColor}
            label="Continuar"
            onClick={handleFinish}
            fill
          />
        </div>
      </div>

    </div>
  );
}

export default Cart;

interface HomeProps {
  tenant: Tenant;
  token: string;
  user: User | null;
  cart: CartItem[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query;
  const api = useApi(tenantSlug as string);

  // Get Tenant
  const tenant = await api.getTenant();
  if(!tenant) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // Get Logged user
  //const token = context.req.cookies.token;
  const token = getCookie('token', context) ;
  const user = await api.authorizeToken(token as string);

  // Get Cart Products
  const cartCookie = getCookie('cart', context);
  const cart = await api.getCartProducts(cartCookie as string)


  return {
    props: {
      tenant,
      user,
      token,
      cart
    }
  }
}