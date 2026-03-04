import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { FitnessService } from '../../../services/fitness.service';
import { AuthService } from '../../../services/auth.service';
import { Routine, Exercise, WorkoutLog, UserProfile } from '../../../models/fitness.models';
import { Subscription } from 'rxjs';

type ExecutionState = 'intro' | 'wait' | 'exercise' | 'summary';

interface SetData {
  exerciseIndex: number;
  setNumber: number;
  routineExercise: any; // from routine.exercises
  actualExercise: Exercise | undefined;
}

@Component({
  selector: 'app-routine-execution',
  templateUrl: './routine-execution.page.html',
  styleUrls: ['./routine-execution.page.scss'],
  standalone: false
})
export class RoutineExecutionPage implements OnInit, OnDestroy {
  routineId: string = '';
  routine: Routine | null = null;
  allExercises: Exercise[] = [];
  userProfile: UserProfile | null = null;

  state: ExecutionState = 'intro';

  // Flat list of all sets across all exercises
  allSets: SetData[] = [];
  currentSetIndex: number = 0;

  // Timers
  timerInterval: any;
  timeLeft: number = 0;
  totalTime: number = 100;
  progress: number = 0; // 0 to 1
  isPaused: boolean = false;

  pauseCount: number = 0;

  // Current Reps entered by user
  currentRepsInput: number | null = null;

  // Log data
  // Log data
  exerciseLogs: { logIndex: number, exerciseIndex: number, setNumber: number, reps: number | null, exerciseId: string, name: string, isSkipped?: boolean }[] = [];
  difficulty: 'easy' | 'normal' | 'hard' | null = null;
  // ... (keep the rest the same up to missingRepsLogs)
  // I need to use multi_replace for multiple changes, or do them one by one. I will use multi_replace instead of this.

  subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private fitnessService: FitnessService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('id') || '';
    if (this.routineId) {
      this.subs.push(
        this.authService.currentUser$.subscribe(p => this.userProfile = p)
      );
      this.loadData();
    } else {
      this.navCtrl.back();
    }
  }

  ngOnDestroy() {
    this.clearTimer();
    this.subs.forEach(s => s.unsubscribe());
  }

  async loadData() {
    this.subs.push(
      this.fitnessService.getExercises().subscribe(exs => {
        this.allExercises = exs;

        this.subs.push(
          this.fitnessService.getRoutineById(this.routineId).subscribe(r => {
            if (r) {
              this.routine = r;
              this.buildSets();
            }
          })
        );
      })
    );
  }

  buildSets() {
    if (!this.routine || !this.routine.exercises) return;
    this.allSets = [];
    this.exerciseLogs = [];

    const sortedEx = [...this.routine.exercises].sort((a, b) => (a.order || 0) - (b.order || 0));

    let logIdx = 0;
    sortedEx.forEach((rx, index) => {
      const sets = rx.sets || 1;
      const actualEx = this.allExercises.find(e => e.id === rx.exerciseId);
      for (let i = 1; i <= sets; i++) {
        this.allSets.push({
          exerciseIndex: index,
          setNumber: i,
          routineExercise: rx,
          actualExercise: actualEx
        });
        this.exerciseLogs.push({
          logIndex: logIdx++,
          exerciseIndex: index,
          setNumber: i,
          reps: null,
          exerciseId: rx.exerciseId,
          name: rx.exerciseName || actualEx?.name || 'Ejercicio'
        });
      }
    });
  }

  startRoutine() {
    this.currentSetIndex = 0;
    this.startWait();
  }

  get currentSetData(): SetData {
    return this.allSets[this.currentSetIndex];
  }

  get isFirstExercise(): boolean {
    return this.currentSetIndex === 0;
  }

  startWait() {
    this.state = 'wait';
    this.currentRepsInput = null;

    // Si no es el primer set, es "Descanso" y guardamos la config de descanso del ejercicio anterior
    let restSecs = 15;
    if (this.isFirstExercise) {
      // Tiempo de preparación inicial fijo o el del primer ejercicio
      restSecs = this.currentSetData.routineExercise.restSeconds || 10;
    } else {
      // Descanso basado en el ejercicio previo
      const prevSet = this.allSets[this.currentSetIndex - 1];
      restSecs = prevSet.routineExercise.restSeconds || 15;
    }

    this.startTimer(restSecs, () => {
      this.saveCurrentReps();
      this.startExercise();
    });
  }

  skipWait() {
    this.saveCurrentReps();
    this.startExercise();
  }

  startExercise() {
    this.state = 'exercise';
    const dur = this.currentSetData.routineExercise.durationValue;
    if (dur && dur > 0) {
      this.startTimer(dur, () => {
        this.finishCurrentExercise();
      });
    } else {
      // Si no tiene duración, es manual, no hay timer
      this.startTimerUp();
    }
  }

  finishCurrentExercise() {
    this.clearTimer();
    this.currentSetIndex++;
    if (this.currentSetIndex < this.allSets.length) {
      this.startWait();
    } else {
      this.finishRoutine();
    }
  }

  saveCurrentReps() {
    // Current Wait is for the previous set.
    if (this.currentRepsInput !== null && this.currentSetIndex > 0) {
      const prevLog = this.exerciseLogs[this.currentSetIndex - 1];
      prevLog.reps = this.currentRepsInput;
    }
    this.currentRepsInput = null;
  }

  finishRoutine() {
    // Si estabamos en el úlimo ejercicio y solo requería 'Next', al terminar pasamos a summary.
    // O si la duración acabó, termina. Pero el UI del Wait para llenar repeticiones no sale para el ÚLTIMO ejercicio.
    // Porque al acabar el último ejercicio, asamos a 'summary' directo.
    // Entonces faltan ingresar reps del último. Las ingresará en el Summary.
    this.state = 'summary';
    this.clearTimer();
  }

  startTimer(seconds: number, onComplete: () => void) {
    this.clearTimer();
    this.totalTime = seconds;
    this.timeLeft = seconds;
    this.progress = 1;
    this.isPaused = false;

    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.timeLeft--;
        this.progress = this.timeLeft / this.totalTime;
        if (this.timeLeft <= 0) {
          this.clearTimer();
          onComplete();
        }
      }
    }, 1000);
  }

  startTimerUp() {
    this.clearTimer();
    this.timeLeft = 0;
    this.totalTime = 0; // Means no limit
    this.progress = 0;
    this.isPaused = false;

    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.timeLeft++;
        // No totalTime so progress is indeterminate or zero
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  togglePause() {
    if (this.isPaused) {
      this.isPaused = false;
    } else {
      this.isPaused = true;
      this.pauseCount++;
    }
  }

  async showInfo() {
    const ex = this.currentSetData.actualExercise;
    // We only show IF there is description
    if (!ex || !ex.description || ex.description.trim() === '') return;

    const wasPaused = this.isPaused;
    this.isPaused = true;

    const alert = await this.alertCtrl.create({
      header: ex.name,
      message: ex.description,
      buttons: ['Entendido'],
      backdropDismiss: false,
      cssClass: 'custom-alert-info'
    });

    await alert.present();
    await alert.onDidDismiss();

    if (!wasPaused) {
      this.isPaused = false;
    }
  }

  skipCurrentExercise() {
    if (this.currentSetIndex < this.exerciseLogs.length) {
      this.exerciseLogs[this.currentSetIndex].isSkipped = true;
      this.exerciseLogs[this.currentSetIndex].reps = 0;
    }
    this.finishCurrentExercise();
  }

  get missingRepsLogs() {
    return this.exerciseLogs.filter(l => !l.isSkipped && (l.reps === null || l.reps === undefined));
  }

  setDifficulty(diff: 'easy' | 'normal' | 'hard') {
    this.difficulty = diff;
  }

  async submitLog() {
    if (!this.difficulty) {
      this.showToast('Por favor selecciona la dificultad de la rutina.', 'warning');
      return;
    }

    if (!this.userProfile) return;

    // Formato de ejercicios para guardar
    const sumReps = this.exerciseLogs.map(l => ({
      exerciseId: l.exerciseId,
      reps: l.reps || 0,
      isSkipped: !!l.isSkipped
    }));

    const skippedCount = this.exerciseLogs.filter(l => l.isSkipped).length;
    const completedCount = this.allSets.length - skippedCount;

    const log: WorkoutLog = {
      userId: this.userProfile.uid,
      routineId: this.routineId,
      date: new Date(),
      difficulty: this.difficulty,
      pauseCount: this.pauseCount,
      exerciseLogs: sumReps,
      completedExercisesCount: completedCount,
      totalExercisesCount: this.allSets.length,
      skippedExercisesCount: skippedCount
    };

    try {
      await this.fitnessService.logWorkout(log);
      this.showToast('¡Rutina finalizada con éxito!', 'success');
      this.navCtrl.navigateRoot('/user'); // Go back to dashboard
    } catch (err) {
      this.showToast('Error al guardar la rutina', 'danger');
    }
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color,
      duration: 2500,
      position: 'bottom'
    });
    toast.present();
  }

  formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
