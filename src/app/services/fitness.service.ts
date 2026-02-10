import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Exercise, Routine, Assignment, WorkoutLog } from '../models/fitness.models';

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

    // ROUTINES
    getRoutinesByInstructor(instructorId: string): Observable<Routine[]> {
        const colRef = collection(this.firestore, 'routines');
        const q = query(colRef, where('createdBy', '==', instructorId));
        return collectionData(q, { idField: 'id' }) as Observable<Routine[]>;
    }

    addRoutine(routine: Routine) {
        const colRef = collection(this.firestore, 'routines');
        return addDoc(colRef, routine);
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
        // USER PROFILE & PHYSICAL DATA
        updatePhysicalData(userId: string, data: { weight: number, bmi: number }) {
            const docRef = doc(this.firestore, `users/${userId}`);
            return updateDoc(docRef, {
                physicalData: {
                    ...data,
                    lastUpdate: new Date()
                }
            });
        }
    }
