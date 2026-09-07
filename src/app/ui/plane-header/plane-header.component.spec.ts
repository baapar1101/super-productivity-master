import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneHeaderComponent } from './plane-header.component';

@Component({
  standalone: true,
  imports: [PlaneHeaderComponent],
  template: `
    <plane-header>
      <span left>Breadcrumbs</span>
      <span right>Actions</span>
    </plane-header>
  `,
})
class HostComponent {}

describe('PlaneHeaderComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('projects left content into the left slot', () => {
    const left: HTMLElement = fixture.nativeElement.querySelector('.plane-header-left');
    expect(left.textContent).toContain('Breadcrumbs');
  });

  it('projects right content into the right slot', () => {
    const right: HTMLElement = fixture.nativeElement.querySelector('.plane-header-right');
    expect(right.textContent).toContain('Actions');
  });
});
