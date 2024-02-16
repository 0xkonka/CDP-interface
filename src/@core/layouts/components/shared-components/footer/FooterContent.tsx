// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button, {ButtonProps} from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'

import Image from 'next/image'

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

type SocialsType = {
  url: string
  icon: string
  title: string
}

const socials: SocialsType[] = [
  {
    title: 'Discord',
    url: 'https://twitter.com/TrenFinance',
    icon: 'discord-white',
  },
  {
    title: 'Instagram',
    url: 'https://twitter.com/TrenFinance',
    icon: 'instagram-white',
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/TrenFinance',
    icon: 'twitter-white',
  },
  {
    title: 'Telegram',
    url: 'https://twitter.com/TrenFinance',
    icon: 'telegram-white',
  },
  {
    title: 'LinkedIn',
    url: 'https://twitter.com/TrenFinance',
    icon: 'linkedin-white',
  },
]

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box>
      <Box sx={{ display: {xs: 'none', sm: 'flex'}, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 7.5 }}>
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
      <Stack sx={{ display: {xs: 'flex', 'sm': 'none'}}}>
        <Stack direction='row' sx={{justifyContent: 'center', alignItems: 'center', gap: 6}}>
          {socials.map((social, index) => (
            <Link href={social.url} target='_blank' key={index}>
              <img src={`/images/icons/social-icons/${social.icon}.svg`} width={30} key={index} alt={social.title}/>
            </Link>
          ))}
        </Stack>
        <Stack direction='row' sx={{py: 6, mx: 2.5, justifyContent: 'center', alignItems: 'center', gap: 2}}>
          <Typography variant='body2' component={LinkStyled}  target='_blank' href='https://policy.com'>
            Privacy Policy
          </Typography>
          <Typography variant='body2' sx={{px: 4}}>/</Typography>
          <Typography variant='body2' component={LinkStyled}  target='_blank' href='https://terms.com'>
            Terms of Use
          </Typography>
        </Stack>
        {/* <Stack direction='row' sx={{py: 6, mx: 2.5, justifyContent: 'center', alignItems: 'center', borderTop: 'solid 1px #414141', gap: 2}}>
          <Typography variant='body2'>
            Tren Finance Protocol
          </Typography>
          <Typography variant='body2' sx={{ color: theme => theme.palette.primary.main}}>
            @ 2024 All Rights Reserved
          </Typography>
        </Stack> */}
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: {xs: 'start', md: 'end'}, borderTop: 'solid 1px #414141', pt: 7.5}}>
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
