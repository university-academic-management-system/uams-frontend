import { HStack, Stack, Text } from "@chakra-ui/react";
import { LuListTodo, LuKanban, LuBriefcaseBusiness, LuActivity } from "react-icons/lu";
import { PiGearSixBold, PiSpeedometerBold } from "react-icons/pi";
import { Tooltip } from "../ui/tooltip";
import { Link, useLocation } from "react-router";

const SubSidebar = () => {
    const pathname = useLocation().pathname;
    const path = pathname.replace(/\/+$/, "");
    const portal = path.startsWith("/payments")
        ? "payments"
        : "settings"

    const items = portal === "payments"
        ? [
            { name: "Setup checklist", href: "/overview/setup-checklist", Icon: LuListTodo },
            { name: "General overview", href: "/overview/general-overview", Icon: PiSpeedometerBold },
            { name: "Activity log", href: "/overview/activity-log", Icon: LuActivity },
        ]
        :
        [
            { name: "Overview", href: "/m-e", Icon: LuListTodo },
            { name: "Projects", href: "/m-e/projects", Icon: LuKanban },
            { name: "Workplans", href: "/m-e/workplans", Icon: LuBriefcaseBusiness },
            { name: "Settings", href: "/m-e/settings", Icon: PiGearSixBold },
        ]



    const isActive = (href: string) => {
        const normalize = (p: string) => (p === "" ? "/" : p.replace(/\/+$/, ""));
        const parse = (pathname: string): { portal: "payments" | "settings" | "m-e" | "e-admin" | "finance" | null; section: string | null; id: string | null } => {
            const trimmed = normalize(pathname);
            const parts = trimmed.split("/").filter(Boolean);
            if (parts.length === 0) return { portal: "payments", section: null, id: null };
            const p0 = parts[0];
            const portal = p0 === "payments" || p0 === "settings" || p0 === "m-e" || p0 === "e-admin" || p0 === "finance" ? p0 : null;
            const section = parts[1] ?? null;
            const id = parts[2] ?? null;
            return { portal, section, id };
        };

        const current = normalize(path);
        const base = normalize(href);
        const baseParts = base.split("/").filter(Boolean);
        if (baseParts.length <= 1) {
            return current === base || current.endsWith(base + "/");
        }
        if (current === base || current.startsWith(base + "/")) return true;

        const info = parse(current);
        if (!info.portal) return base === "/";
        if (info.section && base === `/${info.portal}/${info.section}`) return true;
        if (info.id && base === `/${info.portal}/${info.section}/${info.id}`) return true;
        return false;
    };

    // Always show subsidebar including for /settings portal

    return (
        <Stack display={pathname === "/" ? "none" : "auto"} as="nav" w='200px' bg="white" h="full" p="2" gap="33px" borderLeft={"sm"} borderRight={"sm"} borderColor="border" aria-label="Sub navigation" onKeyDown={(e) => {
            const container = e.currentTarget as HTMLElement;
            const links = Array.from(container.querySelectorAll('a')) as HTMLElement[];
            const idx = links.findIndex(el => el === document.activeElement);
            if (e.key === 'ArrowDown') {
                const next = links[Math.min(idx + 1, links.length - 1)];
                next?.focus();
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                const prev = links[Math.max(idx - 1, 0)];
                prev?.focus();
                e.preventDefault();
            }
        }}>
            {/* <HStack justify="space-between" align="center">
                <Text fontWeight="semibold" color="fg">{portal === "m-e" ? "M&E" : portal === "e-admin" ? "E-Admin" : portal === "finance" ? "Finance" : portal === "settings" ? "Settings" : "Overview"}</Text>
            </HStack> */}

            <Stack gap="0">
                {items.map((it) => (
                    <Link key={it.href} to={it.href}>
                        <Tooltip positioning={{ placement: "right" }} showArrow content={it.name}>
                            <HStack gap="3" p="2" rounded="md" color={isActive(it.href) ? "fg" : "fg.muted"} fontWeight={isActive(it.href) ? "semibold" : "medium"} _hover={{ bg: "bg.muted", color: "fg.muted" }} justify="space-between">
                                <HStack gap="2" align="center">
                                    <it.Icon size={16} />
                                    <Text lineClamp={1} fontSize="sm">{it.name}</Text>
                                </HStack>
                                {isActive(it.href) && <Text color="accent.600">•</Text>}
                            </HStack>
                        </Tooltip>
                    </Link>
                ))}
            </Stack>

        </Stack>
    );
};

export default SubSidebar;
