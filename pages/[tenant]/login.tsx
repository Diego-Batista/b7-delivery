import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import Header  from '../../components/Header';
import { InputField } from '../../components/InputField';
import { Logo } from '../../components/Logo';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Login.module.css';
import { Tenant } from '../../types/Tenant';

export const Login = (data: HomeProps) => {
  const { tenant, setTenant } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const { setToken, setUser } = useAuthContext();

  const handleSubmit = () => {
    setToken('1234');
    setUser({
      name: 'Diego',
      email: 'diego@teste.com',
      avatar: 'https://github.com/Diego-Batista.png'
    });
    router.push(`/${data.tenant.slug}`)
  }

  const handleSignUp = () => {
    router.push(`/${data.tenant.slug}/signup`);
  }

  useEffect(() => {
    setTenant(data.tenant);
  }, []);
  
  return (
    <div className={styles.container}>
        <Head>
            <title>Login | {data.tenant.name}</title>
        </Head>

        <Header
            color={data.tenant.mainColor}
            backHref={`/${data.tenant.slug}`}
            title="Login"
            subtitle="subtitulo"
        />

        <div className={styles.header}>
          <Logo
            image={data.tenant.image}
          />
        </div>

        <div className={styles.subtitle} style={{borderColor: data.tenant.mainColor}}>
          Use suas credenciais para realizar o login.
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
              label="Entrar"
              onClick={handleSubmit}
              fill
            />
          </div>
        </div>

        <div className={styles.forgetArea} style={{borderColor: data.tenant.mainColor}}>
          Esqueceu sua senha? <Link href={`/${data.tenant.slug}/forget`}><a style={{color: data.tenant.mainColor}}>Clique aqui</a></Link> 
      </div>

      <div className={styles.line}></div>

      <div className={styles.signupArea}>
          <Button
            color={data.tenant.mainColor}
            label="Quero me cadastrar"
            onClick={handleSignUp}
          />
      </div>
    </div>
  );
}

export default Login;

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