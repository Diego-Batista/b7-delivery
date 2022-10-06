import styles from './styles.module.css';
type Props = {
    color: string;
    label: string;
    fill?: boolean;
    onClick: () => void;
}

export const Button = ({color, label, fill, onClick}: Props) => {
    return (
        <div 
            className={styles.container} 
            style={{ background: fill ? color : "transparent", borderColor: color, color: fill ? "#fff" : color }}
            onClick={onClick}
        >
            {label}
        </div>
    )
}