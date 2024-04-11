import {Stack, Typography} from '@mui/material'

interface Props {
  label: string;
  flexWidth: number;
  sortBy: string;
  direction: string; // 'asc' | 'desc' | 'none'
  onSort: (sortBy: string, direction: string) => void;
  sortable: boolean
}

export const SortableHeaderItem = (props: Props) => {
  const {label, flexWidth, sortBy, direction, onSort, sortable} = props
  const ascColor = direction === 'asc' ? '#67DAB1' : '#D4D4D4'
  const descColor = direction === 'desc' ? '#67DAB1' : '#D4D4D4'

  let newDirection = 'none'
  if(direction == 'none') 
    newDirection = 'asc'
  else if(direction == 'asc')
    newDirection = 'desc'
  else if(direction == 'desc') 
    newDirection = 'none'

  return (
    <Stack sx={{ flex: `${flexWidth} 1 0%`, alignItems: 'center', cursor: 'pointer' }} direction='row'>
      <Typography onClick={() => {onSort(sortBy, newDirection)}} color='#D4D4D4'>
        {label}
      </Typography>
      {sortable &&
      <Stack marginLeft={2} onClick={() => {onSort(sortBy, newDirection)}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.80835 14.4619C7.86901 14.487 7.93405 14.4999 7.99971 14.4999C8.06538 14.4999 8.13042 14.487 8.19108 14.4619C8.25175 14.4367 8.30685 14.3999 8.35322 14.3534L11.8532 10.8539C11.947 10.7601 11.9998 10.6329 11.9998 10.5003C11.9999 10.3676 11.9472 10.2404 11.8535 10.1466C11.7597 10.0528 11.6325 10 11.4999 10C11.3673 9.99995 11.24 10.0526 11.1462 10.1464L7.99971 13.2924L4.85321 10.1464C4.75891 10.0553 4.63261 10.0049 4.50151 10.006C4.37042 10.0072 4.24501 10.0597 4.15231 10.1524C4.0596 10.2451 4.00702 10.3706 4.00588 10.5017C4.00474 10.6327 4.05514 10.7591 4.14622 10.8534L7.64621 14.3534C7.69258 14.3999 7.74768 14.4367 7.80835 14.4619Z" fill={descColor}/>
            <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill={ascColor}/>
        </svg>
      </Stack>
      }
      
    </Stack>
  )
}