// src/pages/Lecturers.tsx
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
  HStack,
} from "@chakra-ui/react";
import { LuSearch, LuDownload } from "react-icons/lu";
import { useStaff } from "@hooks/lecturer.hook";
import type { Staff } from "@type/lecturer.type";
import LecturersTable from "@components/shared/LecturersTable";
import { exportToExcel } from "@utils/excel.util";
import { toaster } from "@components/ui/toaster";

const Lecturers = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter, perPage]);

  const { data: lecturers = [], isLoading } = useStaff();

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
        items: [{ label: "No roles", value: "" }],
      });
    }
    return createListCollection({
      items: [
        { label: "All Roles", value: "" },
        ...uniqueRoles.map((role) => ({
          label: ["HOD", "ERO"].includes(role) 
            ? role 
            : role.replace(/_/g, " ")
                  .split(" ")
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(" "),
          value: role,
        })),
      ],
    });
  }, [uniqueRoles]);

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

  // Pagination
  const totalItems = filteredLecturers.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedLecturers = filteredLecturers.slice(startIndex, startIndex + perPage);

  const handleExport = () => {
    if (!filteredLecturers.length) {
      toaster.warning({ title: "No lecturers to export", description: "There are no lecturers matching the current filters." });
      return;
    }

    try {
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
    } catch (error) {
      console.error("Export failed:", error);
      toaster.error({ title: "Export failed", description: "An unexpected error occurred while exporting. Please try again later." });
    }
  };

  // Collection for per‑page select
  const perPageOptions = [10, 20, 50, 100];
  const perPageCollection = createListCollection({
    items: perPageOptions.map((opt) => ({
      label: `${opt} rows`,
      value: opt.toString(),
    })),
  });

  return (
    <Box maxW="100vw" overflowX="hidden" p="4">
      <Box bg="bg" rounded="md" p="4">
        {/* Filters + per‑page select */}
        <Flex 
          align="center" 
          justify="space-between" 
          gap="3" 
          mb="5" 
          wrap="wrap"
          direction={{ base: "column", sm: "row" }}
          colorPalette="accent"
        >
          <InputGroup startElement={<LuSearch />} width={{ base: "100%", sm: "300px" }}>
            <Input
              placeholder="Search by Name, Email or ID."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
            />
          </InputGroup>

          <Flex gap="3" align="center" wrap="wrap">
            <Select.Root
              collection={roleCollection}
              value={roleFilter ? [roleFilter] : []}
              onValueChange={(e) => setRoleFilter(e.value[0] || "")}
              size="lg"
              width={{ base: "100%", sm: "200px" }}
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

            {/* Rows per page SELECT */}
            <Select.Root
              collection={perPageCollection}
              value={[perPage.toString()]}
              onValueChange={(e) => setPerPage(Number(e.value[0]))}
              size="lg"
              width={{ base: "100%", sm: "120px" }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Rows per page" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {perPageCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Button
              onClick={handleExport}
              colorPalette="accent"
              size="lg"
              width={{ base: "100%", sm: "auto" }}
            >
              <LuDownload size={16} /> Export Table
            </Button>
          </Flex>
        </Flex>

        {/* Scrollable table wrapper */}
        <Box overflowX="auto">
          <LecturersTable
            lecturers={filteredLecturers}
            isLoading={isLoading}
            paginatedLecturers={paginatedLecturers}
            startIndex={startIndex}
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={setCurrentPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Lecturers;