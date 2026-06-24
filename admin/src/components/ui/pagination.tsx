import {
  Button,
  IconButton,
  Pagination as ChakraPagination,
} from "@chakra-ui/react"
import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

export interface PaginationRootProps extends ChakraPagination.RootProps {
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "outline" | "solid" | "subtle"
}

export const PaginationRoot = React.forwardRef<
  HTMLDivElement,
  PaginationRootProps
>(function PaginationRoot(props, ref) {
  const { size = "sm", variant = "outline", ...rest } = props
  return (
    <ChakraPagination.Root
      ref={ref}
      type="button"
      {...rest}
    >
      {props.children}
    </ChakraPagination.Root>
  )
})

export const PaginationEllipsis = React.forwardRef<
  HTMLDivElement,
  ChakraPagination.EllipsisProps
>(function PaginationEllipsis(props, ref) {
  return (
    <ChakraPagination.Ellipsis 
      ref={ref} 
      {...props} 
      asChild
      sx={{ cursor: "default" }}
    >
      <MoreHorizontal />
    </ChakraPagination.Ellipsis>
  )
})

export const PaginationItem = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.ItemProps
>(function PaginationItem(props, ref) {
  return (
    <ChakraPagination.Item ref={ref} {...props} asChild>
      <Button 
        variant="ghost" 
        size="sm"
        sx={{
          "&[aria-current=page]": {
            bg: "accent",
            color: "white",
            borderRadius: "md",
            fontWeight: "semibold",
            _hover: {
              bg: "accent",
              color: "white",
            },
          },
          "&:not([aria-current=page])": {
            _hover: {
              bg: "slate.100",
              borderRadius: "md",
            },
          },
        }}
      >
        {props.value}
      </Button>
    </ChakraPagination.Item>
  )
})

export const PaginationPrevTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.PrevTriggerProps
>(function PaginationPrevTrigger(props, ref) {
  return (
    <ChakraPagination.PrevTrigger ref={ref} {...props} asChild>
      <IconButton 
        variant="ghost" 
        size="sm"
        _hover={{ bg: "slate.100", borderRadius: "md" }}
      >
        <ChevronLeft />
      </IconButton>
    </ChakraPagination.PrevTrigger>
  )
})

export const PaginationNextTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.NextTriggerProps
>(function PaginationNextTrigger(props, ref) {
  return (
    <ChakraPagination.NextTrigger ref={ref} {...props} asChild>
      <IconButton 
        variant="ghost" 
        size="sm"
        _hover={{ bg: "slate.100", borderRadius: "md" }}
      >
        <ChevronRight />
      </IconButton>
    </ChakraPagination.NextTrigger>
  )
})

export const PaginationPageText = React.forwardRef<
  HTMLParagraphElement,
  ChakraPagination.PageTextProps
>(function PaginationPageText(props, ref) {
  return (
    <ChakraPagination.PageText ref={ref} {...props} />
  )
})

export const PaginationItems = () => {
  return (
    <ChakraPagination.Context>
      {({ pages }) =>
        pages.map((page, index) => {
          if (page.type === "ellipsis") {
            return <PaginationEllipsis key={index} index={index} />
          }
          return (
            <PaginationItem
              key={index}
              type="page"
              value={page.value}
            />
          )
        })
      }
    </ChakraPagination.Context>
  )
}
