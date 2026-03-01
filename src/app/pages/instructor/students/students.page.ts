import { Component, OnInit } from '@angular/core';
import { FitnessService } from 'src/app/services/fitness.service';
import { UserProfile, WorkoutLog } from 'src/app/models/fitness.models';
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

  constructor(private fitnessService: FitnessService) { }

  ngOnInit() {
    this.loadStudents();
  }

  async loadStudents() {
    this.isLoading = true;
    try {
      const users = await firstValueFrom(this.fitnessService.getAllStudents());

      const studentsWithProgress = await Promise.all(users.map(async (user) => {
        const logs = await firstValueFrom(this.fitnessService.getUserLogs(user.uid));

        const completedRoutines = logs.length;
        let totalAssigned = 0;
        let totalCompleted = 0;

        logs.forEach(log => {
          if (log.totalExercisesCount) {
            totalAssigned += log.totalExercisesCount;
            totalCompleted += (log.completedExercisesCount || 0);
          }
        });

        let overallExercisePercentage = 0;
        if (totalAssigned > 0) {
          overallExercisePercentage = Math.round((totalCompleted / totalAssigned) * 100);
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
