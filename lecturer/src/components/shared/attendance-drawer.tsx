import { CloseButton, Drawer, Portal } from "@chakra-ui/react"
import type { Course } from "@type/course.type"


const AttendanceDrawer = ({ course, open, setOpen }: { course: Course, open: boolean, setOpen: (s: boolean) => void }) => {
    return (
        <Drawer.Root open={open} onOpenChange={(d) => setOpen(d.open)} size="xl">
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Attendance for {course?.title}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                           
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}


export default AttendanceDrawer
