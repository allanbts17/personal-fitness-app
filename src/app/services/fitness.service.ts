import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Exercise, Routine, Assignment, WorkoutLog, UserProfile } from '../models/fitness.models';

@Injectable({
    providedIn: 'root'
})
export class FitnessService {
    constructor(private firestore: Firestore) { }

    // EXERCISES
    getExercises(): Observable<Exercise[]> {
        const colRef = collection(this.firestore, 'exercises');
        return collectionData(colRef, { idField: 'id' }) as Observable<Exercise[]>;
    }

    addExercise(exercise: Exercise) {
        const colRef = collection(this.firestore, 'exercises');
        return addDoc(colRef, exercise);
    }

    updateExercise(exerciseId: string, data: Partial<Exercise>) {
        const docRef = doc(this.firestore, `exercises/${exerciseId}`);
        return updateDoc(docRef, data);
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

    getRoutineById(routineId: string): Observable<Routine | undefined> {
        const docRef = doc(this.firestore, `routines/${routineId}`);
        return docData(docRef, { idField: 'id' }) as Observable<Routine | undefined>;
    }

    updateRoutine(routineId: string, data: Partial<Routine>) {
        const docRef = doc(this.firestore, `routines/${routineId}`);
        return updateDoc(docRef, data);
    }

    // ASSIGNMENTS
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
    getAllClients(): Observable<UserProfile[]> {
        const colRef = collection(this.firestore, 'users');
        const q = query(colRef, where('role', '==', 'user'));
        return collectionData(q, { idField: 'uid' }) as Observable<UserProfile[]>;
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
}
