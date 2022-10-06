import styles from './styles.module.css';

type Props = {
    image: string;
} 

export const Logo = ({image}: Props) => {
    return (
        <div className={styles.container}>
            <img src={image} alt="" />
        </div>
    );
}