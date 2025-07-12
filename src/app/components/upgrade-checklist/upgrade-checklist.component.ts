import { Component, OnInit, Inject } from '@angular/core';
import { UpgradeService } from 'src/app/updgrade.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface ChecklistItem {
  version: string;
  items: string[];
}

@Component({
  selector: 'app-upgrade-checklist',
  templateUrl: './upgrade-checklist.component.html',
  styleUrls: ['./upgrade-checklist.component.scss']
})
export class UpgradeChecklistComponent implements OnInit {
  fromVersion: number = 8;
  toVersion: number = 17;
  checklist: ChecklistItem[] = [];
  completedItems: Set<string> = new Set();
  loading: boolean = false;
  errorMessage: string = '';

  constructor(@Inject(UpgradeService) private upgradeService: UpgradeService) {}

  ngOnInit(): void {
    // Component is ready to use
  }

  loadChecklist(): void {
    this.errorMessage = '';
    
    // Validation
    if (this.fromVersion >= this.toVersion) {
      this.errorMessage = 'From version must be less than To version';
      return;
    }

    if (this.fromVersion < 8 || this.toVersion > 20) {
      this.errorMessage = 'Please select versions between 8 and 20';
      return;
    }

    this.loading = true;
    
    this.upgradeService.getChainedChecklist(this.fromVersion, this.toVersion)
      .pipe(
        catchError(error => {
          console.error('Error loading checklist:', error);
          this.errorMessage = 'Failed to load checklist data. Please try again.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((items: string[]) => {
        this.parseChecklistItems(items);
      });
  }

  private parseChecklistItems(items: string[]): void {
    const sections: ChecklistItem[] = [];
    let currentSection: ChecklistItem | null = null;
    
    items.forEach(item => {
      if (item.startsWith('🔹 ')) {
        // This is a version header
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          version: item.replace('🔹 ', ''),
          items: []
        };
      } else if (item.startsWith('• ') && currentSection) {
        // This is a checklist item
        currentSection.items.push(item.replace('• ', ''));
      }
    });
    
    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    if (sections.length === 0) {
      this.errorMessage = 'No upgrade path found for the selected versions';
      return;
    }
    
    this.checklist = sections;
    this.completedItems.clear();
  }

  toggleItem(versionIndex: number, itemIndex: number): void {
    const key = `${versionIndex}-${itemIndex}`;
    
    if (this.completedItems.has(key)) {
      this.completedItems.delete(key);
    } else {
      this.completedItems.add(key);
    }
  }

  isItemCompleted(versionIndex: number, itemIndex: number): boolean {
    const key = `${versionIndex}-${itemIndex}`;
    return this.completedItems.has(key);
  }

  getCompletedCount(): number {
    return this.completedItems.size;
  }

  getTotalCount(): number {
    return this.checklist.reduce((total, section) => total + section.items.length, 0);
  }

  getProgressPercentage(): number {
    const total = this.getTotalCount();
    if (total === 0) return 0;
    return (this.getCompletedCount() / total) * 100;
  }

  resetChecklist(): void {
    this.checklist = [];
    this.completedItems.clear();
    this.errorMessage = '';
  }

  // Utility method to track items by index
  trackByIndex(index: number, item: any): number {
    return index;
  }
}