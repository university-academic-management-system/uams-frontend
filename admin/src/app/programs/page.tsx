import { Box, Flex, Heading, Tabs } from "@chakra-ui/react";
import { BookOpen, Layers } from "lucide-react";

import CoursesTab from "@components/programs/CoursesTab";
import ProgramTypeTab from "@components/programs/ProgramTypeTab";

const ProgramCoursesPage = () => {

    return (
        <Flex direction="column" gap="6">
            <Box>
                <Heading size="xl" color="fg.muted" mb="6">
                    Programs & Courses
                </Heading>
                
                <Tabs.Root defaultValue="courses" variant="enclosed">
                    <Tabs.List mb="6">
                        <Tabs.Trigger value="courses">
                            <BookOpen size={16} /> Courses
                        </Tabs.Trigger>
                        <Tabs.Trigger value="program-types">
                            <Layers size={16} /> Program Types
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="courses" p={0}>
                        <CoursesTab />
                    </Tabs.Content>
                    <Tabs.Content value="program-types" p={0}>
                        <ProgramTypeTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Box>
        </Flex>
    );
};

export default ProgramCoursesPage;
