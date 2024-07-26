//@ React Core
import {useState, useEffect, useRef} from 'react';

//@ MUI components
import {
    Menu, Box, Typography, Button, Stack,
    Checkbox,
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
  placeholder: string
  filterBy: any
  updateFilterOption: (key:any) => void
  fields: sortField[]
}

const MultiFilterDropdown = (props : SortyByDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const {isSmallScreen} = useGlobalValues()
  const {placeholder, filterBy, updateFilterOption, fields} = props
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
  }, [filterBy, isSmallScreen]); // Depend on sortByLabel to trigger width check
  
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
          sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2.5, 
              minWidth: `${menuWidth}px`, borderRadius: 1, cursor: 'pointer',
              border: 'solid 1px #2b3131',
              background: '#0d1010'
              }}>
          <Stack direction='row' gap={1} sx={{alignItems: 'center'}}>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} color={anchorEl ? '#FFF' : '#3F3F3F'} fontSize={14} fontWeight={500}>
                {placeholder}
            </Typography>
          </Stack>
          {
            anchorEl ? 
            <Icon icon='tabler:chevron-up' fontSize={18} style={{marginLeft: 5, color: '#FFF'}}/> : 
            <Icon icon='tabler:chevron-down' fontSize={18} style={{marginLeft: 5, color: '#3F3F3F'}}/>
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
            background: '#0d1010',
            // border: theme => `solid 1px ${theme.palette.primary.main}`,
          },
          '& .MuiMenu-list': {
            padding: 0
          }
        }}
      >
        <Stack sx={{pl: 4, pr: 1}}>
          {fields.map((field, index) => (
            <Stack direction='row' sx={{alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between'}} key={index} py={0.5} onClick={() => {
              updateFilterOption(field.key)
            }}>
              <Typography color='white' fontSize={14} fontWeight={500}> {field.label} </Typography>
              <Checkbox checked={filterBy[field.key]}/>
            </Stack>
          ))}
        </Stack>
      </Menu>
    </Box>
  );
}

export default MultiFilterDropdown