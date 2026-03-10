import { Component, OnInit } from '@angular/core';
import { FitnessService } from 'src/app/services/fitness.service';
import { UserProfile, WorkoutLog, Routine } from 'src/app/models/fitness.models';
import { firstValueFrom } from 'rxjs';

interface StudentProgress extends UserProfile {
  completedRoutines: number;
  overallExercisePercentage: number;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
  standalone: false
})
export class StudentsPage implements OnInit {
  students: StudentProgress[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedGroup: number | 'all' = 'all';
  availableGroups: number[] = [];

  constructor(private fitnessService: FitnessService) { }

  ngOnInit() {
    this.loadStudents();
  }

  get filteredStudents() {
    return this.students.filter(student => {
      const name = student.displayName || `${student.name || ''} ${student.lastname || ''}`.trim();
      const matchesSearch = name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesGroup = this.selectedGroup === 'all' || student.group === this.selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }

  async loadStudents() {
    this.isLoading = true;
    try {
      const users = await firstValueFrom(this.fitnessService.getAllStudents());

      // Fetch all routines once for reference
      const allRoutines = await firstValueFrom(this.fitnessService.getRoutinesByInstructor(''));
      const routineMap = new Map<string, Routine>();
      allRoutines.forEach(r => {
        if (r.id) routineMap.set(r.id, r);
      });

      // Extract unique groups
      const groups = new Set<number>();
      users.forEach((user: any) => {
        if (user.group !== undefined && user.group !== null) {
          groups.add(user.group);
        }
      });
      this.availableGroups = Array.from(groups).sort((a, b) => a - b);

      const studentsWithProgress = await Promise.all(users.map(async (user) => {
        const logs = await firstValueFrom(this.fitnessService.getUserLogs(user.uid));

        // Count all workout sessions (logs)
        const completedRoutines = logs.length;

        // Assigned routines for this specific student
        const assignedIds = user.assignedRoutineIds || [];

        // 1. Calculate total exercises in ALL assigned routines (denominator)
        let totalAssignedExercises = 0;
        assignedIds.forEach(id => {
          const routine = routineMap.get(id);
          if (routine) {
            totalAssignedExercises += routine.exercises?.length || 0;
          }
        });

        // 2. Sum of the latest (or maximum) completedExercisesCount for each ASSIGNED routine (numerator)
        let totalCompletedExercises = 0;
        if (totalAssignedExercises > 0) {
          const latestLogsByRoutine = new Map<string, number>();

          // Logs are sorted by date desc in getUserLogs service
          logs.forEach(log => {
            if (log.routineId && assignedIds.includes(log.routineId) && !latestLogsByRoutine.has(log.routineId)) {
              latestLogsByRoutine.set(log.routineId, log.completedExercisesCount || 0);
            }
          });

          latestLogsByRoutine.forEach(count => {
            totalCompletedExercises += count;
          });
        }

        let overallExercisePercentage = 0;
        if (totalAssignedExercises > 0) {
          overallExercisePercentage = Math.round((totalCompletedExercises / totalAssignedExercises) * 100);
          overallExercisePercentage = Math.min(overallExercisePercentage, 100);
        }

        return {
          ...user,
          completedRoutines,
          overallExercisePercentage
        };
      }));

      this.students = studentsWithProgress;
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
