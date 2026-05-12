import { ErrorBoundary } from "react-error-boundary";

const SignupError = ({children}: {children: React.ReactNode}) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            {children}
        </ErrorBoundary>
    )
}

export default SignupError;