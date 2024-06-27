import { useGlobalValues } from '@/context/GlobalContext';
import { formatToThousands, formatToThousandsInt } from '@/hooks/utils';
import {Box, Stack, Typography, Link, Button} from '@mui/material'
import Image from 'next/image'

interface Props {
    icon: string;
    title: string;
    exp: string;
    description: string;
    plus: string;
    period: string;
    learnMoreLink: string;
    totalReferralXP?: number;
}

export const ActiveTask = (props: Props) => {
    const {icon, title, exp, description, plus, period, learnMoreLink, totalReferralXP = 0} = props
    const {isSmallScreen} = useGlobalValues()

    return (
        <Stack padding={4} borderRadius='10px' bgcolor='#171717' height='100%' justifyContent='space-between'>
            <Stack direction='row' alignItems='center' justifyContent='space-between' mb={8}>
                <Stack direction='row' gap={2} alignItems='center'>
                    <Image src={`/images/icons/points/${icon}.svg`}
                        alt={title} 
                        width={32}
                        height={32}
                        priority />
                    <Typography fontSize={isSmallScreen ? 16 : 18} fontWeight={700} color='white'>{title}</Typography>
                </Stack>
                <Typography variant={isSmallScreen ? 'h3' : 'h2'} fontWeight={400} textAlign='end' className='font-britanica' color='primary'>{exp}</Typography>
            </Stack>
            <Box height={140}>
                <Typography variant='subtitle2' color='#C6C6C7' lineHeight={1.25}>{description}</Typography>
                <Stack direction='row' justifyContent='space-between' mt={8} display={title == 'Refer Friends' ? 'flex' : 'none'}>
                    <Typography color='#FFF' lineHeight={1.25} sx={{fontSize: {xs: 12, md: 14}}}>Total Referral XP</Typography>
                    <Typography color='#FFF' lineHeight={1.25} sx={{fontSize: {xs: 12, md: 14}}}>{formatToThousandsInt(totalReferralXP)} XP</Typography>
                </Stack>
            </Box>
            <Stack borderTop='solid 1px #C6C6C74D'>
                <Stack mt={2} direction='row' justifyContent='space-between'>
                    <Typography color='#C6C6C7' lineHeight={1.25} sx={{fontSize: {xs: 12, md: 14}}}>{plus}</Typography>
                    <Typography color='#C6C6C7' lineHeight={1.25} sx={{fontSize: {xs: 12, md: 14}}}>{period}</Typography>
                </Stack>
                <Link href={learnMoreLink}>
                    <Button sx={{ width: 1, color: 'white', mt: 6, py: 3}}
                            variant='outlined'
                            color='primary'>
                        Learn more
                    </Button>
                </Link>
            </Stack>
        </Stack>
    )
}