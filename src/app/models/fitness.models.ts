export type UserRole = 'admin' | 'instructor' | 'user';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    assignedInstructorId?: string;
    physicalData?: {
        weight: number;
        weightUnit: 'lb' | 'kg';
        height: number;
        bmi: number;
        lastUpdate: Date | any;
    };
}

export interface Exercise {
    id?: string;
    name: string;
    description: string;
    category?: string;
    muscleGroups?: string[];
    equipment?: string[];
    videoUrl?: string;
}

export interface Routine {
    id?: string;
    name: string;
    description?: string;
    createdBy: string;
    exercises: {
        exerciseId: string;
        exerciseName?: string; // Cache the name from our previous strategy
        sets: number;
        reps?: string;
        weight?: number;
        durationValue?: number;
        restSeconds?: number;
        order?: number;
    }[];
}

export interface Assignment {
    id?: string;
    userId: string;
    routineId: string;
    assignedBy: string;
    date: Date | any;
    status: 'active' | 'completed';
}

export interface WorkoutLog {
    id?: string;
    userId: string;
    routineId: string;
    date: Date | any;
    duration?: number; // en minutos
    notes?: string;
    // Progreso
    completedExercisesCount?: number;
    totalExercisesCount?: number;
    // Feedback de la rutina
    difficulty?: 'easy' | 'normal' | 'hard';
}
