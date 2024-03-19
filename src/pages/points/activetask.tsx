import { useGlobalValues } from '@/context/GlobalContext';
import { formatToThousands } from '@/hooks/utils';
import {Box, Stack, Typography, Link, Button} from '@mui/material'
import Image from 'next/image'

interface Props {
    icon: string;
    title: string;
    exp: number;
    description: string;
    xpPlus: number;
    xpCurrency: string;
    period: string;
    learnMoreLink: string;
}

export const ActiveTask = (props: Props) => {
    const {icon, title, exp, description, xpPlus, xpCurrency, period, learnMoreLink} = props
    const {isSmallScreen} = useGlobalValues()

    return (
        <Box padding={4} borderRadius='10px' bgcolor='#171717'>
            <Stack direction='row' alignItems='center' justifyContent='space-between' my={4}>
                <Stack direction='row' gap={4} alignItems='center'>
                    <Image src={`/images/icons/points/${icon}.svg`}
                        alt={title} 
                        width={32}
                        height={32}
                        priority />
                    <Typography fontSize={isSmallScreen ? 18 : 20} fontWeight={700} color='white'>{title}</Typography>
                </Stack>
                <Typography variant={isSmallScreen ? 'h3' : 'h2'} fontWeight={400} fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='primary'>{exp} XP</Typography>
            </Stack>
            <Typography variant='subtitle1' color='#C6C6C7' lineHeight={1.25} height={80} borderBottom='solid 1px #C6C6C74D'>{description}</Typography>
            <Stack mt={3} direction='row' justifyContent='space-between'>
                <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} color='#C6C6C7' lineHeight={1.25}><span style={{color: 'white'}}>+{formatToThousands(xpPlus).slice(1, -3)} XP</span> / {xpCurrency}</Typography>
                <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} color='#C6C6C7' lineHeight={1.25}>{period}</Typography>
            </Stack>
            <Link href={learnMoreLink}>
                <Button sx={{ width: 1, color: 'white', mt: 8, py: 3}}
                        variant='outlined'
                        color='primary'>
                    Learn more
                </Button>
            </Link>
        </Box>
    )
}