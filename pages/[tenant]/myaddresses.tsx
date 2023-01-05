import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Myaddresses.module.css';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';
import Head from 'next/head';
import Header from '../../components/Header';
import { useFormatter } from '../../libs/useFormatter';
import { useRouter } from 'next/router';
import { Button } from '../../components/Button';
import { Address } from '../../types/Address';
import { AddressesItem } from '../../components/AddressItem';

const Myaddresses = (data: HomeProps) => {
  const { setToken, setUser } = useAuthContext(); 
  const { tenant, setTenant } = useAppContext();

  const formartter = useFormatter();
  const router = useRouter();

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    if(data.user) setUser(data.user);
  }, [])

  const handleNewAddress = () => {
    router.push(`/${data.tenant.slug}/newaddress`)
  }

  const handleAddressSelected = (address: Address) => {
    console.log(`Selecionou o endereço: ${address.street}  ${address.number}`)
  }

  const handleAddressEdit = (id: number) => {
    console.log(`Editando o Endereço: ${id}`)
  }

  const handleDelete = (id: number) => {
    console.log(`Deletando o Endereço: ${id}`)
  }

  // Menu Events 
  const [ menuOpened, setMenuOpened ] = useState(0)
  const handleMenuEvent = (event: MouseEvent) => {
    const tagNeme = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagNeme)) {
        setMenuOpened(0)
    }
  }
  useEffect(() => {
    window.removeEventListener('click', handleMenuEvent);
    window.addEventListener('click', handleMenuEvent);
    return () => window.removeEventListener('click', handleMenuEvent);
  }, [menuOpened])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Meus Endereços | {data.tenant.name}</title>
      </Head>

      <Header
        backHref={`/${data.tenant.slug}/checkout`}
        color={data.tenant.mainColor}
        title="Meus Endereços"
      />
    
      <div className={styles.list}>
        {data.addresses.map((item) => {
            return (
                <AddressesItem
                    key={item.id}
                    address={item}
                    color={data.tenant.mainColor}
                    onSelect={handleAddressSelected}
                    onEdit={handleAddressEdit}
                    onDelete={handleDelete}
                    menuOpened={menuOpened}
                    setMenuOpened={setMenuOpened}
                />
            )
        })}
      </div>

      <div className={styles.btnArea}>
        <Button
            color={data.tenant.mainColor}
            label="Novo Endereço"
            fill
            onClick={handleNewAddress}
        />
      </div>

    </div>
  );
}

export default Myaddresses;

interface HomeProps {
  tenant: Tenant;
  token: string;
  user: User | null;
  addresses: Address[];
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
  if(!user) {
    return {
        redirect: {
            destination: `/${tenantSlug}/login`,
            permanent: false
          }
    }
  }

  // Get My from Logged User Addresses
  const addresses = await api.getUserAddresses(user.email)

  return {
    props: {
      tenant,
      user,
      token,
      addresses
    }
  }
}