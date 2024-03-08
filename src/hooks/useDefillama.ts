import { useEffect, useState } from 'react'

const PoolIDs = [
  {
    tokenname: 'STETH',
    poolId: '747c1d2a-c668-4682-b9f9-296708a3dd90'
  },
  { tokenname: 'WSTETH', poolId: '747c1d2a-c668-4682-b9f9-296708a3dd90' }
]

// modified from https://usehooks.com/useDebounce/
export default function useDefillama(symbol: string) {
  // const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const POOL_ID = PoolIDs.find(id => id.tokenname)?.poolId

  const requestOptions: RequestInit = {
    method: 'GET', // Example method, replace with your actual method
    redirect: 'follow' // Example redirect value, replace with your actual value
  }

  fetch(`https://yields.llama.fi/chart/${POOL_ID}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))
}
