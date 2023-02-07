import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../contexts/app';
import { useAuthContext } from '../../../contexts/auth';
import { useApi } from '../../../libs/useApi';
import styles from '../../../styles/NewAddresses.module.css';
import { Tenant } from '../../../types/Tenant';
import { User } from '../../../types/User';
import Head from 'next/head';
import Header from '../../../components/Header';
import { useFormatter } from '../../../libs/useFormatter';
import { useRouter } from 'next/router';
import { Button } from '../../../components/Button';
import { Address } from '../../../types/Address';
import { AddressesItem } from '../../../components/AddressItem';
import { InputField } from '../../../components/InputField';

const NewAddress = (data: HomeProps) => {
  const { setToken, setUser } = useAuthContext(); 
  const { tenant, setTenant, setShippingAddress, setShippingPrice } = useAppContext();

  const formartter = useFormatter();
  const router = useRouter();
  const api = useApi(data.tenant.slug)

  const [errorFields, setErrorFields] = useState<string[]>([])

  const [addressCep, setAddressCep] = useState<string>('')
  const [addressStreet, setAddressStreet] = useState<string>('')
  const [addressNumber, setAddressNumber] = useState<string>('')
  const [addressNeighborhood, setAddressNeighborhood] = useState<string>('')
  const [addressCity, setAddressCity] = useState<string>('')
  const [addressState, setAddressState] = useState<string>('')
  const [addressComplement, setAddressComplement] = useState<string>('')

  const verifyAddress = () => {
    let newErrorFields = [];
    let approved = true;

    if(addressCep.replaceAll(/[^0-9]/g, '').length !== 8) {
      newErrorFields.push('cep');
      approved = false;
    }

    if(addressStreet.length <= 2) {
      newErrorFields.push('street');
      approved = false;
    }

    if(addressNeighborhood.length <= 2) {
      newErrorFields.push('neighborhood');
      approved = false;
    }

    if(addressCity.length <= 2) {
      newErrorFields.push('city');
      approved = false;
    }

    if(addressState.length !== 2) {
      newErrorFields.push('state');
      approved = false;
    }

    setErrorFields(newErrorFields)
    return approved
  }

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    if(data.user) setUser(data.user);
  }, [])


  const handleNewAddress = () => {
    if(verifyAddress()) {

    }

    // router.push(`/${data.tenant.slug}/address/new`)
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Novo Endereço | {data.tenant.name}</title>
      </Head>

      <Header
        backHref={`/${data.tenant.slug}/checkout`}
        color={data.tenant.mainColor}
        title="Novo Endereço"
      />

      <div className={styles.inputs}>

          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>CEP</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Digite um CEP"
                value={addressCep}
                onChange={value => setAddressCep(value)}
                warning={errorFields.includes('cep')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>Rua</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Nome uma rua"
                value={addressStreet}
                onChange={value => setAddressStreet(value)}
                warning={errorFields.includes('street')}
              />
            </div>
            <div className={styles.column}>
              <div className={styles.label}>Número</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Digite um numero"
                value={addressNumber}
                onChange={value => setAddressNumber(value)}
                warning={errorFields.includes('number')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>Bairro</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Digite um bairro"
                value={addressNeighborhood}
                onChange={value => setAddressNeighborhood(value)}
                warning={errorFields.includes('neighborhood')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>Cidade</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Digite uma cidade"
                value={addressCity}
                onChange={value => setAddressCity(value)}
                warning={errorFields.includes('city')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>Estado</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Digite um estado"
                value={addressState}
                onChange={value => setAddressState(value)}
                warning={errorFields.includes('state')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>Complemento</div>
              <InputField 
                color={data.tenant.mainColor} 
                placeholder="Digite um complemento"
                value={addressComplement}
                onChange={value => setAddressComplement(value)}
              />
            </div>
          </div>

      </div>

      <div className={styles.btnArea}>
        <Button
            color={data.tenant.mainColor}
            label="Adicionar"
            fill
            onClick={handleNewAddress}
        />
      </div>

    </div>
  );
}

export default NewAddress;

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