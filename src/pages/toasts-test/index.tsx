// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import CardSnippet from 'src/@core/components/card-snippet'

// ** Demo Components
import ToastBlank from 'src/views/components/toast/ToastBlank'
import ToastError from 'src/views/components/toast/ToastError'
import ToastEmoji from 'src/views/components/toast/ToastEmoji'
import ToastThemed from 'src/views/components/toast/ToastThemed'
import ToastCustom from 'src/views/components/toast/ToastCustom'
import ToastSuccess from 'src/views/components/toast/ToastSuccess'
import ToastPromise from 'src/views/components/toast/ToastPromise'
import ToastMultiLine from 'src/views/components/toast/ToastMultiLine'
import ToastCustomPosition from 'src/views/components/toast/ToastCustomPosition'

// ** Source code imports
import * as source from 'src/views/components/toast/ToastSourceCode'
import { Card } from '@mui/material'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ReactHotToasts = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <PageHeader
        subtitle={<Typography sx={{ color: 'text.secondary' }}>We can see several notificatons demo.</Typography>}
        title={
          <Typography variant='h4' color='primary'>
              TrenFinance Toast Tests
          </Typography>
        }
      />
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastBlank />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastMultiLine />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastSuccess />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastError />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastPromise />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastEmoji />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastThemed />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastCustom />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{display: 'flex', p: 8}}>
          <ToastCustomPosition />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReactHotToasts
