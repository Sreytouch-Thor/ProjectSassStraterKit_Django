import { parseISO, format } from 'date-fns';
import styled from 'styled-components';

const Time = styled.p`
    color: gray;

`;
export default function date({ dateString}) {
    const date = parseISO(dateString);

    return (
            <Time>{format(date, 'LLLL d, yyyy')}</Time>
            

    );
}