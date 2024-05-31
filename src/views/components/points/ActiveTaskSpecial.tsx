import { useGlobalValues } from '@/context/GlobalContext';
import { formatToThousands, formatToThousandsInt } from '@/hooks/utils';
import {Box, Stack, Typography, Link, Button, Grid, Tooltip, IconButton} from '@mui/material'
import Image from 'next/image'
import Icon from '@/@core/components/icon'

interface Props {
    icon: string;
    title: string;
    exp: string;
    description: string;
    learnMoreLink: string;
    tooltip: string;
    from: number;
    to: number;
    percent: number;
}

export const ActiveTaskSpecial = (props: Props) => {
    const {icon, title, exp, description, learnMoreLink, tooltip, from, to, percent} = props
    const {isSmallScreen, isLargeScreen} = useGlobalValues()

    return (
        <Stack padding={4} borderRadius='10px' bgcolor='#171717' height='100%' justifyContent='space-between'>
            <Stack alignItems='start' justifyContent='space-between' mb={4} sx={{flexDirection: {xs: 'row', lg: 'column', xl: 'row'}}}>
                <Stack direction='row' gap={2} alignItems='center' mt={2}>
                    <Image src={`/images/icons/points/${icon}.svg`}
                        alt={title} 
                        width={32}
                        height={32}
                        priority />
                    <Typography fontSize={isSmallScreen ? 14 : 16} fontWeight={700} color='white'>{title}</Typography>
                </Stack>
                <Stack alignItems='end'>
                    <Typography variant={isSmallScreen ? 'h3' : 'h2'} fontWeight={400} whiteSpace='nowrap' textAlign='end' fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='primary'>{exp} XP</Typography>
                    <Typography fontSize={isSmallScreen ? 10 : 12} fontWeight={400} color='#C6C6C7'>per day / per dollar</Typography>
                </Stack>
            </Stack>
            <Stack height={200} justifyContent='space-between'>
                <Typography variant='subtitle2' color='#C6C6C7' lineHeight={1.25}>{description}</Typography>
                <Box mb={6}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Stack direction='row' alignItems='center' gap={0}>
                            <Typography color='#FFF' lineHeight={1.25} sx={{fontSize: {xs: 14, md: 16}}}>Milestone</Typography>
                            <Tooltip title={tooltip} placement='top'>
                                <IconButton sx={{ bgcolor: 'transparent !important'}}>
                                    <Icon fontSize='18' icon='simple-line-icons:question' style={{ color: '#707175', cursor: 'pointer' }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>    
                        <Typography color='#FFF' lineHeight={1.25} sx={{fontSize: {xs: 12, md: 14}, textDecoration: 'underline', cursor: 'pointer'}}>
                            What's this?
                        </Typography>
                    </Stack>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' mt={2}>
                        <Box sx={{borderRadius: '4px', border: 'solid 1px #67DAB1', background: '#67DAB10D', color: '#C6C6C7', fontSize: 14, px: 2.5, py: 1}}>
                            {formatToThousands(from)}m
                        </Box>
                        <Box sx={{borderRadius: '4px', border: 'solid 1px #252525', background: '#171717', color: '#C6C6C7', fontSize: 14, px: 2.5, py: 1}}>
                            {formatToThousands(to)}m
                        </Box>
                    </Stack>
                    <Stack direction='row' justifyContent='space-between' height={12} my={2}>
                        <Box>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="#FFF"/>
                            </svg>
                        </Box>
                        <Box>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="#404141"/>
                            </svg>
                        </Box>
                    </Stack>
                    <Box sx={{
                        width: '100%',
                        height: 4,
                        borderRadius: 8,
                        background: '#404141',
                    }}>
                        <Box sx={{
                            width: `${!percent ? 0 : Math.min(percent, 100)}%`,
                            height: 4,
                            borderRadius: 8,
                            background: '#67DAB1'
                        }}/>
                    </Box>
                </Box>
            </Stack>
            <Stack>
                <Grid container spacing={3.5}>
                    <Grid item xs={12} sm={6}>
                        <Link href={title=='Borrowing' ? '/modules' : '/earn'}>
                            <Button sx={{width: 1, height: 1, color: 'white', py: 3}}
                                    variant='outlined'
                                    color='primary'>
                                {title=='Borrowing' ? 'Borrow' : 'Stake'}
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Link href={learnMoreLink}>
                            <Button sx={{width: 1, height: 1, color: 'white', py: 3}}
                                    variant='outlined'
                                    color='secondary'>
                                Learn more
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    )
}