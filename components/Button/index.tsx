import styles from './styles.module.css';
type Props = {
    color: string;
    label: string;
    fill?: boolean;
    onClick: () => void;
    disabled?: boolean
}

export const Button = ({color, label, fill, onClick, disabled}: Props) => {
    return (
        <div 
            className={styles.container} 
            style={{ background: fill ? color : "transparent", borderColor: color, color: fill ? "#fff" : color,  opacity: disabled ? .5 : 1}}
            onClick={!disabled ? onClick : () => {}}
        >
            {label}
        </div>
    )
}