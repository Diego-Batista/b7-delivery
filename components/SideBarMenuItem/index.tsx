import styles from './styles.module.css';
import { TbToolsKitchen2 } from 'react-icons/tb';
import { FiShoppingBag } from 'react-icons/fi';
import { AiOutlineHeart, AiOutlineSetting } from 'react-icons/ai';
import { BiFoodMenu } from 'react-icons/bi';
import { BiLogOut } from 'react-icons/bi';

type Props = {
    color: string;
    label: string;
    icon: 'fod' | 'bag' | 'fav' | 'menu' | 'config' | 'logout';
    onClick: () => void;
    disabled?: boolean;
}

export const SideBarMenuItem = ({ color, label, icon, onClick, disabled }: Props) => {
    return (
        <div className={styles.container} onClick={onClick}>
            {icon === 'fod' && <TbToolsKitchen2 color={color}/>}
            {icon === 'bag' && <FiShoppingBag color={color}/>}
            {icon === 'fav' && <AiOutlineHeart color={color}/>}
            {icon === 'menu' && <BiFoodMenu color={color}/>}
            {icon === 'config' && <AiOutlineSetting color={color}/>}
            {icon === 'logout' && <BiLogOut color={color}/>}
            <span className={disabled ? styles.disabled : ''}>{label}</span>
        </div>
    );
}