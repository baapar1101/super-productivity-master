import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanePriorityIconComponent } from './plane-priority-icon.component';

describe('PlanePriorityIconComponent', () => {
  let fixture: ComponentFixture<PlanePriorityIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanePriorityIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanePriorityIconComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('treats a null priority as none', () => {
    fixture.componentRef.setInput('priority', null);
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedPriority()).toBe('none');
    expect(fixture.componentInstance.icon()).toBe('remove');
  });

  it('maps urgent to the priority_high glyph and urgent color token', () => {
    fixture.componentRef.setInput('priority', 'urgent');
    fixture.detectChanges();
    expect(fixture.componentInstance.icon()).toBe('priority_high');
    expect(fixture.componentInstance.colorVar()).toBe('var(--priority-urgent)');
  });
});
