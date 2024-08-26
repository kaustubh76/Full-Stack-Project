'use-client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}










/*
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast"
import { signUpSchema } from "@/src/schemas/signUpSchema"
import { useRouter } from "next/router"
import axios, {AxiosError} from 'axios'


const page = () => {
    const [username ,setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername ,setIsCheckingUsername] = useState(false)
    const [isSubmitting, setisSubmiiting] = useState(false)

    const debouncedUsername = useDebounce(username,300)
    const { toast } = useToast()
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if(debouncedUsername){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try{
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                }
                catch(error){
                    const axiosError = error as AxiosError
            }
        }
    }, [deboucedUsername])

    return (
    <div>page</div>
  )
}

export default page
*/
  