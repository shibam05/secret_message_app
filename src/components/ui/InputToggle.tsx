import React, { useState } from 'react';
import { FormField, FormItem, FormControl, FormMessage } from './form'; // Adjust import path as needed
import { Input } from './input'; // Adjust import path as needed
import { Eye, EyeOff } from 'lucide-react'; // Or your icon library
import { Label } from './label'; // Adjust import path as needed

const inputLead = "block w-full px-4 py-2 bg-gray-800 text-gray-300 rounded";
const labelLead = "absolute left-4 top-2 text-gray-400 pointer-events-none transition-all";

import { Control, FieldValues } from 'react-hook-form';

type PasswordFieldProps = {
    control: Control<FieldValues>;
};

export const PasswordField: React.FC<PasswordFieldProps> = ({ control }) => {
    const [isView, setIsView] = useState(false);

    return (
        <FormField
            control={control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={isView ? "text" : "password"}
                                id="password"
                                className={inputLead}
                                placeholder=" "
                                style={{
                                    WebkitBoxShadow: "0 0 0px 1000px #111827 inset",
                                    WebkitTextFillColor: "#D1D5DB",
                                }}
                                {...field}
                            />
                            {isView ? (
                                <Eye
                                    className="absolute right-4 top-4 z-10 cursor-pointer text-gray-500"
                                    onClick={() => {
                                        setIsView(!isView);
                                        console.log(isView);
                                    }}
                                />
                            ) : (
                                <EyeOff
                                    className="absolute right-4 top-4 z-10 cursor-pointer text-gray-500"
                                    onClick={() => setIsView(!isView)}
                                />
                            )}
                            <Label htmlFor="password" className={labelLead}>
                                Password
                            </Label>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

