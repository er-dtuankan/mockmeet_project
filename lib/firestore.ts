import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Booking, Review, TimeSlot, Notification } from '@/types';

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function createUser(uid: string, data: Omit<User, 'uid'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as User;
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>);
}

export async function getAllInterviewers(): Promise<User[]> {
  const q = query(collection(db, 'users'), where('isInterviewer', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as User));
}

export async function getAllStudents(): Promise<User[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as User));
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as User));
}

// ─── TIME SLOTS ───────────────────────────────────────────────────────────────

export async function addTimeSlot(slot: Omit<TimeSlot, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'slots'), slot);
  return ref.id;
}

export async function getInterviewerSlots(interviewerId: string): Promise<TimeSlot[]> {
  const q = query(collection(db, 'slots'), where('interviewerId', '==', interviewerId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TimeSlot));
}

export async function getAvailableSlots(interviewerId: string): Promise<TimeSlot[]> {
  const q = query(
    collection(db, 'slots'),
    where('interviewerId', '==', interviewerId),
    where('isBooked', '==', false)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TimeSlot));
}

export async function markSlotBooked(slotId: string): Promise<void> {
  await updateDoc(doc(db, 'slots', slotId), { isBooked: true });
}

export async function deleteSlot(slotId: string): Promise<void> {
  await deleteDoc(doc(db, 'slots', slotId));
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export async function createBooking(booking: Omit<Booking, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'bookings'), booking);
  return ref.id;
}

export async function getBooking(bookingId: string): Promise<Booking | null> {
  const snap = await getDoc(doc(db, 'bookings', bookingId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Booking;
}

export async function getStudentBookings(studentId: string): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
}

export async function getInterviewerBookings(interviewerId: string): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), where('interviewerId', '==', interviewerId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
}

export async function getAllBookings(): Promise<Booking[]> {
  const snap = await getDocs(collection(db, 'bookings'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status']
): Promise<void> {
  await updateDoc(doc(db, 'bookings', bookingId), { status });
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export async function createReview(review: Omit<Review, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'reviews'), review);
  return ref.id;
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('revieweeId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('reviewerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
}

export async function hasReviewed(bookingId: string, reviewerId: string): Promise<boolean> {
  const q = query(
    collection(db, 'reviews'),
    where('bookingId', '==', bookingId),
    where('reviewerId', '==', reviewerId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export async function createNotification(
  userId: string,
  data: Omit<Notification, 'id' | 'userId'>
): Promise<void> {
  await addDoc(collection(db, 'notifications'), {
    ...data,
    userId,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Notification))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(notifId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notifId), { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const notifs = await getUserNotifications(userId);
  const unread = notifs.filter(n => !n.read);
  await Promise.all(unread.map(n => markNotificationRead(n.id)));
}
