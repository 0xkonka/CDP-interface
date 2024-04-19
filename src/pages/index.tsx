import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAccount } from "wagmi"

const Home = () => {
  const router = useRouter()
  useEffect(
    () => {
      router.replace('/modules')
    }
  )
  
  return <></>
}

export default Home
