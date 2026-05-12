import { useSignupForm } from "@forms/auth.form";
import { useCallback } from "react";
import { Container, Field, Heading, Input, Stack } from "@chakra-ui/react";
import { PasswordInput } from "@components/ui/password-input";
import { useNavigate } from "react-router";
import type { AuthState, SignupFormData } from "@type/auth.type";
import { useSignup } from "@hooks/auth.hook";
import useAuthStore from "@stores/auth.store";
import SubmitButton from "@components/shared/buttons/SubmitButton";
import SignupError from "./error";

const Content = () => {
    const { register, handleSubmit, formState: { errors } } = useSignupForm();
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const { mutateAsync: signup, isPending } = useSignup({
        onSuccess: (data) => {
            setAuth(data as AuthState);
            navigate("/");
        }
    });

    const onSubmit = useCallback((data: SignupFormData) => {
        signup(data);
    }, [])

    return (
        <Container py="6" maxW="md">
            <Heading>Sign Up</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="3">
                    <Field.Root invalid={!!errors.name?.message}>
                        <Field.Label>Full Name</Field.Label>
                        <Input {...register("name")} />
                        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.email?.message}>
                        <Field.Label>Email Address</Field.Label>
                        <Input type="email" {...register("email")} />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.password?.message}>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput {...register("password")} />
                        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    </Field.Root>
                    <SubmitButton loading={isPending} loadingText="Signing up" type="submit">Signup</SubmitButton>
                </Stack>
            </form>
        </Container>
    )
}


const SignupPage = () => {
    return (
        <SignupError>
            <Content />
        </SignupError>
    )
}

export default SignupPage;
