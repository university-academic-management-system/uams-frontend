import { Link } from "react-router";
import useAuthStore from "@stores/auth.store";
import { useLogin } from "@hooks/auth.hook";
import { useLoginForm } from "@forms/auth.form";
import { PasswordInput } from "@components/ui/password-input";

import { Box, Flex, Text, Image, Input, Field, Button, Stack, Span, Separator, Heading } from "@chakra-ui/react";
import type { LoginFormData } from "@type/auth.type";

const LoginPage = () => {
    const { setAuth } = useAuthStore();
    

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useLoginForm();

    const { mutate: login, isPending: isLoading } = useLogin({
        onSuccess: (response) => {
            setAuth({
                token: response.data.token,
                expireAt: response.data.expiresIn,
                user: response.data.user,
            });

            const userRoles = response.data.user.roles || [response.data.user.role].filter(Boolean) as string[];

            if (userRoles.includes("STUDENT")) {
                window.location.href = "/students";
            } else if (userRoles.includes("STAFF")) {
                if (userRoles.includes("DEPARTMENT_ADMIN")) {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/lecturer";
                }
            } else {
                window.location.href = "/";
            }
        },
    });

    const onSubmit = (formData: LoginFormData) => {
        login(formData);
    };

    return (
        <Flex
            minH="100vh"
            w="full"
            bg="bg.subtle"
            py={{ base: "4", md: "20" }}
            px={{ base: "4", md: 0 }}
            justify={"center"}
            align={{ base: "start", md: "center" }}

        >

            <Stack
                w={{ base: "full", lg: "xl" }}
                align={"center"}
                gap="12"
                p={{ base: "6", md: "12" }}
                bg="bg"
                rounded="md"
                border="xs"
                borderColor={"border.muted"}
            >
                {/* Logo */}
                <Image
                    src="/images/uphcscLG.png"
                    alt="Logo"
                    h="auto"
                    w="80"
                />

                {/* Heading */}
                <Box textAlign="center" >
                    <Heading size="3xl" fontWeight="black">
                        Login
                    </Heading>
                    <Text fontSize="14px" fontWeight="medium" color="fg.subtle">
                        Welcome back please login to your account
                    </Text>
                </Box>

                <Stack gap="6" asChild color="black" colorPalette={"accent"} w="full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <Field.Root invalid={!!errors.email}>
                            <Field.Label>
                                Email Address
                            </Field.Label>
                            <Input
                                type="email"
                                placeholder="Enter Email"
                                {...register("email")}
                                disabled={isLoading}
                                size="xl"
                                _placeholder={{ color: "fg.subtle" }}
                            />
                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                        </Field.Root>


                        {/* Password */}
                        <Field.Root invalid={!!errors.password}>
                            <Field.Label>
                                Password
                            </Field.Label>
                            <PasswordInput
                                placeholder="Enter Password"
                                {...register("password")}
                                disabled={isLoading}
                                size="xl"
                                _placeholder={{ color: "fg.subtle" }}
                            />
                            <Field.ErrorText>
                                {errors.password?.message}
                            </Field.ErrorText>

                            <Field.HelperText textAlign={"right"} color="fg.subtle" w="full">Forgot Password?{" "}
                                <Span asChild color="accent" fontWeight="medium" textDecor={"underline"}>
                                    <Link to="/auth/forgot-password">Click Here</Link>
                                </Span>
                            </Field.HelperText>
                        </Field.Root>



                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="xl"
                            loading={isLoading}
                            loadingText="Logging in..."
                            disabled={isLoading}
                            cursor={isLoading ? "not-allowed" : "pointer"}
                        >
                            Login
                        </Button>
                    </form>
                </Stack>

                <Separator />

                <Text color="fg.subtle" textAlign={"center"}>
                    Are you a student?{" "}
                    <Span asChild color="accent" fontWeight="medium" textDecor={"underline"}>
                        <Link to="/auth/verify">Verify your account</Link>
                    </Span>
                </Text>

            </Stack>

        </Flex >
    );
};

export default LoginPage;