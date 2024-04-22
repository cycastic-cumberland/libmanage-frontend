import React, {useRef} from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import { BiLockAlt } from 'react-icons/bi'
import { useLibmanageAuth } from "../contexts/LibmanageAuthProvider.tsx";
import { LibmanageAuthContextType } from "../contexts/LibmanageAuthContextType.tsx";
import AuthBox from "./AuthBox.tsx";
import Translations from "../I18N.ts";

export const Login = () => {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const pwdRef = useRef<HTMLInputElement | null>(null)
    const { loginWithEmailPassword, isLoggedIn, isLoading } = useLibmanageAuth() as LibmanageAuthContextType;
    const navigate = useNavigate();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        await loginWithEmailPassword(emailRef.current?.value as string, pwdRef.current?.value as string);
        if (isLoggedIn()) navigate("/");
    };

    return (
        <AuthBox>
            <Container className='login-container'>
                <div className=''>
                    <h2 className="login-container-header">{Translations.employeeLoginTitle}</h2>
                </div>
                <Form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="login-form">
                        <Form.Group>
                            <Form.Label id="email" className='sr-only'>{Translations.employeeLoginUsername}</Form.Label>
                            <Form.Control id="email" ref={emailRef} required placeholder={Translations.employeeLoginUsername} className="login-form-email" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label id="password" className='sr-only'>{Translations.employeeLoginPassword}</Form.Label>
                            <Form.Control type='password' id="password" ref={pwdRef} required placeholder={Translations.employeeLoginPassword} className="login-form-password" />
                        </Form.Group>
                    </div>
                    <Button disabled={isLoading} type="submit" className="group login-form-submit">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <BiLockAlt className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400' viewBox='0 0 20 20' fill="currentColor" aria-hidden="true" />
                                    </span>
                        {Translations.employeeLoginBtn}
                    </Button>
                </Form>
            </Container>
        </AuthBox>
    )
}
