// Import from react
import React from 'react';

// Import from MUI components
import {
    Menu, MenuItem, Checkbox, Box, InputLabel, Typography, Button
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel'

// Import from core components
import Icon from 'src/@core/components/icon'

// PropsType
interface MultiSelectDropdownProps {
  availableFilters: Array<string>
}

const MultiSelectDropdown = (props : MultiSelectDropdownProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([])
  const {availableFilters} = props

  const getIDFormat = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, '_')
  }

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box onClick={handleOpenMenu} 
          sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, 
              minWidth: '260px', borderRadius: 1, cursor: 'pointer',
              border: (theme) => `solid 1px ${anchorEl ? theme.palette.primary.main : '#2D3131'}`}}>
          <Typography variant='h6'>
              Sort by {selectedOptions.join(', ')}
          </Typography>
          {
            anchorEl ? 
            <Icon icon='tabler:chevron-down' fontSize={18} style={{marginLeft: 5}}/> : 
            <Icon icon='tabler:chevron-up' fontSize={18} style={{marginLeft: 5}}/>
          }
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ 
          '& .MuiPopover-paper' : {
            minWidth: '260px',
            border: theme => `solid 1px ${theme.palette.primary.main}`
          }
        }}
      >
       
        {availableFilters.map((filter:string, index:number) => (
          <MenuItem sx={{
              padding: 0,
              borderBottom: index != availableFilters.length - 1 ? 'solid 1px #2D3131' : '',
              borderRadius: 0,
          }} key={index}>
            <FormControlLabel label={filter} control={
              <Checkbox id={getIDFormat(filter)} name='filterByType'
                checked={selectedOptions.includes(filter)}
                onChange={() => handleOptionClick(filter)}
              />
            }  sx={{ width: '100%' }}/>
          </MenuItem>
        ))}
        <Box sx={{px: 2, pt: 4}}>
          <Button variant='outlined' sx ={{color: 'white'}}
            onClick={() => setSelectedOptions([])}>
              Reset filter
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}

export default MultiSelectDropdown