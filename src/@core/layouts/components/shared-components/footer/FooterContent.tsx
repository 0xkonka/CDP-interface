// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button, {ButtonProps} from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'

import Image from 'next/image'

type SocialsType = {
  url: string
  icon: string
  title: string
}

const socials: SocialsType[] = [
  {
    title: 'Discord',
    url: 'https://twitter.com/TrenFinance',
    icon: 'discord',
  },
  {
    title: 'Instagram',
    url: 'https://twitter.com/TrenFinance',
    icon: 'instagram',
  },
  {
    title: 'Twitter',
    icon: 'twitter',
    url: 'https://twitter.com/TrenFinance',
  },
  {
    title: 'Telegram',
    icon: 'telegram',
    url: 'https://twitter.com/TrenFinance',
  },
  {
    title: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://twitter.com/TrenFinance',
  },
]

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.text.secondary} !important`,
  '&:hover': {
    color: `${theme.palette.primary.main} !important`
  }
}))

const SquareSocialButton = styled(Button)<ButtonProps>(() => ({
  padding: 4,
  marginLeft: 8,
  marginRight: 8,
  minWidth: 34,
  minHeight: 34,
  border: 'solid 1px #53545F',
  borderRadius: 10,
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        Tren Finance Protocol
        <Typography sx={{ ml: 1 }} target='_blank' href='https://pixinvent.com' component={StyledCompanyName}>
        {`© ${new Date().getFullYear()} All Right Reserved `}
        </Typography>
        
        
        {/* <Typography sx={{ ml: 1 }} target='_blank' href='https://pixinvent.com' component={StyledCompanyName}> */}
          {/* Pixinvent */}
        {/* </Typography> */}
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
          {socials.map(social => (
            <SquareSocialButton variant='outlined' color='secondary' href={social.url} key={social.title}>
              <Image src={`/images/icons/social-icons/${social.icon}.svg`}
                alt={social.title}
                width={20}
                height={20}
                style={{marginRight: 0}}
              />
            </SquareSocialButton>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
