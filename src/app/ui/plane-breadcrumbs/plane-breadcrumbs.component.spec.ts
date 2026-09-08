import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PlaneBreadcrumbsComponent } from './plane-breadcrumbs.component';

describe('PlaneBreadcrumbsComponent', () => {
  let fixture: ComponentFixture<PlaneBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneBreadcrumbsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneBreadcrumbsComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a link for every non-last item and plain text for the last', () => {
    fixture.componentRef.setInput('items', [
      { label: 'Projects', route: '/projects' },
      { label: 'My Project', route: '/projects/1' },
      { label: 'Work Items' },
    ]);
    fixture.detectChanges();

    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll(
      '.plane-breadcrumb-link',
    );
    const current: HTMLElement = fixture.nativeElement.querySelector('.is-current');

    expect(links.length).toBe(2);
    expect(current.textContent).toContain('Work Items');
  });
});
