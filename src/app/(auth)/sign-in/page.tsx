"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce";
import { useToast } from "@/src/components/ui/use-toast"
import { signInSchema } from "@/src/schemas/signInSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/src/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const Page = () => {
    const { toast } = useToast()
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues:{ 
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if(result?.error){
        if(result.error == 'CredentialsSignin'){
          toast({
            title: "Sign in failed",
            description: "Invalid email or password",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign in failed",
            description: "An error occured",
            variant: "destructive"
          });
        }
      }
      if(result?.url){
        router.replace('/dashboard');
      }
    };
      
    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg" >
        <div className="text-center">
            <h1 className="text-4xl font-extrabold trackign-tight lg:text-5xl mb=6">
                  join Mystery Message
            </h1>
            <p className="mb-4">Sign in to start your adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
            
         <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username" {...field} 
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type = "submit">
            Sign In
        </Button>
          </form>
        </Form>
        <div className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/sign-in">
                <a className="text-blue-500">Sign in</a>
            </Link>
      </div>
    </div>
    </div>
  )
}


export default Page