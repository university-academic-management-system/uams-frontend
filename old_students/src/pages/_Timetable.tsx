import React, { useState, useEffect, useMemo } from 'react';
import { Box, Flex, Text, Heading, VStack, HStack, Button } from '@chakra-ui/react';
import apiClient from '../services/api';
import { ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';

const scheduleColors = ['#E1F7FD', '#FDFBE7', '#F0F1FE', '#FBF2F9'];

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  isPublished: boolean;
  Course: { id: string; code: string };
  Lecturer: { id: string; User: { fullName: string } };
  Semester: { id: string; name: string };
  Level: { id: string; name: string };
}

// Format "08:30:00" to "8:30 AM"
const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

// Get hour from time string "08:30:00" → 8
const getHour = (time: string) => parseInt(time.split(':')[0], 10);

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];



const CalendarWidget = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells: { day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: prevMonthDays - firstDayOfMonth + 1 + i, isCurrentMonth: false, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isToday: d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
    });
  }
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      calendarCells.push({ day: d, isCurrentMonth: false, isToday: false });
    }
  }

  const goToPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  };

  return (
    <Box bg="white" rounded={{ base: '20px', lg: '24px' }} p={{ base: 4, lg: 5 }} border="1px" borderColor="gray.100" shadow="sm">
      <Heading fontSize={{ base: 'sm', lg: 'md' }} fontWeight="bold" color="slate.800" mb={4}>Calendar</Heading>

      <Flex align="center" justify="space-between" mb={4}>
        <Box cursor="pointer" color="blue.500" _hover={{ color: 'blue.600' }} onClick={goToPrevMonth}><ChevronLeft size={18} /></Box>
        <Text fontSize="12px" fontWeight="bold" color="slate.700">{monthNames[currentMonth]} {currentYear}</Text>
        <Box cursor="pointer" color="blue.500" _hover={{ color: 'blue.600' }} onClick={goToNextMonth}><ChevronRight size={18} /></Box>
      </Flex>

      <div className="grid grid-cols-7 gap-0 mb-1">
        {daysOfWeek.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold text-gray-300 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {calendarCells.map((cell, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center h-7 text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
              cell.isToday
                ? 'bg-blue-500 text-white'
                : cell.isCurrentMonth
                  ? 'text-slate-600 hover:bg-gray-50'
                  : 'text-gray-200'
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </Box>
  );
};

const Timetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(() => DAY_NAMES[new Date().getDay()]);
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);

  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  useEffect(() => {
    apiClient.get('/timetable/my-level')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch notifications
    apiClient.get('/notifications')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setLiveAnnouncements(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch(() => {});
  }, []);

  // Filter entries for the selected day, sorted by startTime
  const todayEntries = useMemo(() => {
    return entries
      .filter((e) => e.dayOfWeek === selectedDay && e.isPublished)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [entries, selectedDay]);

  // Build time slots from 7AM to 6PM
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = 7; h <= 18; h++) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      slots.push(`${hour12}:00 ${ampm}`);
    }
    return slots;
  }, []);

  // Map hour → entry for quick lookup
  const entryByHour = useMemo(() => {
    const map = new Map<number, TimetableEntry & { colorIndex: number }>();
    todayEntries.forEach((entry, idx) => {
      const hour = getHour(entry.startTime);
      map.set(hour, { ...entry, colorIndex: idx % scheduleColors.length });
    });
    return map;
  }, [todayEntries]);

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1600px" mx="auto">
      <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 6, lg: 8 }}>
        {/* Main schedule area */}
        <Box flex={{ lg: 3 }}>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading fontSize={{ base: 'lg', lg: 'xl' }} fontWeight="bold" color="slate.800">
              Class Schedule
            </Heading>
            <HStack gap={3}>
              <Text fontSize="12px" fontWeight="medium" color="gray.400">{formattedDate}</Text>
              <Box position="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as typeof DAY_NAMES[number])}
                  style={{
                    background: 'var(--color-accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 28px 5px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    appearance: 'none',
                    cursor: 'pointer',
                    height: '30px',
                  }}
                >
                  {DAY_NAMES.map((day, idx) => (
                    <option key={day} value={day} style={{ background: 'white', color: '#1e293b' }}>{DAY_LABELS[idx]}</option>
                  ))}
                </select>
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" pointerEvents="none" color="white">
                  <ChevronDown size={14} />
                </Box>
              </Box>
            </HStack>
          </Flex>

          <Box
            bg="white"
            rounded={{ base: '20px', lg: '28px' }}
            p={{ base: 4, lg: 6 }}
            border="1px"
            borderColor="gray.100"
            shadow="sm"
          >
            {loading ? (
              <Flex justify="center" align="center" py={20}>
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <Text ml={3} fontSize="sm" color="gray.400" fontWeight="medium">Loading schedule...</Text>
              </Flex>
            ) : todayEntries.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py={16} textAlign="center">
                <Text fontSize="lg" fontWeight="bold" color="slate.700" mb={2}>No classes</Text>
                <Text fontSize="sm" color="gray.400">No classes scheduled for {DAY_LABELS[DAY_NAMES.indexOf(selectedDay)]}.</Text>
              </Flex>
            ) : (
              <VStack align="stretch" gap={0}>
                {timeSlots.map((slot) => {
                  const hour = parseInt(slot) + (slot.includes('PM') && !slot.startsWith('12') ? 12 : 0);
                  // Correct hour parsing
                  const actualHour = (() => {
                    const num = parseInt(slot);
                    if (slot.includes('AM')) return num === 12 ? 0 : num;
                    return num === 12 ? 12 : num + 12;
                  })();
                  const item = entryByHour.get(actualHour);

                  return (
                    <Flex key={slot} align="flex-start" minH={item ? '80px' : '50px'}>
                      <Text
                        w={{ base: '60px', lg: '80px' }}
                        flexShrink={0}
                        fontSize={{ base: '10px', lg: '11px' }}
                        fontWeight="bold"
                        color="gray.300"
                        pt={1}
                        textAlign="right"
                        pr={4}
                      >
                        {slot}
                      </Text>

                      <Box flex={1} borderTop="1px dashed" borderColor="gray.100" pt={2} pb={2}>
                        {item ? (
                          <Box
                            bg={scheduleColors[item.colorIndex]}
                            rounded="xl"
                            px={{ base: 4, lg: 5 }}
                            py={{ base: 3, lg: 4 }}
                          >
                            <Text fontSize="10px" fontWeight="bold" color="gray.500">
                              {formatTime(item.startTime)} - {formatTime(item.endTime)}
                            </Text>
                            <Text fontSize={{ base: '13px', lg: '14px' }} fontWeight="bold" color="slate.800" mt={0.5}>
                              {item.Course.code}
                            </Text>
                            <Text fontSize="10px" color="gray.400" fontWeight="medium" mt={0.5}>
                              {item.room} • {item.Lecturer.User.fullName}
                            </Text>
                          </Box>
                        ) : null}
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            )}
          </Box>
        </Box>

        {/* Right sidebar */}
        <VStack flex={{ lg: 1 }} gap={{ base: 5, lg: 6 }} align="stretch" w={{ base: 'full', lg: 'auto' }}>
          <CalendarWidget />

          <Box bg="white" rounded={{ base: '20px', lg: '24px' }} p={{ base: 4, lg: 5 }} border="1px" borderColor="gray.100" shadow="sm">
            <Heading fontSize={{ base: 'sm', lg: 'md' }} fontWeight="bold" color="slate.800" mb={4}>
              Announcements
            </Heading>
            <VStack align="stretch" gap={3}>
              {liveAnnouncements.length === 0 ? (
                <Text fontSize="12px" color="gray.400" textAlign="center" py={4}>No announcements</Text>
              ) : liveAnnouncements.map((a) => (
                <Box
                  key={a.id}
                  bg="#FEF9C3"
                  rounded="xl"
                  p={{ base: 3, lg: 4 }}
                >
                  <Text fontSize="12px" fontWeight="bold" color="slate.800" mb={1}>{a.title}</Text>
                  <Text fontSize="10px" color="gray.500" lineHeight="short" fontWeight="medium">
                    {a.body}
                  </Text>
                  <Text fontSize="9px" fontWeight="bold" color="blue.500" mt={2} cursor="pointer" _hover={{ color: 'blue.600' }}>
                    View More
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Timetable;
