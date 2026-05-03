'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner";
import axios, { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// not this one -->
// import { useRouter } from 'next/router';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';


const Page = () => {
    const [username, setUsername] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedUsername] = useDebounceValue(username, 500)
    const router = useRouter();

    // zod schema
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUserMessage('');
                try {
                    // check username uniqueness API call
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                    setUserMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUserMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/sign-up/`, data)
            toast.success("Success message!")
            toast.info(response.data.message)

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
            toast.error("There was a problem with your sign-up. Please try again.");
            // toast.info(errorMessage)
            console.error("Error in signup of the user", errorMessage)
            setIsSubmitting(false)
        }
    }

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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setUsername(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && (
                                        <FormDescription>
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Checking availability...</span>
                                            </div>
                                        </FormDescription>
                                    )}
                                    {!isCheckingUsername && userMessage && (
                                        <FormDescription
                                            className={
                                                userMessage === 'Username is available'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }
                                        >
                                            {userMessage}
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        We will send you a verification code to this email.
                                    </FormDescription>
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
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Make sure it has at least 6 characters.
                                    </FormDescription>
                                    {/* <FormMessage /> */}
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

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page; // capitalized for React component
