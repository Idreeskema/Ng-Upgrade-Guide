import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  constructor(private http: HttpClient) {}

  getChainedChecklist(from: number, to: number): Observable<string[]> {
    return this.http.get<{ [key: string]: any }>('assets/check-list.json').pipe(
      map(data => {
        const checklist: string[] = [];
        for (let i = from; i < to; i++) {
          const key = `${i}-${i + 1}`;
          if (data[key]) {
            checklist.push(`🔹 ${data[key].version}`);
            checklist.push(...data[key].items.map((item: any) => `• ${item}`));
          }
        }
        return checklist;
      })
    );
  }

  // Additional utility methods for better functionality
  getAvailableVersions(): Observable<number[]> {
    return this.http.get<{ [key: string]: any }>('assets/check-list.json').pipe(
      map(data => {
        const versions = new Set<number>();
        Object.keys(data).forEach(key => {
          const [from, to] = key.split('-').map(Number);
          versions.add(from);
          versions.add(to);
        });
        return Array.from(versions).sort((a, b) => a - b);
      })
    );
  }

  getUpgradeStepsCount(from: number, to: number): Observable<number> {
    return this.http.get<{ [key: string]: any }>('assets/check-list.json').pipe(
      map(data => {
        let totalSteps = 0;
        for (let i = from; i < to; i++) {
          const key = `${i}-${i + 1}`;
          if (data[key]) {
            totalSteps += data[key].items.length;
          }
        }
        return totalSteps;
      })
    );
  }

  getVersionInfo(version: number): Observable<{ from: number; to: number; items: string[] } | null> {
    return this.http.get<{ [key: string]: any }>('assets/check-list.json').pipe(
      map(data => {
        const key = `${version}-${version + 1}`;
        if (data[key]) {
          return {
            from: version,
            to: version + 1,
            items: data[key].items
          };
        }
        return null;
      })
    );
  }
}