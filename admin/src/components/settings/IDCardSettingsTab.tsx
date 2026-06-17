import { Button, ButtonGroup, Card, FileUpload, Heading, Image, SimpleGrid, Stack, Spinner } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { LuPencil } from "react-icons/lu";
import { IDCardHooks } from "@hooks/idcard.hook";

const IDCardSettingsTab = () => {
    const { data, isLoading, isError } = IDCardHooks.useIDCardTemplates();
    const urls = data?.data;

    if (isLoading) {
        return (
            <Stack gap="4" alignItems="center" py="10">
                <Spinner size="xl" />
            </Stack>
        );
    }

    if (isError) {
        return (
            <Stack gap="4">
                <Heading>ID Card Template</Heading>
                <Card.Root p="6"><Card.Title>Failed to load templates. Please try again.</Card.Title></Card.Root>
            </Stack>
        );
    }

    return (
        <Stack gap="4">
            <Heading>ID Card Template</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                <IDCardFrontTemplate url={urls?.frontUrl} />
                <IDCardBackTemplate url={urls?.backUrl} />
                <Signature url={urls?.signatureUrl} />
            </SimpleGrid>
        </Stack>
    );
};

interface TemplateCardProps {
    type: string;
    title: string;
    alt: string;
    fallbackSrc: string;
    url?: string;
}

const TemplateCard = memo(({ type, title, alt, fallbackSrc, url }: TemplateCardProps) => {
    const [file, setFile] = useState<File | null>(null);
    const uploadMutation = IDCardHooks.useUploadIDCardTemplate();

    const handleCancel = useCallback(() => setFile(null), []);
    const handleSave = useCallback(() => {
        if (!file) return;
        uploadMutation.mutate({ file, type }, {
            onSuccess: () => setFile(null),
        });
    }, [file, type, uploadMutation]);

    const imageSrc = file ? URL.createObjectURL(file) : (url || fallbackSrc);

    return (
        <Card.Root overflow="hidden" borderColor="border.muted">
            <Image
                src={imageSrc}
                alt={alt}
                objectFit="cover"
                maxH="27.5em"
            />
            <Card.Footer mt="4" gap="2" w="full" justifyContent="space-between">
                <Card.Title>{title}</Card.Title>
                {file ? (
                    <ButtonGroup variant="ghost" size="xl">
                        <Button colorPalette="red" onClick={handleCancel} disabled={uploadMutation.isPending}>
                            <X /> Cancel
                        </Button>
                        <Button colorPalette="green" onClick={handleSave} loading={uploadMutation.isPending}>
                            <Check /> Save
                        </Button>
                    </ButtonGroup>
                ) : (
                    <FileUpload.Root maxFiles={1} accept={["image/webp", "image/png", "image/jpeg"]} onFileChange={(f) => setFile(f.acceptedFiles[0] || null)} w="fit">
                        <FileUpload.HiddenInput />
                        <FileUpload.Trigger asChild>
                            <Button colorPalette="accent" variant="subtle" size="xl"><LuPencil /> Update</Button>
                        </FileUpload.Trigger>
                    </FileUpload.Root>
                )}
            </Card.Footer>
        </Card.Root>
    );
});

const IDCardFrontTemplate = memo(({ url }: { url?: string }) => (
    <TemplateCard
        type="front-template"
        title="Front Template"
        alt="ID Card Front Template"
        fallbackSrc="/admin/assets/id-card-front-template.png"
        url={url}
    />
));

const IDCardBackTemplate = memo(({ url }: { url?: string }) => (
    <TemplateCard
        type="back-template"
        title="Back Template"
        alt="ID Card Back Template"
        fallbackSrc="/admin/assets/id-card-back-template.png"
        url={url}
    />
));

const Signature = memo(({ url }: { url?: string }) => (
    <TemplateCard
        type="signature-template"
        title="Signature Template"
        alt="Signature Template"
        fallbackSrc="/admin/assets/signature-template.png"
        url={url}
    />
));

export default IDCardSettingsTab;
