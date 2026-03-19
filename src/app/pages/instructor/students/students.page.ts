import { Component, OnInit } from '@angular/core';
import { FitnessService } from 'src/app/services/fitness.service';
import { UserProfile, WorkoutLog, Routine } from 'src/app/models/fitness.models';
import { firstValueFrom } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { GlobalConfigService } from 'src/app/services/global-config.service';

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
  allValidGroups: number[] = [];

  constructor(
    private fitnessService: FitnessService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private globalConfig: GlobalConfigService
  ) { }

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

      // Extract unique groups from current students
      const groups = new Set<number>();
      users.forEach((user: any) => {
        if (user.group !== undefined && user.group !== null) {
          groups.add(user.group);
        }
      });
      this.availableGroups = Array.from(groups).sort((a, b) => a - b);

      // Extract all valid groups from global config
      const config = this.globalConfig.getCurrentConfig();
      if (config && config.groupRange && config.groupRange.length === 2) {
        const start = config.groupRange[0];
        const end = config.groupRange[1];
        const allGroups = [];
        for (let i = start; i <= end; i++) {
          allGroups.push(i);
        }
        this.allValidGroups = allGroups;
      }

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

  async changeCourse(student: StudentProgress) {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar Curso',
      subHeader: `Estudiante: ${student.displayName}`,
      message: 'Selecciona el nuevo curso para el estudiante. Esto también actualizará sus rutinas asignadas.',
      inputs: this.allValidGroups.map(group => ({
        type: 'radio',
        label: `Curso ${group}`,
        value: group,
        checked: student.group === group
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: (newGroup) => {
            if (newGroup !== undefined && newGroup !== student.group) {
              this.updateStudentGroup(student.uid, newGroup);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async updateStudentGroup(userId: string, newGroup: number) {
    this.isLoading = true;
    try {
      await this.fitnessService.updateStudentGroup(userId, newGroup);
      const toast = await this.toastCtrl.create({
        message: 'Curso actualizado con éxito.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      await this.loadStudents();
    } catch (error) {
      console.error('Error updating student group:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al actualizar el curso.',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
