// src/components/shared/LecturersTable.tsx
import {
  Box,
  Table,
  Text,
  Flex,
  Button,
  Portal,
  Drawer,
  CloseButton,
  For,
  Heading,
  Spinner,
  EmptyState,
  VStack,
  ButtonGroup,
  IconButton,
  Pagination,
  Badge,
  Menu,
} from "@chakra-ui/react";
import { MoreHorizontal, Users } from "lucide-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { Staff, LecturersTableProps } from "@type/lecturer.type";
import { LECTURERS_TABLE_COLUMNS } from "@type/lecturer.type";
import { formatRole } from "@utils/function.util";

const LecturerActionCell = ({ lecturer }: { lecturer: Staff }) => {
  const courses = lecturer.courses || [];
  const name =
    `${lecturer.staffProfile?.firstName || ""} ${lecturer.staffProfile?.otherName || ""}`.trim() ||
    "Staff";

  return (
    <Drawer.Root>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="ghost" size="xs">
            <MoreHorizontal />
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Drawer.Trigger asChild>
                <Menu.Item value="courses">Courses</Menu.Item>
              </Drawer.Trigger>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title fontSize="lg">{name}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body spaceY="4" py="6">
              <Heading size="sm" color="fg.muted">Assigned Courses</Heading>
              <For
                each={courses}
                fallback={
                  <Flex direction="column" align="center" justify="center" py="10" opacity="0.6">
                    <Text fontSize="sm" color="fg.subtle">No courses assigned</Text>
                  </Flex>
                }
              >
                {(course) => (
                  <Box
                    key={course.id}
                    border="1px solid"
                    borderColor="border.muted"
                    rounded="lg"
                    p="4"
                  >
                    <Text color="fg.muted" fontSize="sm" mb="1">{course.code}</Text>
                    <Heading size="sm" color="fg.muted">{course.title}</Heading>
                  </Box>
                )}
              </For>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" pos="absolute" top="4" right="4" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

interface LecturersTablePropsExtended extends LecturersTableProps {
  paginatedLecturers: Staff[];
  startIndex: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const LecturersTable = ({
  lecturers,          // not used directly for rendering, but still passed for pagination info
  isLoading,
  paginatedLecturers,
  startIndex,
  currentPage,
  totalPages,
  perPage,
  onPageChange,
}: LecturersTablePropsExtended) => {
  return (
    <Box>
      <Table.ScrollArea>
        <Table.Root size="lg" variant="outline" stickyHeader>
          <Table.Header>
            <Table.Row>
              {LECTURERS_TABLE_COLUMNS.map((col) => (
                <Table.ColumnHeader
                  key={col.key}
                  bg="bg.muted"
                  fontSize="lg"
                  fontWeight="600"
                  color="fg.muted"
                  textTransform="none"
                  minW={col.width}
                  px="4"
                  py="3"
                  whiteSpace="nowrap"
                >
                  {col.label}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={LECTURERS_TABLE_COLUMNS.length} textAlign="center" py={12}>
                  <Flex justify="center" align="center" gap="3">
                    <Spinner size="lg" color="accent.500" />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : lecturers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={LECTURERS_TABLE_COLUMNS.length} textAlign="center" py={12}>
                  <Flex justify="center">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <Users />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>No lecturers found</EmptyState.Title>
                          <EmptyState.Description>
                            Try adjusting your search or filter criteria.
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedLecturers.map((lecturer, index) => {
                const staffRole = lecturer.staffProfile?.staffRoles?.[0];
                const formattedRole = formatRole(staffRole);
                const courseCount = lecturer.courses?.length ?? 0;
                return (
                  <Table.Row key={lecturer.id}>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.600" whiteSpace="nowrap">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {lecturer.staffProfile?.staffNumber || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" fontWeight="600" whiteSpace="nowrap">
                      {`${lecturer.staffProfile?.firstName || ""} ${lecturer.staffProfile?.lastName || ""} ${lecturer.staffProfile?.otherName || ""}`.trim() || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.500" whiteSpace="nowrap">
                      {lecturer.email || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {lecturer.staffProfile?.phone || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <Badge colorPalette="gray" variant="subtle" fontSize="sm" px="2" py="0.5">
                        {formattedRole}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {courseCount}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <LecturerActionCell lecturer={lecturer} />
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Pagination controls */}
      {!isLoading && lecturers.length > 0 && totalPages > 1 && (
        <Flex justify="center" mt="4">
          <Pagination.Root
            count={lecturers.length}
            pageSize={perPage}
            page={currentPage}
            onPageChange={(e) => onPageChange(e.page)}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
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
  );
};

export default LecturersTable;