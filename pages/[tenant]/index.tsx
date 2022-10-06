import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import ProductItem from '../../components/ProductItem';
import { SearchInput } from '../../components/SearchInput';
import { SideBar } from '../../components/SideBar';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Home.module.css';
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';
import NoIProductsIcon from '../../public/assets/noproducts.svg';

const Home = (data: HomeProps) => {
  const { setToken, setUser } = useAuthContext(); 
  const { tenant, setTenant } = useAppContext();
  const [products, setProducts] = useState<Product[]>(data.products);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    if(data.user) setUser(data.user);
  }, [])

  // Search
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  useEffect(() => {
    let newFilteredProducts: Product[] = [];
    for(let product of data.products) {
      if(product.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        newFilteredProducts.push(product);
      }
    }
    setFilteredProducts(newFilteredProducts);
  }, [searchText])
  

  const onClose = () => {

  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
            <div className={styles.headerTopLeft}>
                <div className={styles.headerTitle}>
                  Seja Bem-Vindo(a) 👋
                </div>
                <div className={styles.headerSubTitle}>
                  O que deseja pra hoje?
                </div>
            </div>
            <div className={styles.headerTopRigth}>
              <div className={styles.menuButton} onClick={() => setSideBarOpen(true)}>
                <div className={styles.menuButtonLine} style={{backgroundColor: tenant?.mainColor}}></div>
                <div className={styles.menuButtonLine} style={{backgroundColor: tenant?.mainColor}}></div>
                <div className={styles.menuButtonLine} style={{backgroundColor: tenant?.mainColor}}></div>
              </div>
              <SideBar
                tenant={data.tenant}
                open={sideBarOpen}
                onClose={() => setSideBarOpen(false)}
              />
            </div>
          </div>
          <div className={styles.headerBottom}>
              <SearchInput
                onSearch={handleSearch}
              />
          </div>
      </header>

      {searchText &&
        <>
          <div className={styles.searchText}>
            Procurando por: <strong>{searchText}</strong>
          </div>

          {filteredProducts.length > 0 &&
            <div className={styles.grid}>
              {filteredProducts.map(item => (
                <ProductItem 
                  key={item.id}
                  data={item}
                />
              ))}     
            </div>
          }

          {filteredProducts.length === 0 &&
            <div className={styles.noProducts}>
              <NoIProductsIcon color="#E0E0E0"/>
              <div className={styles.noProductsText}>
                Ops! Não há itens com este nome
              </div>
            </div>
          }
        </>
      }

      {!searchText &&
        <>
          <Banner/>

          <div className={styles.grid}>
            {products.map(item => (
              <ProductItem 
                key={item.id}
                data={item}
              />
            ))}     
          </div>
        </> 
      }
      
    </div>
  );
}

export default Home;

interface HomeProps {
  tenant: Tenant;
  products: Product[];
  token: string;
  user: User | null;
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


  // Get Products
  const products = await api.getAllProducts();

  return {
    props: {
      tenant,
      products,
      user,
      token
    }
  }
}