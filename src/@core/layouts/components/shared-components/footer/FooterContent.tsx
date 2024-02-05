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
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{display: 'flex'}}>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://policy.com'>
            Privacy Policy
          </Typography>
          <Typography variant='subtitle1' sx={{px: 4}}>/</Typography>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://terms.com'>
            Terms of Use
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://discord.com'>
            Discord
          </Typography>
          <Typography variant='subtitle1' sx={{px: 4}}>/</Typography>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://twitter.com'>
            Twitter
          </Typography>
          <Typography variant='subtitle1' sx={{px: 4}}>/</Typography>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://instagram.com'>
            Instagram
          </Typography>
          <Typography variant='subtitle1' sx={{px: 4}}>/</Typography>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://telegram.com'>
            Telegram
          </Typography>
          <Typography variant='subtitle1' sx={{px: 4}}>/</Typography>
          <Typography variant='subtitle1' component={LinkStyled}  target='_blank' href='https://linkedin.com'>
            Linkedin
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: {xs: 'start', md: 'end'}, borderTop: 'solid 1px #414141', pt: 2, pb: 6}}>
        <Typography variant='subtitle2' sx={{display: 'flex', alignItems: 'center', fontWeight: 400, color: 'text.secondary' }}>
          Tren Finance Protocol
          <Typography sx={{ml:2, color: (theme) => theme.palette.primary.main}}>
          {`© ${new Date().getFullYear()} All Right Reserved `}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default FooterContent
