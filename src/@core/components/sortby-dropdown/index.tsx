//@ React Core
import {useState, useEffect, useRef} from 'react';

//@ MUI components
import {
    Menu, Box, Typography, Button, Stack,
} from '@mui/material';

//@ Template Core
import Icon from 'src/@core/components/icon'

//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext';

interface sortField {
  key: string
  label: string
}

// PropsType
interface SortyByDropdownProps {
  sortBy: string
  setSortBy: (value: string) => void
  fields: sortField[]
}

const SortByDropdown = (props : SortyByDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const {isSmallScreen} = useGlobalValues()
  const {sortBy, setSortBy, fields} = props
  const obj = fields.find(element => element.key == sortBy.substring(1))
  const sortByLabel = obj?.label
  const boxRef = useRef<HTMLDivElement>(null);
  const sortByPopupRef = useRef<HTMLDivElement>(null);
  const dropDownComponentRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number>(0); // Default min width
  const [offsetBottom, setOffsetBottom] =  useState<number>(0);

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (boxRef.current) {
      if(isSmallScreen)
        setMenuWidth(0)
      else 
        setMenuWidth(Math.max(boxRef.current.offsetWidth, 260));
    }
  }, [sortBy, isSmallScreen]); // Depend on sortByLabel to trigger width check
  
  // Here we fetch the offsetBottom of the dropdown menu.
  // If the offset is less than 400px, it means that we can not show poup below dropdown.
  useEffect(() => {
    const updatePosition = () => {
      if (dropDownComponentRef.current) {
        const scrollTop = document.documentElement.scrollTop;
        const offsetTop = dropDownComponentRef.current.offsetTop - scrollTop;
        const _offsetBottom = document.documentElement.clientHeight - offsetTop;
        setOffsetBottom(_offsetBottom)
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    };
  }, []);

  // If offsetBottom value is less than 400, we change the position of the popup. (To the right above of dropdown)
  useEffect(() => {
    return () => {
      setTimeout(() => {
        if(!anchorEl && sortByPopupRef.current && offsetBottom < 400) {
          const paperRoot = sortByPopupRef.current.getElementsByClassName('MuiPaper-root')[0] as HTMLElement
          if(paperRoot) {
            paperRoot.style.top = 'auto'
            paperRoot.style.bottom = offsetBottom + 5 + 'px'
          }
        }        
      }, 100)
    };
  }, [anchorEl, offsetBottom]); 

  return (
    <Box sx={{flex: {xs: 1, md: 'none'}}} ref={dropDownComponentRef}>
      <Box onClick={handleOpenMenu} ref={boxRef}
          sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3, 
              minWidth: `${menuWidth}px`, borderRadius: 1, cursor: 'pointer',
              border: 'solid 1px #2D3131',
              }}>
          <Stack direction='row' gap={1} sx={{alignItems: 'center'}}>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} color='#a1a1a1'>
                Sort by
            </Typography>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'}>
                {isSmallScreen ? '' : sortByLabel}
            </Typography>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} color='#a1a1a1'>
              {isSmallScreen ? '' : (sortBy[0] == '-' ? 'desc' : 'asc')}
            </Typography>
          </Stack>
          {
            anchorEl ? 
            <Icon icon='tabler:chevron-up' fontSize={18} style={{marginLeft: 5}}/> : 
            <Icon icon='tabler:chevron-down' fontSize={18} style={{marginLeft: 5}}/>
          }
      </Box>
      <Menu
        anchorEl={anchorEl}
        ref={sortByPopupRef}
        PaperProps={{ ref: sortByPopupRef }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ 
          '& .MuiPopover-paper' : {
            minWidth: `${menuWidth}px`,
            border: theme => `solid 1px ${theme.palette.primary.main}`,
          }
        }}
      >
        <Stack sx={{px: 4}}>
          <Stack direction='row' sx={{justifyContent: 'flex-end', mb: 1}}>
            <Typography color='white' variant='body2' sx={{mr: 2}}> ASC </Typography>
            <Typography color='white' variant='body2' sx={{mr: 1}}> DESC </Typography>
          </Stack>
          {fields.map((field, index) => (
            <Stack direction='row' sx={{alignItems: 'center', mb: 2}} key={index}>
              <Stack sx={{flex: '1.5 1 0%'}}>
                <Typography color='white' variant='body1'> {field.label} </Typography>
              </Stack>
              <Stack direction='row' sx={{flex: '1 1 0%', justifyContent: 'flex-end'}}>
                <Button variant={field.key == sortBy.substring(1) && '+' == sortBy[0] ? 'contained' : 'outlined'}
                  color={field.key == sortBy.substring(1) && '+' == sortBy[0] ? 'primary' : 'secondary'} sx={{p: 2.5, minWidth: 40, borderColor: '#2D3131', borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                  onClick={() => {setSortBy(`+${field.key}`), setAnchorEl(null)}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.16684 4.51118L4.75601 8.92202C4.59884 9.07382 4.38834 9.15781 4.16984 9.15591C3.95134 9.15401 3.74233 9.06637 3.58783 8.91187C3.43332 8.75736 3.34568 8.54835 3.34378 8.32985C3.34188 8.11135 3.42588 7.90085 3.57768 7.74368L9.41101 1.91035C9.48833 1.8329 9.58017 1.77145 9.68127 1.72952C9.78236 1.6876 9.89073 1.66602 10.0002 1.66602C10.1096 1.66602 10.218 1.6876 10.3191 1.72952C10.4202 1.77145 10.512 1.8329 10.5893 1.91035L16.4227 7.74368C16.5745 7.90085 16.6585 8.11135 16.6566 8.32985C16.6547 8.54835 16.567 8.75736 16.4125 8.91187C16.258 9.06637 16.049 9.15401 15.8305 9.15591C15.612 9.15781 15.4015 9.07382 15.2443 8.92202L10.8335 4.51118V17.4995C10.8335 17.7205 10.7457 17.9325 10.5894 18.0888C10.4332 18.2451 10.2212 18.3328 10.0002 18.3328C9.77916 18.3328 9.5672 18.2451 9.41092 18.0888C9.25464 17.9325 9.16684 17.7205 9.16684 17.4995V4.51118Z" fill="white"/>
                  </svg>
                </Button>
                <Button variant={field.key == sortBy.substring(1) && '-' == sortBy[0] ? 'contained' : 'outlined'} 
                  color={field.key == sortBy.substring(1) && '-' == sortBy[0] ? 'primary' : 'secondary'} sx={{p: 2.5, minWidth: 40, borderColor: '#2D3131', borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                  onClick={() => {setSortBy(`-${field.key}`), setAnchorEl(null)}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.16684 15.4888L4.75601 11.078C4.59884 10.9262 4.38834 10.8422 4.16984 10.8441C3.95134 10.846 3.74233 10.9336 3.58783 11.0881C3.43332 11.2426 3.34568 11.4517 3.34378 11.6701C3.34188 11.8886 3.42588 12.0991 3.57768 12.2563L9.41101 18.0897C9.48833 18.1671 9.58017 18.2286 9.68127 18.2705C9.78236 18.3124 9.89073 18.334 10.0002 18.334C10.1096 18.334 10.218 18.3124 10.3191 18.2705C10.4202 18.2286 10.512 18.1671 10.5893 18.0897L16.4227 12.2563C16.5745 12.0991 16.6585 11.8886 16.6566 11.6701C16.6547 11.4517 16.567 11.2426 16.4125 11.0881C16.258 10.9336 16.049 10.846 15.8305 10.8441C15.612 10.8422 15.4015 10.9262 15.2443 11.078L10.8335 15.4888V2.50048C10.8335 2.27947 10.7457 2.06751 10.5894 1.91123C10.4332 1.75495 10.2212 1.66715 10.0002 1.66715C9.77916 1.66715 9.5672 1.75495 9.41092 1.91123C9.25464 2.06751 9.16684 2.27947 9.16684 2.50048V15.4888Z" fill="white"/>
                  </svg>
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Menu>
    </Box>
  );
}

export default SortByDropdown