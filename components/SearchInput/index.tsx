import styles from './SearchInput.module.css';
import SearchIcon from './search.svg';
import { useState } from 'react';
import { useAppContext } from '../../contexts/app';

interface SearchInputProps {
    onSearch: (searchValue: string) => void;
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
    const { tenant } = useAppContext();
    const [focused, setFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        //if(event.code === 'Enter'){
            onSearch(searchValue);  
        //}
    }

    return(
        <div className={styles.container} style={{borderColor: focused ? tenant?.mainColor : '#fff'}}>
            <div 
                className={styles.button}     
            >
                <SearchIcon
                    onClick={() => onSearch(searchValue)}
                    color={tenant?.mainColor}
                />
            </div>
            <input 
                type="text"
                className={styles.input}
                placeholder="Digite o nome do produto"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyUp={handleKeyUp}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
}