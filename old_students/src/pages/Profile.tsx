import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Input, Button, Image, Grid, GridItem, Field, IconButton } from '@chakra-ui/react';
import { Camera, Edit2, Eye, EyeOff } from 'lucide-react';
import authService from '../services/authService';
import { StudentProfile } from '../services/types';
import { Toaster, toaster } from '../components/ui/toaster';
import { useChangePasswordForm } from '../forms/change-password.form';
import type { ChangePasswordSchema } from '../schemas/profile/change-password.schema';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setProfile(storedUser.profile);
      setEmail(storedUser.email || '');
      setPhone(storedUser.phone || storedUser.profile?.phone || '');
    }
  }, []);

  const getNames = (fullName: string) => {
    const parts = fullName ? fullName.split(' ') : [];
    if (parts.length === 0) return { firstName: '', otherName: '' };
    return {
      firstName: parts[0],
      otherName: parts.slice(1).join(' ')
    };
  };

  const { firstName, otherName } = getNames(user?.fullName || '');

  // Mock fields if missing from API
  const mockAdmissionMode = 'UTME';
  const mockEntryQual = 'O-LEVEL';
  const mockDuration = 4;
  const mockDegree = 'B.SC';


  const { register, handleSubmit, formState: { errors } } = useChangePasswordForm();

  const handleChangePassword = async (data: ChangePasswordSchema) => {
    try {
      const response = await authService.changePassword(data);
      toaster.success(response.message);
    } catch (error) {
      toaster.error(error.message);
    }
  };

  return (
    <Box p={{ base: 4, lg: 8 }} maxW="1600px" mx="auto" spaceY="6">
      <Box
        bg="white"
        rounded={{ base: "24px", lg: "32px" }}
        p={{ base: 6, lg: 10 }}
        border="1px"
        borderColor="gray.100"
        shadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={8} color="slate.800">Profile</Text>

        {/* Avatar Section */}
        <Flex align="center" gap={6} mb={10}>
          <Box position="relative">
            <Box
              w="24" h="24"
              rounded="full"
              bg="gray.100"
              border="1px solid"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {user?.avatar ? (
                <Image src={user.avatar} w="full" h="full" objectFit="cover" />
              ) : (
                <Camera size={32} color="#94a3b8" />
              )}
            </Box>
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="slate.800">{user?.fullName || 'Student Name'}</Text>
            <Text fontSize="sm" color="gray.400">{user?.email || 'email@example.com'}</Text>
          </Box>
        </Flex>

        {/* Info Grid */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={12}>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Reg No.</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.registrationNo || 'N/A'}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Mat No.</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.studentId || 'N/A'}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">First Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{firstName}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Other Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{otherName}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Level</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.level || 'N/A'}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Gender</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.gender || 'N/A'}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Admission Mode</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.admissionMode || mockAdmissionMode}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Entry Qualification</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.entryQualification || mockEntryQual}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Faculty Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{user?.faculty || 'COMPUTING'}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Degree Course</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.degreeCourse || user?.department}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Department Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.Department?.name || user?.department}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Degree Awarded</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.degreeAwarded || mockDegree}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Course Duration</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.courseDuration || mockDuration}</Text>
            </Box>
          </GridItem>
        </Grid>

        <Box w="full" h="1px" bg="gray.200" mb={8} />

        {/* Contact Edit Section */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={6}>
          <GridItem>
            <Field.Root>
              <Field.Label>Email Address</Field.Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter address"
                disabled={!isEditing}
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: isEditing ? 'blue.400' : 'gray.200' }}
                _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
              />
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label>Phone Number</Field.Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter address"
                disabled={!isEditing}
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: isEditing ? 'blue.400' : 'gray.200' }}
                _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
              />
            </Field.Root>
          </GridItem>
        </Grid>

        <Flex justify="flex-end">
          <Button
            variant="surface"
            size="md"
            p="2"
            rounded="lg"
            color="slate.600"
            borderColor="gray.200"
            onClick={() => setIsEditing(!isEditing)}
            _hover={{ bg: 'gray.100' }}
          >
            <Edit2 size={16} /> {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Flex>

      </Box>


      {/* passowfk */}
      <Box
        bg="white"
        rounded={{ base: "24px", lg: "32px" }}
        p={{ base: 6, lg: 10 }}
        border="1px"
        borderColor="gray.100"
        shadow="sm"
      >
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Text fontSize="lg" fontWeight="bold" mb={6} color="#1e293b">Change Password</Text>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={6}>
            <GridItem>
              <Field.Root invalid={!!errors.currentPassword?.message}>
                <Field.Label>Current Password</Field.Label>
                <Box position="relative" w="full">
                  <Input
                    {...register('currentPassword')}
                    defaultValue={"********"}
                    placeholder="Enter current password"
                    type={showCurrentPassword ? "text" : "password"}
                    bg="white"
                    pl="4"
                    pr="10"
                    border="xs"
                    borderColor="border"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
                  />
                  <IconButton
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    color="gray.400"
                    _hover={{ color: "blue.500", bg: "transparent" }}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </Box>
                <Field.ErrorText>{errors.currentPassword?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root invalid={!!errors.newPassword?.message}>
                <Field.Label>New Password</Field.Label>
                <Box position="relative" w="full">
                  <Input
                    {...register('newPassword')}
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    bg="white"
                    pl="4"
                    pr="10"
                    border="xs"
                    borderColor="border"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
                  />
                  <IconButton
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    color="gray.400"
                    _hover={{ color: "blue.500", bg: "transparent" }}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </Box>
                <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root invalid={!!errors.confirmNewPassword?.message}>
                <Field.Label>Confirm New Password</Field.Label>
                <Box position="relative" w="full">
                  <Input
                    {...register('confirmNewPassword')}
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    bg="white"
                    pl="4"
                    pr="10"
                    border="xs"
                    borderColor="border"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
                  />
                  <IconButton
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    color="gray.400"
                    _hover={{ color: "blue.500", bg: "transparent" }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </Box>
                <Field.ErrorText>{errors.confirmNewPassword?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>
          </Grid>
          <Flex justify="flex-end">
            <Button
              variant="surface"
              size="md"
              p="2"
              rounded="lg"
              color="slate.600"
              borderColor="border"
              type="submit"
              _hover={{ bg: 'gray.100' }}
            >
              Update Password
            </Button>
          </Flex>
        </form>
        <Toaster />
      </Box>
    </Box>
  );
};

export default Profile;
