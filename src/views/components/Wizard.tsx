import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useGlobalValues } from "@/context/GlobalContext";

interface Props {
    step: number;
    header: string;
    description: string;
    isCompleted?: boolean;
    children?: React.ReactNode;
}

export const Wizard: React.FC<Props> = ({header, description, step, isCompleted = false, children}) => {
    const {isMediumScreen} = useGlobalValues()
    return (
        <Stack position='relative' sx={{flex: {xs: 1, lg: 1}, border: 'solid 1px #67DAB1', px: {xs: 4, lg: 8}, py: 8, alignItems: {xs: 'center', lg: 'start'}, justifyContent: 'space-between',
                background: isCompleted ? 'linear-gradient(77deg, rgba(26, 48, 40, 0.00) 3.67%, rgba(29, 101, 75, 0.50) 123.67%, rgba(81, 150, 125, 0.00) 207.99%)' : 'transparent'}}>
            <Box position='absolute' left='50%' sx={{top:{xs: -80, lg: -140}, transform: 'translateX(-50%)', border: 'solid 1px #67DAB133', borderRadius: '100%', width: 48, height: 48, 
                background: {xs: '#212c28', lg: 'linear-gradient(73deg, rgba(26, 48, 40, 0.00) 2.62%, rgba(52, 97, 81, 0.20) 51.46%, rgba(26, 48, 40, 0.00) 101%)'}, zIndex: 1}}>
                <Stack justifyContent='center' alignItems='center' sx={{width: 1, height: 1}}>
                    <Typography sx={{fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`}} fontSize={24}>{step}</Typography>
                </Stack>
            </Box>
            <Box position='absolute' left='50%' sx={{transform: 'translateX(-50%)', width: {xs: 18, lg: 'auto'},  top: {xs: -9, lg: -77}}}>
                <img src={`/images/icons/customized-icons/${isCompleted ? 'active-dot' : 'passive-dot'}.svg`} alt='Active Dot' style={{width: '100%'}}/>
            </Box>
            <Box position='absolute' left='50%' top={isMediumScreen && step != 1 ? -108 : -52} sx={{transform: 'translateX(-50%)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height={isMediumScreen && step != 1 ? 108 : 52} viewBox={`0 0 2 ${isMediumScreen && step != 1 ? 108 : 52}`} fill="none">
                    <path d={`M1 ${isMediumScreen && step != 1 ? 108 : 52}L1 0`} stroke={isCompleted ? '#67DAB1' : '#FBFCFF'} strokeOpacity={isCompleted ? 1 : 0.2} strokeDasharray="5 5"/>
                </svg>
            </Box>
            <Typography className='header-gradient' variant='h1' sx={{
                    mb: { xs: 4, md: 4 },
                    lineHeight: 1.25,
                    fontSize: { xs: 18, md: 24, xl: 32 },
                    maxWidth: {xs: 276, lg: '100%'},
                    textAlign: {xs: 'center', lg: 'start'}
                }}
            >
                {header}
            </Typography>
            <Typography sx={{fontSize: {xs: 14, lg: 18}, mb: {xs: 4, md: 6}, textAlign: {xs: 'center', lg: 'start'}, maxWidth: {xs: 276, lg: '100%'}, fontWeight: 300}}>
                {description}
            </Typography>
            {children}
        </Stack>
    )
}