'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// import Link from 'next/link';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { useState } from 'react';
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
// import { Loader2 } from 'lucide-react';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const Page = () => {
    const router = useRouter();

    // zod schema
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            // TODO: check notes.txt
            email: data.identifier,
            password: data.password,
            // identifier: data.identifier,
            // password: data.password,
            redirect: false
        })
        if (result?.error)
            toast.error("Login Failed")

        if (result?.url) {
            router.replace('/dashboard')
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='font-extrabold tracking-tight text-4xl lg:text-5xl mb-6'>Secrect Message</h1>
                    <p className='mb-4'>Sign In and send your anonymous messages</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="identifier"
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

                        <Button type='submit' onClick={form.handleSubmit(onSubmit)} className='w-full'>
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Dont have an account?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Page; // capitalized for React component
