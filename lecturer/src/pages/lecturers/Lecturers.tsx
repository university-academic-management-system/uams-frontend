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
  Center,
  Spinner,
  EmptyState,
  VStack,
  Pagination,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { LuCircleAlert, LuSearch, LuUsers, LuChevronLeft, LuChevronRight } from "react-icons/lu";
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
        ...uniqueRoles.map((role) => ({ label: role, value: role })),
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
        <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap" colorPalette={"accent"}>
          <InputGroup startElement={<LuSearch />} width="260px">
            <Input
              placeholder="Search by Name, Email or Code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
            />
          </InputGroup>

          <Select.Root
            collection={roleCollection}
            value={roleFilter ? [roleFilter] : []}
            onValueChange={(e) => setRoleFilter(e.value[0] || "")}
            size="lg"
            width="180px"
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
          <Table.Root size="lg" variant="outline">
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
                paginatedLecturers.map((lecturer: Staff) => (
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

    
        {filteredLecturers.length >= 20 && (
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            mt="4"
          >
            <Pagination.Root
              count={filteredLecturers.length}
              pageSize={ITEMS_PER_PAGE}
              page={currentPage}
              onPageChange={(e) => setCurrentPage(e.page)}
            >
              <ButtonGroup variant="ghost" size="sm" gap="1">
                <Pagination.PrevTrigger asChild>
                  <IconButton>
                    <LuChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(page) => (
                      <IconButton
                    variant={{ base: "ghost", _selected: "outline" }}
                      >
                        {page.value}
                      </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Lecturers;