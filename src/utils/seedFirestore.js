import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { getStatusClass, getPriorityClass } from './helpers';

const defaultTasks = [
    {
        title: 'Tổ chức họp tổng kết quý 1',
        description: 'Chuẩn bị và tổ chức cuộc họp tổng kết quý 1/2026. Bao gồm: đặt địa điểm, chuẩn bị slides, mời khách, setup thiết bị.',
        assigner: 'Nguyễn Văn An',
        assignees: ['Trần Thị Bình'],
        deadline: '2026-03-31',
        status: 'Chờ xử lý',
        statusClass: 'status-pending',
        priority: 'Cao',
        priorityClass: 'priority-high',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=100&q=80',
        createdAt: new Date().toISOString(),
    }
];

// Users stored in Firestore with fixed IDs
const defaultUsers = [
    { id: 'user-1', name: 'Nguyễn Văn An', username: 'admin', role: 'Quản trị viên', password: 'password123', isFirstLogin: false, isActive: true },
    { id: 'user-2', name: 'Trần Thị Bình', username: 'manager1', role: 'Quản lý', password: 'password123', isFirstLogin: false, isActive: true },
    { id: 'user-3', name: 'Phạm Tuấn Đức', username: 'employee1', role: 'Nhân viên', password: 'password123', isFirstLogin: false, isActive: true },
];

/**
 * Seeds Firestore with initial data if collections are empty.
 * Call this once on app startup.
 */
export async function seedInitialData() {
    try {
        // Seed users (use setDoc with fixed IDs)
        const usersSnap = await getDocs(collection(db, 'users'));
        if (usersSnap.empty) {
            console.log('[Seed] Seeding users...');
            for (const user of defaultUsers) {
                const { id, ...userData } = user;
                await setDoc(doc(db, 'users', id), userData);
            }
            console.log('[Seed] Users seeded successfully.');
        }

        // Seed tasks (auto-ID)
        const tasksSnap = await getDocs(collection(db, 'tasks'));
        if (tasksSnap.empty) {
            console.log('[Seed] Seeding tasks...');
            for (const task of defaultTasks) {
                await addDoc(collection(db, 'tasks'), task);
            }
            console.log('[Seed] Tasks seeded successfully.');
        }
    } catch (err) {
        console.error('[Seed] Error seeding Firestore:', err);
    }
}
