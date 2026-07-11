import { Button, DataList, Dialog, Field, Heading, InputGroup, Portal, CloseButton, SimpleGrid, Skeleton, Stack, FileUpload, Input, Box, Spinner, Text } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { type Options, passwordStrength } from "check-password-strength"
import { useCallback, useMemo, useRef, useState } from "react"
import { Editable, IconButton } from "@chakra-ui/react"
import { LuCheck, LuFileUp, LuPencilLine, LuUserRound, LuX, LuCamera } from "react-icons/lu"
import { useChangePassword, useMe, useUpdateContact } from "@hooks/auth.hook";
import { useChangePasswordForm } from "@forms/auth.form";
import type { ChangePasswordFormData } from "@schemas/auth.schema";
import { toaster } from "@components/ui/toaster";
import { useGetPayments } from "@hooks/payment.hook";
import EmptyStateView from "@components/shared/empty-state";
import { useInitializePayment } from "@hooks/registration.hook";
import type { PaymentType } from "@type/registration.type";
import { useIdCards, useIDCardTemplates, useUploadToStorage } from "@hooks/id-card.hook";
import type { StudentProfile } from "@type/auth.type";
import type { IdCardRequest } from "@type/id-card.type";
import moment from "moment";
import {
    Document,
    Page,
    View,
    Text as PDFText,
    Image as PDFImage,
    StyleSheet,
    pdf,
    Font,
} from "@react-pdf/renderer";
import ENV from "@configs/env.config";
import axiosClient from "@configs/axios.config";



const strengthOptions: Options<string> = [
    { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
    { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
    { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
    { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
]


const Profile = () => {
    const { data: me, isLoading } = useMe();

    if (isLoading) {
        return (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                <Skeleton h="400px" />
                <Skeleton h="400px" />
                <Skeleton h="400px" />
                <Skeleton h="400px" />
            </SimpleGrid>
        )
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">

            {/* Bio data */}
            <Stack
                bg="bg"
                border="xs"
                borderColor="border.muted"
                rounded="md"
                p="4"
            >
                <Heading>Bio data</Heading>
                <DataList.Root size="md">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                        <DataList.Item>
                            <DataList.ItemLabel>Surname</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.surname}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>First name</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.firstName}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Other name</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.otherName}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Email</DataList.ItemLabel>
                            <EmailEditable email={me?.email || ""} />
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Phone number</DataList.ItemLabel>
                            <PhoneNumberEditable phone={me?.studentProfile?.phone || ""} />
                        </DataList.Item>
                    </SimpleGrid>
                </DataList.Root>
            </Stack>


            {/* Academic data */}
            <Stack
                bg="bg"
                border="xs"
                borderColor="border.muted"
                rounded="md"
                p="4"
            >
                <Heading>Academic data</Heading>
                <DataList.Root size="md">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                        <DataList.Item>
                            <DataList.ItemLabel>Faculty</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.faculty}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Department</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.department}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Registration number</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.registrationNo}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Matriculation number</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.matricNumber}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Level</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.level}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Admission Session</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.admissionSession}</DataList.ItemValue>
                        </DataList.Item>
                    </SimpleGrid>
                </DataList.Root>
            </Stack>



            {/* Security settings */}
            <PasswordUpdate />


            {/* ID card application form */}
            <Stack
                bg="bg"
                border="xs"
                borderColor="border.muted"
                rounded="md"
                p="4"
            >
                <Heading>ID card application</Heading>
                <IDCardApplication student={me?.studentProfile} />
            </Stack>


        </SimpleGrid >
    );
};


