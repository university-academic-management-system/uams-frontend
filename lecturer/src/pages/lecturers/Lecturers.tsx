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
  Table,
  Button,
  Center,
  Spinner,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import { LuCircleAlert, LuSearch, LuUsers } from "react-icons/lu";
import { StaffHook } from "@hooks/lecturer.hook";
import type { Staff } from "@type/lecturer.type";

const ITEMS_PER_PAGE = 10;

const Lecturers = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter]);

  const { data: lecturers = [], isLoading, error } = StaffHook.useStaff();

  // Get unique roles from data
  const uniqueRoles = useMemo(() => {
    if (!lecturers.length) return [];
    const roles = new Set(
      lecturers
        .flatMap((l) => l.staffProfile?.staffRoles || [])
        .filter((role) => role && role.trim() !== "")
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
        ...uniqueRoles.map((role) => ({ label: role, value: role })),
      ],
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
  const totalPages = Math.ceil(filteredLecturers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLecturers = filteredLecturers.slice(startIndex, endIndex);

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
        <Flex align="center" justify="flex-end" gap="3" mb="5" wrap="wrap" colorPalette={"accent"}>
          <InputGroup startElement={<LuSearch />} width="260px">
            <Input
              placeholder="Search by Name, Email or Code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fontSize="xs"
            />
          </InputGroup>

          <Select.Root
            collection={roleCollection}
            value={roleFilter ? [roleFilter] : []}
            onValueChange={(e) => setRoleFilter(e.value[0] || "")}
            size="md"
            width="140px"
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
        </Flex>

        {/* Table – header always visible */}
        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Staff Number</Table.ColumnHeader>
                <Table.ColumnHeader>Full Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Phone</Table.ColumnHeader>
                <Table.ColumnHeader>Specialization</Table.ColumnHeader>
                <Table.ColumnHeader>Current Role</Table.ColumnHeader>
                <Table.ColumnHeader>Additional Roles</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {/* Loading state */}
              {isLoading && (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py={10}>
                    <Center>
                      <Spinner size="lg" color="accent.500" />
                    </Center>
                  </Table.Cell>
                </Table.Row>
              )}

              {/* Error state */}
              {!isLoading && error && (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py={10}>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <LuCircleAlert />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>Failed to load lecturers</EmptyState.Title>
                          <EmptyState.Description>{error.message}</EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              )}

              {/* Empty state (no data, no error) */}
              {!isLoading && !error && paginatedLecturers.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py={10}>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <LuUsers />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>No lecturers found</EmptyState.Title>
                          <EmptyState.Description>
                            {lecturers.length === 0
                              ? "No lecturer data available."
                              : "Try adjusting your search or filters."}
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              )}

              {/* Data rows */}
              {!isLoading && !error && paginatedLecturers.length > 0 &&
                paginatedLecturers.map((lecturer) => (
                  <Table.Row key={lecturer.id}>
                    <Table.Cell>{lecturer.staffProfile?.staffNumber || "—"}</Table.Cell>
                    <Table.Cell>{`${lecturer.staffProfile?.firstName || ""} ${lecturer.staffProfile?.lastName || ""} ${lecturer.staffProfile?.otherName || ""}`.trim() || "—"}</Table.Cell>
                    <Table.Cell>{lecturer.email || "—"}</Table.Cell>
                    <Table.Cell>{lecturer.staffProfile?.phone || "—"}</Table.Cell>
                    <Table.Cell>{lecturer.staffProfile?.specialization || "—"}</Table.Cell>
                    <Table.Cell>{lecturer.staffProfile?.title || "—"}</Table.Cell>
                    <Table.Cell>
                      {lecturer.staffProfile?.staffRoles?.join(", ") || "—"}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {/* Pagination – hidden when no lecturers to show */}
        {filteredLecturers.length > 0 && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            bg="white"
            rounded="md"
            border="1px solid"
            borderColor="border.muted"
            p="4"
            mt="4"
            wrap="wrap"
            gap="2"
          >
            <Text fontSize="sm" color="fg.muted">
              Showing{" "}
              <Text as="span">
                {filteredLecturers.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredLecturers.length)}
              </Text>{" "}
              of <Text as="span">{filteredLecturers.length}</Text> lecturers
            </Text>
            <Flex alignItems="center" gap="2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                size="sm"
                variant="outline"
                borderColor="border.muted"
                bg="white"
                color="fg.muted"
              >
                Previous
              </Button>

              {totalPages === 0 ? (
                <Button
                  size="sm"
                  variant="solid"
                  bg="accent"
                  color="white"
                  minW="36px"
                >
                  1
                </Button>
              ) : (
                Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  const isActive = currentPage === pageNum;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      size="sm"
                      variant={isActive ? "solid" : "outline"}
                      bg={isActive ? "#1D7AD9" : "white"}
                      color={isActive ? "white" : "gray.700"}
                      borderColor={isActive ? "transparent" : "gray.200"}
                      fontWeight="medium"
                      minW="36px"
                    >
                      {pageNum}
                    </Button>
                  );
                })
              )}

              <Button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                size="sm"
                variant="outline"
                borderColor="border.muted"
                bg="white"
                color="fg.muted"
              >
                Next
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Lecturers;