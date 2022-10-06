import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import Header from '../../../components/Header';
import { Qauntity } from '../../../components/Quantity';
import { useAppContext } from '../../../contexts/app';
import { useApi } from '../../../libs/useApi';
import { useFormatter } from '../../../libs/useFormatter';
import styles from '../../../styles/Product-id.module.css';
import { CartCookie } from '../../../types/CartCookie';
import { Product } from '../../../types/Product';
import { Tenant } from '../../../types/Tenant';


const Product = (data: HomeProps) => {
  const [qtCount, setQtCount] = useState(1);
  const { tenant, setTenant } = useAppContext();

  const router = useRouter();

  const formartter = useFormatter();

  const handleAddToCart = () => {
    let cart: CartCookie[] = [];

    // Create or get existing cart
    if(hasCookie('cart')) {
      const cartCookie = getCookie('cart');
      const cartJson: CartCookie[] = JSON.parse(cartCookie as string);
      for(let i in cartJson) {
        if(cartJson[i].qt && cartJson[i].id){
          cart.push(cartJson[i])
        }
      }
    }

    // Search product in cart
    const cartIndex = cart.findIndex(item => item.id === data.product.id);
    if(cartIndex > -1) {
      cart[cartIndex].qt += qtCount
    }  else {
      cart.push({ id: data.product.id, qt: qtCount})
    }

    // Seting cookie
    setCookie('cart', JSON.stringify(cart));

    router.push(`/${data.tenant.slug}/cart`)
  }

  const handleUpdateQt = (newCount: number) => {
    setQtCount(newCount);
  }

  useEffect(() => {
    setTenant(data.tenant);
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{data.product.name} | {data.tenant.name}</title>
      </Head>

      <div className={styles.headerArea}>
        <Header
            color={data.tenant.mainColor}
            backHref={`/${data.tenant.slug}`}
            title="Produto"
            invert
        />
      </div>

      <div className={styles.haderBg} style={{backgroundColor: data.tenant.mainColor}}>

      </div>

      <div className={styles.productImage}>
        <img src={data.product.image} alt="Imagem do produto selecionado" />
      </div>

      <div className={styles.category}>
        {data.product.categoryName}
      </div>

      <div className={styles.title} style={{borderColor: data.tenant.mainColor}}>{data.product.name}</div>

      <div className={styles.line}></div>

      <div className={styles.description}>{data.product.description}</div>

      <div className={styles.qtText}>Quantidade</div>

      <div className={styles.area}>
        <div className={styles.areaLeft}>
          <Qauntity
            color={data.tenant.mainColor}
            count={qtCount}
            onUpdateCount={handleUpdateQt}
            min={data.product.min}
            max={data.product.max}
            
          />
        </div>
        <div className={styles.areaRight} style={{color: data.tenant.mainColor}}>{formartter.formatPrice(data.product.price)}</div>
      </div>

      <div className={styles.buttonArea}>
        <Button
          label='Adicionar a sacola'
          fill
          color={data.tenant.mainColor}
          onClick={handleAddToCart}
        />
      </div>

    </div>
  );
}

export default Product;

interface HomeProps {
  tenant: Tenant;
  product: Product;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug, id } = context.query;
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

  // Get Products
  const product = await api.getProduct(parseInt(id as string));

  return {
    props: {
      tenant,
      product
    }
  }
}