const PasswordUpdate = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useChangePasswordForm();
    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");
    const currentPassword = watch("currentPassword");

    const strength = useMemo(() => {
        if (!newPassword) return 0
        const result = passwordStrength(newPassword, strengthOptions)
        return result.id
    }, [newPassword])

    const isDisabled = !newPassword
        || !confirmPassword
        || strength < 3
        || !currentPassword
        || newPassword !== confirmPassword

    const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
        onSuccess: () => {
            toaster.success({ description: "Password changed successfully" });
            reset();
        }
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });
    };


    return (
        <Stack
            bg="bg"
            border="xs"
            borderColor="border.muted"
            rounded="md"
            p="4"
        >

            <Heading>Security settings</Heading>
            <Stack asChild gap="4" colorPalette={"accent"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field.Root invalid={!!errors.currentPassword}>
                        <Field.Label>Current password</Field.Label>
                        <PasswordInput size="xl" {...register("currentPassword")} />
                        <Field.ErrorText>{errors.currentPassword?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.newPassword}>
                        <Field.Label>New password</Field.Label>
                        <PasswordInput size="xl" {...register("newPassword")} />
                        <PasswordStrengthMeter value={strength} />
                        <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.confirmPassword}>
                        <Field.Label>Confirm password</Field.Label>
                        <PasswordInput size="xl" {...register("confirmPassword")} />
                        <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                    </Field.Root>
                    <Button type="submit" size="xl" loading={isChangingPassword} disabled={isDisabled}>Change Password</Button>
                </form>
            </Stack>
        </Stack>
    )
}


const EmailEditable = ({ email }: { email: string }) => {
    const [emailAddress, setEmailAddress] = useState(email);
    const { mutate: updateContact } = useUpdateContact({
        onSuccess: () => {
            toaster.success({ description: "Email updated successfully" });
        }
    });

    const handleSubmit = useCallback(() => {
        if (emailAddress === email) return;
        updateContact({ email: emailAddress });
    }, [emailAddress, updateContact, email]);

    return (
        <Editable.Root submitMode="none" colorPalette={"accent"} value={emailAddress} onValueCommit={handleSubmit} onValueChange={(e) => setEmailAddress(e.value)}>
            <Editable.Preview fontWeight={"semibold"} />
            <Editable.Input fontWeight={"semibold"} />
            <Editable.Control>
                <Editable.EditTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                        <LuPencilLine />
                    </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                    <IconButton colorPalette={"gray"} variant="outline" size="xs">
                        <LuX />
                    </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                    <IconButton size="xs">
                        <LuCheck />
                    </IconButton>
                </Editable.SubmitTrigger>
            </Editable.Control>
        </Editable.Root>
    )
}

const PhoneNumberEditable = ({ phone }: { phone: string }) => {
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const { mutate: updateContact } = useUpdateContact({
        onSuccess: () => {
            toaster.success({ description: "Phone number updated successfully" });
        }
    });

    const handleSubmit = useCallback(() => {
        if (phoneNumber === phone) return;
        updateContact({ phone: phoneNumber });
    }, [phoneNumber, updateContact, phone]);

    return (
        <Editable.Root colorPalette={"accent"} onValueCommit={handleSubmit} submitMode="enter" value={phoneNumber} onValueChange={(e) => setPhoneNumber(e.value)}>
            <Editable.Preview fontWeight={"semibold"} />
            <Editable.Input fontWeight={"semibold"} />
            <Editable.Control>
                <Editable.EditTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                        <LuPencilLine />
                    </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                    <IconButton colorPalette={"gray"} variant="outline" size="xs">
                        <LuX />
                    </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                    <IconButton colorPalette={"accent"} size="xs">
                        <LuCheck />
                    </IconButton>
                </Editable.SubmitTrigger>
            </Editable.Control>
        </Editable.Root>
    )
}


Font.register({
    family: 'Inter',
    src: "/students/assets/Inter_18pt-Bold.ttf",
    fontWeight: "bold"
});

const studentIDCardStyles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 10,
    },
    cardContainer: {
        position: "relative",
        width: 500,
        height: 295,
        marginBottom: 20,
    },
    cardImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    photo: {
        position: "absolute",
        left: 26,
        top: 117,
        width: 117,
        height: 128,
    },
    text: {
        position: "absolute",
        color: "black",
        fontWeight: "bold",
        fontSize: 12,
        fontFamily: "Inter",
    },
});

