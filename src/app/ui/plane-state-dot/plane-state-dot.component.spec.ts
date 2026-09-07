import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneStateDotComponent } from './plane-state-dot.component';

describe('PlaneStateDotComponent', () => {
  let fixture: ComponentFixture<PlaneStateDotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneStateDotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneStateDotComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('falls back to the group color when no explicit color is set', () => {
    fixture.componentRef.setInput('group', 'completed');
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('var(--state-group-completed)');
  });

  it('prefers an explicit color over the group fallback', () => {
    fixture.componentRef.setInput('group', 'completed');
    fixture.componentRef.setInput('color', '#ff00ff');
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('#ff00ff');
  });
});
