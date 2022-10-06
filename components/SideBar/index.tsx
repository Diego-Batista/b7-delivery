import { useAuthContext } from '../../contexts/auth';
import { Tenant } from '../../types/Tenant';
import { Button } from '../Button';
import { SideBarMenuItem } from '../SideBarMenuItem';
import styles from './styles.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useRouter } from 'next/router';


type Props = {
    tenant: Tenant;
    open: boolean;
    onClose: () => void;
}

export const SideBar = ({ tenant, open, onClose }: Props) => {
    const { user, setToken } = useAuthContext();
    const router = useRouter();

    return (
        <div className={styles.container} style={{ width: open ? '100vw' : '0'}}>
            <div className={styles.area}>
                <header>
                    <div className={styles.loginArea} style={{borderBottomColor: tenant.mainColor}}>
                        {user && 
                            <div className={styles.userInfo}>
                                <img src={user.avatar} alt="" style={{borderColor: tenant.mainColor}}/>
                                <strong>{user.name}</strong>
                                Último pedido há 3 semanas
                            </div>
                        }
                        {!user && 
                            <Button
                                color={tenant.mainColor}
                                label="Fazer Login"
                                onClick={() => router.push(`/${tenant.slug}/login`)}
                                fill
                            />
                        }
                    </div>
                    <div 
                        className={styles.closeBtn}
                        style={{color: tenant.mainColor}}
                        onClick={onClose}
                    >
                        <AiOutlineClose/>
                    </div>
                </header>
                <div className={styles.line}></div>
                <div className={styles.menu}>
                    <SideBarMenuItem
                        color='#6A7D8B'
                        label='Cardápio'
                        onClick={onClose}
                        icon='fod'
                    />
                    <SideBarMenuItem
                        color='#6A7D8B'
                        label='Sacola'
                        onClick={() => router.push(`/${tenant.slug}/cart`)}
                        icon='bag'
                    />
                    <SideBarMenuItem
                        color='#6A7D8B'
                        label='Favoritos'
                        onClick={() => {}}
                        icon='fav'
                        disabled
                    />
                    <SideBarMenuItem
                        color='#6A7D8B'
                        label='Meus Pedidos'
                        onClick={() => router.push(`/${tenant.slug}/orders`)}
                        icon='menu'
                    />
                    <SideBarMenuItem
                        color='#6A7D8B'
                        label='Configurações'
                        onClick={() => {}}
                        icon='config'
                        disabled
                    />
                </div>
                <div className={styles.menuBotton}>
                    {user &&
                    <SideBarMenuItem
                        color='#6A7D8B'
                        label='Sair'
                        onClick={() => {
                            setToken('');
                            onClose();
                        }}
                        icon='logout'
                    />
                    }
                </div>
            </div>
        </div>
    )
}