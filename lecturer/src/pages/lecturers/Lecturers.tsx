import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Select,
  Portal,
  createListCollection,
  InputGroup,
  Input,
  Button,
} from "@chakra-ui/react";
import { LuSearch, LuDownload } from "react-icons/lu";
import { StaffHook } from "@hooks/lecturer.hook";
import type { Staff } from "@type/lecturer.type";
import LecturersTable from "@components/shared/LecturersTable";
import { exportToExcel } from "@utils/excel.util";
import { toaster } from "@components/ui/toaster";

const Lecturers = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: lecturers = [], isLoading } = StaffHook.useStaff();

  // Get unique roles from data
  const uniqueRoles = useMemo<string[]>(() => {
    if (!lecturers.length) return [];
    const roles = new Set<string>(
      lecturers
        .flatMap((l) => (l.staffProfile?.staffRoles || []) as string[])
        .filter((role: string) => role && role.trim() !== "")
    );
    return Array.from(roles).sort();
  }, [lecturers]);

  const roleCollection = useMemo(() => {
    if (uniqueRoles.length === 0) {
      return createListCollection({
        items: [{ label: "No roles", value: "" }] as { label: string; value: string; }[],
      });
    }
    return createListCollection({
      items: [
        { label: "All Roles", value: "" },
        ...uniqueRoles.map((role) => ({
          label: ["HOD", "ERO"].includes(role) ? role : role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
          value: role,
        })),
      ] as { label: string; value: string; }[],
    });
  }, [uniqueRoles]);

  // Filter lecturers (client-side)
  const filteredLecturers = useMemo(() => {
    if (!lecturers.length) return [];
    let result = lecturers;

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (l) =>
          l.staffProfile?.staffNumber?.toLowerCase().includes(query) ||
          `${l.staffProfile?.firstName || ""} ${l.staffProfile?.lastName || ""} ${l.staffProfile?.otherName || ""}`.toLowerCase().includes(query) ||
          l.email?.toLowerCase().includes(query) ||
          l.staffProfile?.phone?.toLowerCase().includes(query) ||
          l.staffProfile?.specialization?.toLowerCase().includes(query) ||
          l.staffProfile?.staffRoles?.join(", ").toLowerCase().includes(query)
      );
    }

    if (roleFilter) {
      result = result.filter((l) => l.staffProfile?.staffRoles?.includes(roleFilter));
    }

    return result;
  }, [lecturers, debouncedSearch, roleFilter]);

  const totalCount = lecturers.length;

  // Export handler
  const handleExport = () => {
    const exportData = filteredLecturers.map((l) => ({
      "Staff Number": l.staffProfile?.staffNumber || "—",
      "Full Name": `${l.staffProfile?.firstName || ""} ${l.staffProfile?.lastName || ""} ${l.staffProfile?.otherName || ""}`.trim(),
      "Email": l.email || "—",
      "Phone": l.staffProfile?.phone || "—",
      "Title": l.staffProfile?.title || "—",
      "Roles": l.staffProfile?.staffRoles?.join(", ") || "—",
      "Specialization": l.staffProfile?.specialization || "—",
      "Department": l.staffProfile?.department || "—",
      "Faculty": l.staffProfile?.faculty || "—",
      "Status": l.status || "—",
    }));
    exportToExcel(exportData, "Lecturers_List", "Lecturers");
    toaster.success({ title: "Exported successfully" });
  };

  return (
    <Box>
      {/* Heading – inline count */}
      <Flex align="baseline" gap="2" mb="6">
        <Heading color="fg.muted" mb="0">
          Lecturers
        </Heading>
        <Text as="span" color="fg.subtle" fontSize="lg">
          ({filteredLecturers.length} / {totalCount})
        </Text>
      </Flex>

      <Box bg="bg" rounded="md" p="4">
        {/* Filters – always visible */}
        <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap" colorPalette={"accent"}>
          <InputGroup startElement={<LuSearch />} width="300px">
            <Input
              placeholder="Search by Name, Email or ID."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
            />
          </InputGroup>

          <Flex gap="3" align="center">
            <Select.Root
              collection={roleCollection}
              value={roleFilter ? [roleFilter] : []}
              onValueChange={(e) => setRoleFilter(e.value[0] || "")}
              size="lg"
              width="200px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Roles" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {roleCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              colorPalette={"accent"}
              gap="2"
              size="lg"
              rounded="md"
              cursor="pointer"
            >
              <LuDownload size={16} /> Export Table
            </Button>
          </Flex>
        </Flex>

        <LecturersTable
          lecturers={filteredLecturers}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Lecturers;