import { Box, Circle, Flex, Heading, Image, List, Span, Stack, Text } from "@chakra-ui/react"


const OfflineGuide = () => {
    return (
        <Stack gap="4">
            {steps.map((step, index) => (
                <Flex key={index} gap="4" align="start">
                    <Circle hideBelow={"md"} border="xs" borderColor="border.muted" fontWeight={"bold"} fontSize="sm" p="1" rounded="full" bg="bg" w="12" h="12">{index + 1}</Circle>
                    <Stack gap={4} color="fg.muted" bg="bg" border="xs" borderColor="border.muted" rounded="md" p="4">
                        <Box>
                            <Heading fontSize="lg">
                                <Span hideFrom={"md"}>Step {index + 1}:</Span>{" "}
                                {step.title}
                            </Heading>
                            <Text>{step.subTitle}</Text>
                        </Box>
                        <List.Root as="ol" listStylePos={"inside"}>
                            {step.items?.map((item, index) => (
                                <List.Item key={index}>
                                    {item}
                                </List.Item>
                            ))}
                        </List.Root>
                        <Image src={step.imgUrl} alt={step.title} w="full" h="auto" />
                    </Stack>
                </Flex>
            ))}
        </Stack>
    )
}



const steps = [
    {
        imgUrl: "/students/offline-image-1.png",
        title: "Install the Google Docs Offline Chrome Extension",
        subTitle: "To work offline, Google Chrome requires a specific extension to manage your local data sync.",
        items: [
            "Open Google Chrome and head over to the Chrome Web Store.",
            "Search for Google Docs Offline(or navigate directly to it)",
            "Click the Add to Chrome button to install it."
        ],
    },
    {
        imgUrl: "/students/offline-image-2.png",
        title: "Install the Google Drive PWA",
        subTitle: "Installing the Progressive Web App (PWA) gives you a dedicated windowed experience for Google Drive, making it feel like a desktop application.",
        items: [
            "Navigate to your Google Drive homepage in Chrome.",
            "Look at the right side of the browser's address bar (URL bar). You will see an Install icon (a monitor with a down arrow).",
            "Click the icon, and when the prompt asks \"Install app?\", click Install."
        ],
    },
    {
        imgUrl: "/students/offline-image-3.png",
        title: "Enable Offline Mode in Google Drive Settings",
        subTitle: "Before you can mark specific files for offline use, you must turn on the global offline setting in your Google Drive account.",
        items: [
            "Open Google Drive.",
            "Click the Gear icon (Settings) in the top right corner.",
            "Check the box that says: \"Create, open, and edit your recent Google Docs, Sheets, and Slides files on this device while offline.\"",
            "In the General tab, scroll down to the Offline section.",
            "Check the box that says: \"Create, open, and edit your recent Google Docs, Sheets, and Slides files on this device while offline.\""
        ],
    },
    {
        imgUrl: "/students/offline-image-4.png",
        title: "Make Specific Google Docs Available Offline",
        subTitle: "Now that your system is configured, you can choose exactly which documents you want guaranteed access to when you lose internet connection.",
        items: [
            "In Google Drive, find the file (e.g., Offline Strategy Guide) you wish to save.",
            "Right-click on the document.",
            "Locate the \"Make available offline\" option in the context menu.",
            "Click the option to switch it On. A small checkmark icon will appear next to the file name, indicating it is successfully cached for offline use."
        ],
    },

]


export default OfflineGuide;
