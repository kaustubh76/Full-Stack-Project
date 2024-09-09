'use client'

import { useToast } from "@/src/components/ui/use-toast"
import { Message } from "@/src/model/User"
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/src/types/ApiResponse"
import { boolean } from "zod"
import { User } from "@/src/model/User"
import { Button } from "@react-email/components"
import { Switch } from "@radix-ui/react-switch"

import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/src/components/MessageCard"
import { Separator } from "@/src/components/ui/separator"

const Page = () => {
    const [message, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const {toast} = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(message.filter((message) => message._id !== messageId))
    }

    const {data: session} = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const {register, watch, setValue} = form;

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: axiosError.response?.data.message || 'Error fetching messages',
                variant: "destructive"
            })
        }
        finally{
            setIsSwitchLoading(false)
        }
    }, [setValue, toast])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast({
                    title: 'Messages refreshed',
                    description: "Showing latest messages",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: axiosError.response?.data.message || 'Error fetching messages',
                variant: "destructive"
            })
        }
        finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    },[setIsLoading, setMessages, toast])

    useEffect(() => {
        if(!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage() // set the state of the message and also store the value
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    // handle switch change 
    const handleSwitchChange = async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages: !acceptMessages})
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: "default",

            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: axiosError.response?.data.message || 'Error updating messages',
                variant: "destructive"
            })
        }
    }

    const {username} = session?.user as User
    // TODO: do more research
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "Profile URL copied to clipboard",
            description: "You can now share this link",
        })
    }

    if(!session || !session.user){
        return <div>Sign in to view messages</div>
    }

    else{

    }

  return (
    <>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="test-lg font-semibold mb-2">
              Copy the unique link
          </h1>{' '}
          <div className="flex items-center">
              <input
                  type="text"
                  className="flex-grow p-2 bg-gray-100 rounded"
                  value={profileUrl} />
              <Button onClick={copyToClipboard}>Copy</Button>
          </div>
      </div>
      
      <div className="mb-4">
        <Switch 
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
        />
        <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator/>

      <Button 
      className="mt-4"
        onClick={(e) =>{
            e.preventDefault();
            fetchMessages(true);
        }}
      >
        {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ): (
            <RefreshCcw className="h-4 w-4" />
        )}

      </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* { message.length > 0 ? (
            message.map((message, index) => (
                <MessageCard 
                key={message._id} 
                message={message} 
                onMessageDelete={handleDeleteMessage} />
            ))
            ) : (
                <div className="text-center text-gray-500">No messages</div>
            ) } */}
        </div>

      </> 
  )

}

export default Page