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