const StudentIDCardDocument = ({
    frontUrl,
    backUrl,
    signatureUrl,
    student,
    capturedImage,
    expiryDate,
}: {
    frontUrl: string;
    backUrl: string;
    signatureUrl?: string;
    student: { surname: string; firstName: string; otherName: string; matricNumber: string; faculty?: string; department?: string };
    capturedImage: string;
    expiryDate?: string;
}) => (
    <Document>
        <Page style={studentIDCardStyles.page}>
            <View style={studentIDCardStyles.cardContainer}>
                <PDFImage style={studentIDCardStyles.cardImage} src={frontUrl} />
                <PDFImage style={studentIDCardStyles.photo} src={capturedImage} />
                <PDFText style={{ ...studentIDCardStyles.text, left: 225, top: 129 }}>
                    {student.surname} {student.firstName} {student.otherName}
                </PDFText>
                <PDFText style={{ ...studentIDCardStyles.text, left: 270, top: 153 }}>
                    {student.matricNumber}
                </PDFText>
                <PDFText style={{ ...studentIDCardStyles.text, left: 244, top: 174 }}>
                    {student.faculty?.toUpperCase()}
                </PDFText>
                <PDFText style={{ ...studentIDCardStyles.text, left: 216, top: 197 }}>
                    {student.department?.toUpperCase()}
                </PDFText>
                <PDFText style={{ ...studentIDCardStyles.text, left: 275, top: 220 }}>
                    {expiryDate}
                </PDFText>
            </View>

            <View style={studentIDCardStyles.cardContainer}>
                <PDFImage style={studentIDCardStyles.cardImage} src={backUrl} />
                {signatureUrl && (
                    <PDFImage
                        style={{
                            position: "absolute",
                            height: 40,
                            bottom: 72,
                            left: "45%",
                            transform: "translateX(-45%)",
                        }}
                        src={signatureUrl}
                    />
                )}
            </View>
        </Page>
    </Document>
);

