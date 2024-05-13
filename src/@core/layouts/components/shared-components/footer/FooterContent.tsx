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
import { useGlobalValues } from '@/context/GlobalContext'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#C6C6C7 !important',
  '&:hover': {
    color: `white !important`
  }
}))

const FooterContent = () => {
  // ** Var
  const {isSmallScreen, isMediumScreen} = useGlobalValues()

  return (
    <Box>
      {/* Desktop version */}
      <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent='space-between' alignItems='center' sx={{ mb: 6 }} gap={10}>
        <Stack direction='row' gap={8}>
          <Box sx={{display: {xs: 'none', md: 'block'}}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.8646 10.1136C9.51354 10.1468 8.16435 10.5644 7.31839 11.7606C6.14641 13.4177 3.84975 17.1474 1.98907 20.1692C1.28064 21.3196 0.635403 22.3675 0.139504 23.1592C-0.0160448 23.4076 0.0901856 23.7335 0.373347 23.809C2.28801 24.3191 5.76751 24.1204 6.78446 22.5668L12.9032 13.219C15.0928 16.5141 17.7396 20.4046 19.3573 22.7643C19.5267 23.0114 19.8777 23.0382 20.0741 22.8119C21.5512 21.1108 23.5755 17.8944 22.1837 15.8136L12.0636 0.683663C11.8952 0.431811 11.5387 0.403015 11.347 0.637734C9.94056 2.36067 8.17155 5.82998 10.0912 8.89881C10.3163 9.25863 10.5765 9.66701 10.8646 10.1136Z" fill="white"/>
            </svg>
          </Box>
          <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent='center' alignItems='center' sx={{ gap: {xs: 8, md: 3, lg: 12} }}>
            {/* <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} href='/dashboard'>
              Dashboard
            </Typography> */}
            <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} href='/modules'>
              Modules
            </Typography>
            <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} href='/earn'>
              Earn
            </Typography>
            <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} href='/referrals'>
              Referrals
            </Typography>
            {/* <Typography variant='subtitle1' fontWeight={500} component={LinkStyled}  href='/points'>
              Points
            </Typography> */}
            {/* <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} href='/swap'>
              Swap
            </Typography> */}
          </Stack>
        </Stack>
        <Stack direction='row' sx={{ display: {xs: 'flex', 'md': 'none'} }} mt={5} gap={6}>
          <Typography fontSize={12} fontWeight={500} component={LinkStyled} target='_blank' href='https://policy.com'>
            Privacy Policy
          </Typography>
          <Typography fontSize={12} fontWeight={500} component={LinkStyled} target='_blank' href='https://terms.com'>
            Terms of Use
          </Typography>
        </Stack>
        <Stack direction='row' sx={{justifyContent: 'center', alignItems: 'center', gap: 6}}>
          <Link href='https://discord.com/invite/trenfinance' target='_blank'>
            <svg width="26" height="26" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.801 1.95544C19.2297 1.2361 17.571 0.725773 15.8672 0.4375C15.634 0.8543 15.4231 1.28313 15.2352 1.7222C13.4203 1.44871 11.5746 1.44871 9.75969 1.7222C9.5717 1.28318 9.36074 0.854351 9.12769 0.4375C7.42275 0.728207 5.76294 1.23974 4.19015 1.9592C1.06774 6.57886 0.221305 11.0838 0.644523 15.5247C2.47308 16.8758 4.51976 17.9032 6.69559 18.5625C7.18553 17.9036 7.61906 17.2045 7.99158 16.4727C7.28402 16.2085 6.60111 15.8824 5.95073 15.4984C6.1219 15.3743 6.28931 15.2464 6.45107 15.1222C8.34351 16.0122 10.409 16.4736 12.5003 16.4736C14.5915 16.4736 16.657 16.0122 18.5494 15.1222C18.7131 15.2558 18.8805 15.3837 19.0498 15.4984C18.3982 15.8831 17.714 16.2097 17.0052 16.4746C17.3772 17.206 17.8108 17.9045 18.3012 18.5625C20.4789 17.9059 22.5271 16.8789 24.356 15.5266C24.8526 10.3765 23.5077 5.913 20.801 1.95544ZM8.52766 12.7936C7.34829 12.7936 6.37395 11.7233 6.37395 10.4066C6.37395 9.08995 7.31443 8.01027 8.5239 8.01027C9.73336 8.01027 10.7002 9.08995 10.6795 10.4066C10.6588 11.7233 9.7296 12.7936 8.52766 12.7936ZM16.4729 12.7936C15.2916 12.7936 14.321 11.7233 14.321 10.4066C14.321 9.08995 15.2615 8.01027 16.4729 8.01027C17.6842 8.01027 18.6435 9.08995 18.6228 10.4066C18.6021 11.7233 17.6748 12.7936 16.4729 12.7936Z" fill="#C6C6C7"/>
            </svg>
          </Link>
          <Link href='https://twitter.com/TrenFinance' target='_blank'>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M14.857 11.5079L22.1175 3.25H20.3976L14.0907 10.4187L9.0571 3.25H3.25L10.8634 14.0914L3.25 22.75H4.9699L11.6259 15.178L16.9429 22.75H22.75M5.59065 4.51904H8.2329L20.3964 21.5433H17.7534" fill="#C6C6C7"/>
            </svg>
          </Link>
          <Link href='https://blog.tren.finance/' target='_blank'>
            <svg fill="#C6C6C7" width="24" height="24" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,72A12,12,0,1,0,24,84,12.0119,12.0119,0,0,0,12,72Z"/><path d="M12,36a6,6,0,0,0,0,12A36.0393,36.0393,0,0,1,48,84a6,6,0,0,0,12,0A48.0512,48.0512,0,0,0,12,36Z"/><path d="M12,0a6,6,0,0,0,0,12A72.0788,72.0788,0,0,1,84,84a6,6,0,0,0,12,0A84.0981,84.0981,0,0,0,12,0Z"/>
            </svg>
          </Link>
          <Link href='https://t.me/trenfinance' target='_blank'>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5518 16.0161L10.1754 21.3091C10.7139 21.3091 10.9471 21.0779 11.2267 20.8001L13.751 18.3877L18.9817 22.2182C19.941 22.7528 20.6168 22.4713 20.8756 21.3357L24.309 5.24799L24.3099 5.24704C24.6142 3.82899 23.7971 3.27447 22.8625 3.62235L2.68116 11.3487C1.30382 11.8833 1.32468 12.6511 2.44702 12.9989L7.60657 14.6037L19.5912 7.10492C20.1552 6.73145 20.668 6.93809 20.2462 7.31156L10.5518 16.0161Z" fill="#C6C6C7"/>
            </svg>
          </Link>
          <Link href='https://www.linkedin.com/company/tren-finance/' target='_blank'>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.3694 24.375L24.375 24.3741V16.0305C24.375 11.9488 23.4963 8.80453 18.7245 8.80453C16.4305 8.80453 14.8911 10.0634 14.2626 11.2568H14.1963V9.1856H9.67188V24.3741H14.383V16.8533C14.383 14.8731 14.7584 12.9583 17.2107 12.9583C19.6269 12.9583 19.6629 15.2181 19.6629 16.9803V24.375H24.3694ZM2.00038 9.18654H6.71722V24.375H2.00038V9.18654ZM4.3569 1.625C2.84876 1.625 1.625 2.84876 1.625 4.3569C1.625 5.86504 2.84876 7.11439 4.3569 7.11439C5.86504 7.11439 7.0888 5.86504 7.0888 4.3569C7.0883 3.63251 6.80031 2.93793 6.28809 2.42571C5.77587 1.91349 5.08129 1.6255 4.3569 1.625Z" fill="#C6C6C7"/>
            </svg>
          </Link>
        </Stack>
      </Stack>
      
      <Stack direction='row' justifyContent={isSmallScreen ? 'center' : 'space-between'} alignItems='center' sx={{ borderTop: 'solid 1px #414141', pt: 6}}>
        <Stack direction='row' sx={{ gap: {xs: 8, md: 4, lg: 12}, display: {xs: 'none', 'md': 'flex'} }}>
          <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} target='_blank' href='https://policy.com' ml={13}>
            Privacy Policy
          </Typography>
          <Typography variant='subtitle1' fontWeight={500} component={LinkStyled} target='_blank' href='https://terms.com'>
            Terms of Use
          </Typography>
        </Stack>
        <Stack direction='row'>
          <Typography fontSize={isSmallScreen ? 12 : 14} sx={{display: 'flex', alignItems: 'center', fontWeight: 400, color: '#979899' }}>
            Tren Finance Protocol
          </Typography>
          <Typography fontSize={isSmallScreen ? 12 : 14} sx={{ml:2, color: (theme) => theme.palette.primary.main}}>
            {`© ${new Date().getFullYear()} All Right Reserved `}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default FooterContent
