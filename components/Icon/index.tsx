import MailSent from './MailSent.svg';
import Card from './Card.svg';
import Checked from './Checked.svg';
import Cupom from './Cupom.svg';
import Location from './Location.svg';
import Money from './Money.svg';
import RigthArrow from './RigthArrow.svg';
import Dots from './Dots.svg';
import Edit from './Edit.svg';
import Delete from './Delete.svg';

type Props = {
    icon: string;
    color: string;
    width: number;
    height: number;
}

export const Icon = ({ icon, color, width, height }: Props) => {
    return (
        <div style={{width, height}}>
            {icon === 'mailSent' && <MailSent color={color}/>}
            {icon === 'card' && <Card color={color}/>}
            {icon === 'checked' && <Checked color={color}/>}
            {icon === 'cupom' && <Cupom color={color}/>}
            {icon === 'location' && <Location color={color}/>}
            {icon === 'money' && <Money color={color}/>}
            {icon === 'rigthArrow' && <RigthArrow color={color}/>}
            {icon === 'dots' && <Dots color={color}/>}
            {icon === 'edit' && <Edit color={color}/>}
            {icon === 'delete' && <Delete color={color}/>}
        </div>
    );
}