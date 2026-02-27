import { Component, OnInit } from '@angular/core';
import { FitnessService } from 'src/app/services/fitness.service';
import { UserProfile, WorkoutLog } from 'src/app/models/fitness.models';
import { firstValueFrom } from 'rxjs';

interface ClientProgress extends UserProfile {
  completedRoutines: number;
  overallExercisePercentage: number;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: false
})
export class ClientsPage implements OnInit {
  clients: ClientProgress[] = [];
  isLoading: boolean = true;

  constructor(private fitnessService: FitnessService) { }

  ngOnInit() {
    this.loadClients();
  }

  async loadClients() {
    this.isLoading = true;
    try {
      const users = await firstValueFrom(this.fitnessService.getAllClients());

      const clientsWithProgress = await Promise.all(users.map(async (user) => {
        const logs = await firstValueFrom(this.fitnessService.getUserLogs(user.uid));

        // Calcular rutinas completadas
        const completedRoutines = logs.length;

        // Calcular porcentaje global de ejercicios completados
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

      this.clients = clientsWithProgress;
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      this.isLoading = false;
    }
  }

}
