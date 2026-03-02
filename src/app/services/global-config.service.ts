import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface AppConfig {
  email: {
    exceptions: string[];
    validDomain: string;
  };
  groupRange: number[];
  nameSplitter: string[];
  studentLimitsPerGroup: number[];
}

@Injectable({
  providedIn: 'root',
})
export class GlobalConfigService {
  private configSubject = new BehaviorSubject<AppConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(private firestore: Firestore) { }

  loadConfig() {
    const configDoc = doc(this.firestore, 'data/config');
    docData(configDoc).subscribe({
      next: (data: any) => {
        if (data) {
          const config: AppConfig = {
            email: {
              exceptions: data.email?.exceptions || [],
              validDomain: data.email?.validDomain || ''
            },
            groupRange: [Number(data.groupRange?.[0] || 0), Number(data.groupRange?.[1] || 0)],
            nameSplitter: data.nameSplitter || ['.', '_'],
            studentLimitsPerGroup: data.studentLimitsPerGroup || [20, 30]
          };
          this.configSubject.next(config);
          console.log('Global config loaded:', config);
        }
      },
      error: (error) => {
        console.error('Error loading config:', error);
      }
    });
  }

  getCurrentConfig(): AppConfig | null {
    return this.configSubject.getValue();
  }
}

