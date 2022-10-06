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
import styles from '../../styles/Signup.module.css';
import { Tenant } from '../../types/Tenant';

const Signup = (data: HomeProps ) => {
  const { tenant, setTenant } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();

  const handleSubmit = () => {

  }

  const handleSignUp = () => {
    router.push(`/${data.tenant.slug}/signup`);
  }

  useEffect(() => {
    setTenant(data.tenant);
  }, [data.tenant, setTenant]);

  return(
    <div className={styles.container}>
      <Head>
        <title>Cadastro | {data.tenant?.name}</title>
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

      <div className={styles.subtitle} style={{borderColor: data.tenant.mainColor}}>
        Preencha os campos para criar o seu cadastro.
      </div>
      <div className={styles.line}></div>

      <div className={styles.formArea}>
        <div className={styles.inputArea}>
        <div className={styles.inputArea}>
          <InputField
            color={data.tenant.mainColor}
            placeholder="Digite seu nome"
            value={name}
            onChange={setName}
          />
        </div>
          <InputField
            color={data.tenant.mainColor}
            placeholder="Digite seu e-mail"
            value={email}
            onChange={setEmail}
          />
        </div>
        <div className={styles.inputArea}>
          <InputField
            color={data.tenant.mainColor}
            placeholder="Digite sua senha"
            value={password}
            onChange={setPassword}
            password
          />
        </div>
        <div className={styles.inputArea}>
          <Button
            color={data.tenant.mainColor}
            label="Cadastrar"
            onClick={handleSignUp}
          />
        </div>
      </div>

      <div className={styles.forgetArea}>
        Já tem cadastro? <Link href={`/${data.tenant.slug}/login`}><a style={{color: data.tenant.mainColor}}>Fazer login</a></Link> 
      </div>
    </div>
  )
} 

export default Signup;

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