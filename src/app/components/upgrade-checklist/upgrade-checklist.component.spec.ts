import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeChecklistComponent } from './upgrade-checklist.component';

describe('UpgradeChecklistComponent', () => {
  let component: UpgradeChecklistComponent;
  let fixture: ComponentFixture<UpgradeChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
