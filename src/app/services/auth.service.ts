import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, UserCredential, updatePassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { UserProfile, UserRole } from '../models/fitness.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser$: Observable<UserProfile | null>;

    constructor(private auth: Auth, private firestore: Firestore) {
        this.currentUser$ = user(this.auth).pipe(
            switchMap(firebaseUser => {
                if (!firebaseUser) return of(null);
                return from(this.getUserProfile(firebaseUser.uid));
            }),
            shareReplay(1)
        );
    }

    async login(email: string, pass: string) {
        return signInWithEmailAndPassword(this.auth, email, pass);
    }

    async register(email: string, pass: string) {
        return createUserWithEmailAndPassword(this.auth, email, pass);
    }

    async logout() {
        return signOut(this.auth);
    }

    async registerUserByInstructor(email: string, pass: string, displayName: string, instructorId: string) {
        const res = await createUserWithEmailAndPassword(this.auth, email, pass);
        const profile: UserProfile = {
            uid: res.user.uid,
            email,
            displayName,
            role: 'user',
            assignedInstructorId: instructorId
        };
        await setDoc(doc(this.firestore, `users/${res.user.uid}`), profile);
        return profile;
    }

    async setProfile(res: UserCredential, email: string, displayName: string, role: UserRole, assignedInstructorId: string) {
        const profile: UserProfile = {
            uid: res.user.uid,
            email,
            displayName,
            role,
            assignedInstructorId: assignedInstructorId
        };
        console.log(profile);
        await setDoc(doc(this.firestore, `users/${profile.uid}`), profile);
    }

    async testFirestore() {
        console.log('Firestore Test: Starting write attempt...');
        try {
            const docRef = doc(this.firestore, `users/asaegg`);
            console.log('Firestore Test: Document reference created', docRef.path);
            await setDoc(docRef, { id: 'asaegg', name: 'Allan', timestamp: new Date() });
            console.log('Firestore Test Successful: Document written successfully');
        } catch (error) {
            console.error('Firestore Test Failed with error:', error);
            throw error;
        }
    }

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(this.firestore, `users/${uid}`);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as UserProfile : null;
    }

    async updateUserPassword(newPassword: string) {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('No user logged in');
        return updatePassword(currentUser, newPassword);
    }

    async sendResetPasswordEmail(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }

    async hasRole(role: UserRole): Promise<Observable<boolean>> {
        return this.currentUser$.pipe(
            map(profile => profile?.role === role)
        );
    }
}