function extractStoragePath(urlStr: string) {
    try {
        const url = new URL(urlStr);
        const streamPrefix = "/storage/stream/";
        if (url.pathname.startsWith(streamPrefix)) {
            return decodeURIComponent(url.pathname.slice(streamPrefix.length));
        }
        return url.pathname.replace(/^\//, "");
    } catch {
        const streamPrefix = "storage/stream/";
        const normalizedPath = urlStr.replace(/^\//, "");
        if (normalizedPath.startsWith(streamPrefix)) {
            return decodeURIComponent(normalizedPath.slice(streamPrefix.length));
        }
        return normalizedPath;
    }
}

function getStorageStreamUrl(fileKey: string) {
    return new URL("storage/stream/" + encodeURIComponent(fileKey), ENV.API_BASE_URL + "api").toString();
}

function blobToDataUrl(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function getStorageImageDataUrl(fileKey: string) {
    const { data } = await axiosClient.get<Blob>(`/storage/stream/${encodeURIComponent(fileKey)}`, {
        responseType: "blob",
    });
    return blobToDataUrl(data);
}

function loadImageElement(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

async function normalizeImageForPdf(src: string) {
    const image = await loadImageElement(src);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return src;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
}

const IDCardApplication = ({ student }: { student: StudentProfile | null | undefined }) => {
    const { data, isLoading, error:paymentErr } = useGetPayments();
    const { mutate: initializePayment, isPending } = useInitializePayment({
        onSuccess: (data) => {
            window.location.href = data.authorization_url;
        }
    });
    const { data: idCardApps, isLoading: isLoadingIdCard, error } = useIdCards();
    const hasPaid = useMemo(() => data?.data?.some((payment) => payment.status === "PAID" && payment.type === "ID_CARD_FEE"), [data]);
    const IDCard = useMemo(() => idCardApps && [...idCardApps].sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()).find((app) => app.status === "APPROVED" || app.status === "COMPLETED"), [idCardApps]);

    const handleApply = useCallback(() => {
        initializePayment({ type: "ID_CARD_FEE" as PaymentType, redirectUrl: window.location.href });
    }, [initializePayment]);

    if (isLoading || isLoadingIdCard) return null;

    if(error || paymentErr) return <Text>Failed to load data</Text>

    if (!hasPaid) return <EmptyStateView
        icon={<LuUserRound />}
        title="You have not paid the ID card fee"
        description="Please pay the ID card fee to continue"
        action={
            <Button loading={isPending} onClick={handleApply} size="xl" colorPalette="accent">Apply for ID card</Button>
        }
    />

    return <IDCardGenerateView idCard={IDCard} student={student} />;
}

interface IDCardGenerateViewProps {
    idCard: IdCardRequest | undefined;
    student: StudentProfile | null | undefined;
}

const IDCardGenerateView = ({ student }: IDCardGenerateViewProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const templateImgRef = useRef<HTMLImageElement>(null);

    const { data: templates, isLoading: isLoadingTemplates } = useIDCardTemplates();
    const uploadMutation = useUploadToStorage();

    const handleGenerateNew = useCallback(() => {
        setCapturedImage(null);
        setPreviewImage(null);
        setIsDialogOpen(true);
    }, []);

    const handleDownloadExisting = useCallback(async () => {
        if (!templates?.data?.frontUrl || !templates?.data?.backUrl) return;

        setIsProcessing(true);
        try {
            const fileKey = student?.passportS3Key;
            if (!fileKey) {
                toaster.error({ title: "No passport file found" });
                setIsProcessing(false);
                return;
            }

            const passportUrl = await normalizeImageForPdf(await getStorageImageDataUrl(fileKey));
            const frontUrl = await getStorageImageDataUrl(extractStoragePath(templates.data.frontUrl));
            const backUrl = await getStorageImageDataUrl(extractStoragePath(templates.data.backUrl));
            const signatureUrl = templates.data.signatureUrl
                ? await getStorageImageDataUrl(extractStoragePath(templates.data.signatureUrl))
                : undefined;
            const expiryDate = moment().add(1, "year").format("YYYY-MM-DD");

            const docInstance = pdf(
                <StudentIDCardDocument
                    frontUrl={frontUrl}
                    backUrl={backUrl}
                    signatureUrl={signatureUrl}
                    student={{
                        surname: student?.surname || "",
                        firstName: student?.firstName || "",
                        otherName: student?.otherName || "",
                        matricNumber: student?.matricNumber || "",
                        faculty: student?.faculty || "",
                        department: student?.department || "",
                    }}
                    capturedImage={passportUrl}
                    expiryDate={expiryDate}
                />
            );

            const pdfBlob = await docInstance.toBlob();
            const a = document.createElement("a");
            a.href = URL.createObjectURL(pdfBlob);
            a.download = `id-card-${student?.matricNumber || "student"}.pdf`;
            a.click();
            URL.revokeObjectURL(a.href);
            setIsProcessing(false);
        } catch (error) {
            console.error("PDF generation error:", error);
            toaster.error({ title: "Failed to generate ID card" });
            setIsProcessing(false);
        }
    }, [templates, student]);


    const generatePreview = useCallback(async (imageData: string) => {
        if (!previewCanvasRef.current || !templateImgRef.current || !templates?.data?.frontUrl) return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        try {
            const templateImg = templateImgRef.current;

            if (!templateImg.complete || templateImg.naturalWidth === 0) {
                await new Promise((resolve) => {
                    const checkLoad = () => {
                        if (templateImg.complete || templateImg.naturalWidth > 0) {
                            resolve(null);
                        }
                    };
                    templateImg.onload = checkLoad;
                    templateImg.onerror = resolve;
                    checkLoad();
                });
            }

            canvas.width = templateImg.naturalWidth || templateImg.width;
            canvas.height = templateImg.naturalHeight || templateImg.height;

            ctx.drawImage(templateImg, 0, 0);

            const photoImg = new window.Image();
            photoImg.crossOrigin = "anonymous";
            await new Promise((resolve, reject) => {
                photoImg.onload = resolve;
                photoImg.onerror = reject;
                photoImg.src = imageData;
            });

            const photoX = 26;
            const photoY = 119;
            const photoWidth = 116;
            const photoHeight = 128;
            ctx.drawImage(photoImg, photoX, photoY, photoWidth, photoHeight);

            ctx.fillStyle = "black";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.fillText(` ${student?.surname} ${student?.firstName} ${student?.otherName}`, 205, 140);
            ctx.fillText(`${student?.matricNumber}`, 248, 164);
            ctx.fillText(`${student?.faculty || ""}`, 228, 185);
            ctx.fillText(`${student?.department}`, 200, 208);
            ctx.fillText(`${moment().add(1, "year").format("YYYY-MM-DD") || ""}`, 255, 231);

            const result = canvas.toDataURL("image/png");
            setPreviewImage(result);
        } catch (e) {
            console.error('Error generating preview:', e);
            toaster.error({ title: "Failed to generate preview" });
        }
    }, [templates, student]);

    const handleFileChange = useCallback(async (files: File[] | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target?.result as string;
            setCapturedImage(imageData);
            generatePreview(imageData);
        };
        reader.readAsDataURL(file);
    }, [generatePreview]);

    const handleSave = useCallback(async () => {
        if (!capturedImage) return;

        setIsProcessing(true);
        try {
            await uploadMutation.mutateAsync({
                file: dataURLtoFile(capturedImage, `passport-${student?.matricNumber}.png`),
                folderName: "idcards",
            });
            const frontUrl = await getStorageImageDataUrl(extractStoragePath(templates!.data.frontUrl));
            const backUrl = await getStorageImageDataUrl(extractStoragePath(templates!.data.backUrl));
            const signatureUrl = templates!.data.signatureUrl
                ? await getStorageImageDataUrl(extractStoragePath(templates!.data.signatureUrl))
                : undefined;
            const expiryDate = moment().add(1, "year").format("YYYY-MM-DD");
            const passportImage = await normalizeImageForPdf(capturedImage);

            const docInstance = pdf(
                <StudentIDCardDocument
                    frontUrl={frontUrl}
                    backUrl={backUrl}
                    signatureUrl={signatureUrl}
                    student={{
                        surname: student?.surname || "",
                        firstName: student?.firstName || "",
                        otherName: student?.otherName || "",
                        matricNumber: student?.matricNumber || "",
                        faculty: student?.faculty || "",
                        department: student?.department || "",
                    }}
                    capturedImage={passportImage}
                    expiryDate={expiryDate}
                />
            );

            const pdfBlob = await docInstance.toBlob();
            const a = document.createElement("a");
            a.href = URL.createObjectURL(pdfBlob);
            a.download = `id-card-${student?.matricNumber || "student"}.pdf`;
            a.click();
            URL.revokeObjectURL(a.href);

            setIsProcessing(false);
            setIsDialogOpen(false);
            toaster.success({ title: "ID card generated successfully" });
        } catch (error) {
            console.error("Error saving ID card:", error);
            toaster.error({ title: "Failed to generate ID card" });
            setIsProcessing(false);
        }
    }, [capturedImage, templates, student, uploadMutation]);

    const handleCancel = useCallback(() => {
        setCapturedImage(null);
        setPreviewImage(null);
        setIsDialogOpen(false);
    }, []);

    const handleRetake = useCallback(() => {
        setCapturedImage(null);
        setPreviewImage(null);
    }, []);

    const existingFileKey = useMemo(() => {
        if (!student?.passportS3Key) return null;
        if (typeof student?.passportS3Key === "string") return student?.passportS3Key;
        return student?.passportS3Key || student?.passportS3Key || null;
    }, [student]);

    return (
        <Stack>

            {existingFileKey ? (
                <Button size="xl" colorPalette="green" onClick={handleDownloadExisting} loading={isProcessing}>
                    Download ID Card
                </Button>
            ) : (
                <Button size="xl" colorPalette="blue" onClick={handleGenerateNew}>
                    Generate ID Card
                </Button>
            )}

            <Dialog.Root
                size="xl"
                placement="center"
                closeOnInteractOutside={false}
                open={isDialogOpen}
                onOpenChange={(e) => {
                    if (!e.open) handleCancel();
                }}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content colorPalette="accent">
                            <Dialog.Header>
                                <Dialog.Title>Generate ID Card</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Stack gap="4" alignItems="center">
                                    {!capturedImage ? (
                                        <>
                                            <Box
                                                position="relative"
                                                width="463px"
                                                height="295px"
                                                borderRadius="md"
                                                overflow="hidden"
                                                border="2px solid"
                                                borderColor="border.muted"
                                                bg="white"
                                            >
                                                {isLoadingTemplates || !templates?.data?.frontUrl ? (
                                                    <Stack position="absolute" inset="0" alignItems="center" justifyContent="center">
                                                        <Spinner size="xl" />
                                                        <Text mt="4">Loading template...</Text>
                                                    </Stack>
                                                ) : (
                                                    <>
                                                        <img
                                                            crossOrigin="anonymous"
                                                            src={getStorageStreamUrl(extractStoragePath(templates.data.frontUrl || ""))}
                                                            alt="Front template layer"
                                                            style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", inset: 0 }}
                                                        />
                                                        <Box position="absolute" left="26px" top="117px" width="117px" height="128px" border="2px dashed" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center">
                                                            <Text fontSize="sm" color="gray.500">Passport</Text>
                                                        </Box>
                                                    </>
                                                )}
                                            </Box>

                                            <FileUpload.Root gap="1" maxWidth="300px" onFileChange={(e) => handleFileChange(e.acceptedFiles)}>
                                                <FileUpload.HiddenInput />
                                                <FileUpload.Label>Upload passport photo</FileUpload.Label>
                                                <InputGroup
                                                    startElement={<LuFileUp />}
                                                    endElement={
                                                        <FileUpload.ClearTrigger asChild>
                                                            <CloseButton
                                                                me="-1"
                                                                size="xs"
                                                                variant="plain"
                                                                focusVisibleRing="inside"
                                                                focusRingWidth="2px"
                                                                pointerEvents="auto"
                                                            />
                                                        </FileUpload.ClearTrigger>
                                                    }
                                                >
                                                    <Input asChild>
                                                        <FileUpload.Trigger>
                                                            <FileUpload.FileText lineClamp={1} />
                                                        </FileUpload.Trigger>
                                                    </Input>
                                                </InputGroup>
                                            </FileUpload.Root>

                                            {/* Hidden system template for preview generation */}
                                            <img
                                                ref={templateImgRef}
                                                src={getStorageStreamUrl(extractStoragePath(templates?.data?.frontUrl || ""))}
                                                crossOrigin="anonymous"
                                                alt="ID card front template"
                                            // style={{ display: 'none' }}
                                            />

                                            <Stack direction="row" gap="4">
                                                <Button
                                                    size="xl"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    disabled={isProcessing}
                                                >
                                                    <LuX /> Cancel
                                                </Button>
                                            </Stack>
                                        </>
                                    ) : (
                                        <>
                                            <Box
                                                position="relative"
                                                width="463px"
                                                height="295px"
                                                borderRadius="md"
                                                overflow="hidden"
                                                border="2px solid"
                                                borderColor="border.muted"
                                                bg="white"
                                            >
                                                {previewImage && (
                                                    <img
                                                        src={previewImage}
                                                        alt="ID Card Preview"
                                                        style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", inset: 0 }}
                                                    />
                                                )}
                                            </Box>

                                            <Stack direction="row" gap="4">
                                                <Button
                                                    size="xl"
                                                    onClick={handleSave}
                                                    disabled={isProcessing || !capturedImage}
                                                    loading={isProcessing}
                                                    loadingText="Processing..."
                                                    colorPalette="green"
                                                >
                                                    <LuCheck /> Save
                                                </Button>
                                                <Button
                                                    size="xl"
                                                    variant="outline"
                                                    onClick={handleRetake}
                                                    disabled={isProcessing}
                                                >
                                                    <LuCamera /> Retake Photo
                                                </Button>
                                                <Button
                                                    size="xl"
                                                    variant="outline"
                                                    colorPalette="red"
                                                    onClick={handleCancel}
                                                    disabled={isProcessing}
                                                >
                                                    <LuX /> Cancel
                                                </Button>
                                            </Stack>
                                        </>
                                    )}

                                    <canvas ref={previewCanvasRef} style={{ display: "none" }} />
                                </Stack>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Stack>
    )
}

function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export default Profile;
