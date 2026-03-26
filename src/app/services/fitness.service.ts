import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, arrayUnion, setDoc, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Exercise, Routine, Assignment, WorkoutLog, UserProfile } from '../models/fitness.models';

@Injectable({
    providedIn: 'root'
})
export class FitnessService {
    constructor(private firestore: Firestore, private storage: Storage) { }

    // EXERCISES
    getExercises(): Observable<Exercise[]> {
        const colRef = collection(this.firestore, 'exercises');
        return collectionData(colRef, { idField: 'id' }) as Observable<Exercise[]>;
    }

    addExercise(exercise: Exercise) {
        const colRef = collection(this.firestore, 'exercises');
        return addDoc(colRef, exercise);
    }

    addExerciseWithId(exercise: Exercise) {
        const docRef = doc(this.firestore, `exercises/${exercise.id}`);
        return setDoc(docRef, exercise);
    }

    updateExercise(exerciseId: string, data: Partial<Exercise>) {
        const docRef = doc(this.firestore, `exercises/${exerciseId}`);
        return updateDoc(docRef, data);
    }

    async uploadExerciseImage(file: File, exerciseId: string): Promise<string> {
        const filePath = `exercises/${exerciseId}_${new Date().getTime()}`;
        const fileRef = ref(this.storage, filePath);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
    }

    // ROUTINES
    getRoutinesByInstructor(instructorId: string): Observable<Routine[]> {
        const colRef = collection(this.firestore, 'routines');
        // El usuario solicitó que todos los instructores vean todas las rutinas porque son de la misma persona.
        return collectionData(colRef, { idField: 'id' }) as Observable<Routine[]>;
    }

    addRoutine(routine: Routine) {
        const colRef = collection(this.firestore, 'routines');
        return addDoc(colRef, routine);
    }

    addRoutineWithId(routine: Routine) {
        const docRef = doc(this.firestore, `routines/${routine.id}`);
        return setDoc(docRef, routine);
    }

    getRoutineById(routineId: string): Observable<Routine | undefined> {
        const docRef = doc(this.firestore, `routines/${routineId}`);
        return docData(docRef, { idField: 'id' }) as Observable<Routine | undefined>;
    }

    updateRoutine(routineId: string, data: Partial<Routine>) {
        const docRef = doc(this.firestore, `routines/${routineId}`);
        return updateDoc(docRef, data);
    }

    deleteRoutine(routineId: string) {
        const docRef = doc(this.firestore, `routines/${routineId}`);
        return deleteDoc(docRef);
    }

    // ASSIGNMENTS
    assignRoutine(assignment: Assignment) {
        const colRef = collection(this.firestore, 'assignments');
        return addDoc(colRef, assignment);
    }

    getUserAssignments(userId: string): Observable<Assignment[]> {
        const colRef = collection(this.firestore, 'assignments');
        const q = query(colRef, where('userId', '==', userId), where('status', '==', 'active'));
        return collectionData(q, { idField: 'id' }) as Observable<Assignment[]>;
    }

    // WORKOUT LOGS
    logWorkout(log: WorkoutLog) {
        const colRef = collection(this.firestore, 'workout_logs');
        return addDoc(colRef, log);
    }

    getUserLogs(userId: string): Observable<WorkoutLog[]> {
        const colRef = collection(this.firestore, 'workout_logs');
        const q = query(colRef, where('userId', '==', userId), orderBy('date', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<WorkoutLog[]>;
    }

    // USER PROFILE & PHYSICAL DATA
    getAllStudents(): Observable<UserProfile[]> {
        const colRef = collection(this.firestore, 'users');
        const q = query(colRef, where('role', '==', 'user'));
        return collectionData(q, { idField: 'uid' }) as Observable<UserProfile[]>;
    }

    getUserById(uid: string): Observable<UserProfile | undefined> {
        const docRef = doc(this.firestore, `users/${uid}`);
        return docData(docRef, { idField: 'uid' }) as Observable<UserProfile | undefined>;
    }

    updatePhysicalData(userId: string, data: { weight: number, weightUnit: 'kg' | 'lb', height: number, bmi: number }) {
        const docRef = doc(this.firestore, `users/${userId}`);
        return updateDoc(docRef, {
            physicalData: {
                ...data,
                lastUpdate: new Date()
            }
        });
    }

    assignRoutineToUser(userId: string, routineId: string) {
        const docRef = doc(this.firestore, `users/${userId}`);
        return updateDoc(docRef, { assignedRoutineIds: arrayUnion(routineId) });
    }

    async updateStudentGroup(userId: string, newGroup: number) {
        const docRef = doc(this.firestore, `users/${userId}`);
        
        // Fetch routines assigned to the new group
        const routinesCol = collection(this.firestore, 'routines');
        const q = query(routinesCol, where('assignedGroups', 'array-contains', newGroup));
        const routinesSnapshot = await getDocs(q);
        const assignedRoutineIds = routinesSnapshot.docs.map(d => d.id);

        return updateDoc(docRef, { 
            group: newGroup,
            assignedRoutineIds: assignedRoutineIds 
        });
    }

    getGeneralConfig(): Observable<any> {
        const docRef = doc(this.firestore, 'config/general');
        return docData(docRef) as Observable<any>;
    }

    updateGeneralConfig(data: any) {
        const docRef = doc(this.firestore, 'config/general');
        return setDoc(docRef, data, { merge: true });
    }
}
