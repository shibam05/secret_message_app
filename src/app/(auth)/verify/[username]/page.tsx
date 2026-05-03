'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    // zod schema
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        // defaultValues: {} // not needed for this form
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code/${params.username}`,
                {
                    username: params.username,
                    code: data.code
                }
            )
            toast.success(response.data.message)
            console.log('Account verified successfully:', response.data)

            router.push('/sign-in')  // TODO: change route/method as needed
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || 'Verification failed. Please try again.')
            console.error('Error verifying account:', error)
        }
    }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [isSubmitting, setIsSubmitting] = useState(false);
    

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='font-extrabold tracking-tight text-4xl lg:text-5xl mb-6'>Join Secrect Message</h1>
                    <p className='mb-4'>Sign up and send your anonymous messages</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)} className='w-full'>
                            {isSubmitting ?
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> please wait...
                                </>
                                : ('Sign up')
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount