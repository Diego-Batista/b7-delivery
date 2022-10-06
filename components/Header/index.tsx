import styles from './styles.module.css';
import BackIcon from './backIcon.svg';
import Link from 'next/link';

interface HeaderProps {
    backHref: string;
    color: string;
    title?: string;
    subtitle?: string;
    invert?: boolean;
}

export default function Header ({ backHref, color, title, subtitle, invert }: HeaderProps) {
    
    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                    <Link href={backHref}>
                        <a className={invert ? styles.buttonTransparent : ''}>
                            <BackIcon 
                                color={invert ? '#fff' : color}
                            />
                        </a>
                    </Link>
            </div>
            <div className={styles.centerSide}>
                { title && 
                    <div 
                    className={styles.title}
                    style={{color: invert ? '#fff' : '#1B1B1B'}}
                    >
                        {title}
                    </div>
                }
                { subtitle && <div className={styles.subTitle}>{subtitle}</div>}
            </div>
            <div className={styles.rightSide}>

            </div>
        </div>
    );
}