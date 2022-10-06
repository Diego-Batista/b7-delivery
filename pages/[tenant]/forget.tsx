import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import  Header  from '../../components/Header';
import { InputField } from '../../components/InputField';
import { Logo } from '../../components/Logo';
import { useAppContext } from '../../contexts/app';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Forget.module.css';
import { Tenant } from '../../types/Tenant';

const Forget = (data: HomeProps ) => {
  const { tenant, setTenant } = useAppContext();
  const [email, setEmail] = useState('');
  
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/${data.tenant.slug}/signup`);
  }

  useEffect(() => {
    setTenant(data.tenant);
  }, [data.tenant, setTenant]);

  return(
    <div className={styles.container}>
      <Head>
        <title>Esqueci a senha | {data.tenant?.name}</title>
      </Head>

      <Header
        color={data.tenant.mainColor}
        backHref={`/${data.tenant.slug}/login`}
      />

      <div className={styles.header}>
        <Logo
          image={data.tenant.image}
        />
      </div>

      <div className={styles.title}>Esqueceu sua senha?</div>

      <div className={styles.subtitle} style={{borderColor: data.tenant.mainColor}}>
        Preencha o campo com seu e-mail e receba as instruções necessárias para redefinir a sua senha.
      </div>
      <div className={styles.line}></div>

      <div className={styles.formArea}>
        <div className={styles.inputArea}>
          <InputField
            color={data.tenant.mainColor}
            placeholder="Digite seu e-mail"
            value={email}
            onChange={setEmail}
          />
        </div>
        <div className={styles.inputArea}>
          <Button
            fill
            color={data.tenant.mainColor}
            label="Enviar"
            onClick={handleSubmit}
          />
        </div>
      </div>

    </div>
  )
} 

export default Forget;

interface HomeProps {
  tenant: Tenant;
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
  
    return {
      props: {
        tenant
      }
    }
  }