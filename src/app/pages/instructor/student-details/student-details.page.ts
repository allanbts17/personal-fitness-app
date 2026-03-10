import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FitnessService } from 'src/app/services/fitness.service';
import { UserProfile, WorkoutLog, Routine, Exercise } from 'src/app/models/fitness.models';
import { firstValueFrom } from 'rxjs';

interface DetailedLog extends WorkoutLog {
  routineName: string;
  formattedDate: string;
  displayExercises: {
    name: string;
    plannedReps: string | number;
    actualReps: number;
    plannedDuration: number;
    actualDuration: number;
    isSkipped: boolean;
  }[];
}

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.page.html',
  styleUrls: ['./student-details.page.scss'],
  standalone: false
})
export class StudentDetailsPage implements OnInit {
  studentId: string = '';
  student: UserProfile | null = null;
  allLogs: DetailedLog[] = [];
  filteredLogs: DetailedLog[] = [];
  routines: Routine[] = [];
  allExercises: Exercise[] = [];

  isLoading: boolean = true;
  selectedRoutineId: string = 'all';

  constructor(
    private route: ActivatedRoute,
    private fitnessService: FitnessService
  ) { }

  ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    if (this.studentId) {
      this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load basic data
      const studentObs = this.fitnessService.getUserById(this.studentId);
      this.student = await firstValueFrom(studentObs) || null;

      const exercisesObs = this.fitnessService.getExercises();
      this.allExercises = await firstValueFrom(exercisesObs);

      const routinesObs = this.fitnessService.getRoutinesByInstructor('');
      this.routines = await firstValueFrom(routinesObs);

      const logsObs = this.fitnessService.getUserLogs(this.studentId);
      const rawLogs = await firstValueFrom(logsObs);

      // Process logs to include details
      this.allLogs = rawLogs.map(log => {
        const routine = this.routines.find(r => r.id === log.routineId);

        const displayExercises = (log.exerciseLogs || []).map(exLog => {
          const routineEx = routine?.exercises.find(re => re.exerciseId === exLog.exerciseId);
          const baseEx = this.allExercises.find(e => e.id === exLog.exerciseId);

          return {
            name: routineEx?.exerciseName || baseEx?.name || 'Ejercicio desconocido',
            plannedReps: routineEx?.reps || '--',
            actualReps: exLog.reps,
            plannedDuration: routineEx?.durationValue || 0,
            actualDuration: exLog.durationSeconds || 0,
            isSkipped: !!exLog.isSkipped
          };
        });

        const totalSessionSeconds = displayExercises.reduce((acc, ex) => acc + (ex.actualDuration || 0), 0);
        const totalSessionMinutes = Math.round(totalSessionSeconds / 60);

        return {
          ...log,
          routineName: routine?.name || 'Rutina eliminada',
          formattedDate: this.formatDate(log.date),
          displayExercises,
          duration: log.duration || totalSessionMinutes // Use explicit log duration or calculated
        };
      });

      this.applyFilter();
    } catch (error) {
      console.error('Error loading student details:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter() {
    if (this.selectedRoutineId === 'all') {
      this.filteredLogs = this.allLogs;
    } else {
      this.filteredLogs = this.allLogs.filter(l => l.routineId === this.selectedRoutineId);
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
}
