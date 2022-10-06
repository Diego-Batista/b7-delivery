import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import  Header  from '../../components/Header';
import { Icon } from '../../components/Icon';
import { InputField } from '../../components/InputField';
import { useAppContext } from '../../contexts/app';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/ForgetSuccess.module.css';
import { Tenant } from '../../types/Tenant';

const ForgetSuccess = (data: HomeProps ) => {
  const { tenant, setTenant } = useAppContext(); 
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/${data.tenant.slug}/login`);
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
        backHref={`/${data.tenant.slug}/forget`}
      />

      <div className={styles.iconArea}>
        <Icon
          icon="mailSent"
          color={data.tenant.mainColor}
          width={99}
          height={81}
        />
      </div>

      <div className={styles.title}>Verifique seu e-mail</div>

      <div className={styles.subtitle} style={{borderColor: data.tenant.mainColor}}>
        Enviamos as instruções para recuperação de senha para o seu e-mail.
      </div>

      <div className={styles.formArea}>
        <div className={styles.inputArea}>
          <Button
            fill
            color={data.tenant.mainColor}
            label="Fazer Login"
            onClick={handleSubmit}
          />
        </div>
      </div>

    </div>
  )
} 

export default ForgetSuccess;

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