import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanePillComponent } from './plane-pill.component';

describe('PlanePillComponent', () => {
  let fixture: ComponentFixture<PlanePillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanePillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanePillComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults to the default/sm/square variant attributes', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.plane-pill');
    expect(el.getAttribute('data-variant')).toBe('default');
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-radius')).toBe('square');
  });

  it('reflects input changes onto host attributes', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('radius', 'circle');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.plane-pill');
    expect(el.getAttribute('data-variant')).toBe('success');
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-radius')).toBe('circle');
  });
});
