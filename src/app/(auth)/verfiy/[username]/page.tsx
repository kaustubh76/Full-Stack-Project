"use client"
import { signUpSchema } from '@/src/schemas/signUpSchema'
import { verifySchema } from '@/src/schemas/verifySchema'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AxiosError } from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Button } from '@react-email/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/src/components/ui/use-toast'

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('sign-in')

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "SignUp failed",
                description: axiosError.response?.data.message || "Error creating account",
                variant: "destructive"
            })
        }
    
  return (
    <div className='flex justify-center items-center min-h-screen bg-white rounded-lg shadow-md'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg'>
            <div className='text-center'>
            <h1 className='text-3xl font-semibold text-gray-800'>Verify Account</h1>
            <p className='mt-2 text-sm text-gray-500'>Enter the code sent to your email</p>
            </div>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
          control={form.control}
          name="code"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}
}
export default VerifyAccount