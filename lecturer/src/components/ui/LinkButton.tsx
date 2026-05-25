import { Button, type ButtonProps } from "@chakra-ui/react";
import { Link, type LinkProps } from "react-router";

const LinkButton = (props: ButtonProps & LinkProps) => {
    return (
        <Link to={props.to} state={props.state} replace={props.replace}>
            <Button {...props}>
                {props.children}
            </Button>
        </Link>
    )
}

export default LinkButton;