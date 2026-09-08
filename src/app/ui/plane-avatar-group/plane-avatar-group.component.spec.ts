import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  PlaneAvatarGroupComponent,
  PlaneAvatarPerson,
} from './plane-avatar-group.component';

describe('PlaneAvatarGroupComponent', () => {
  let fixture: ComponentFixture<PlaneAvatarGroupComponent>;

  const people: PlaneAvatarPerson[] = [
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper' },
    { id: '3', name: 'Margaret Hamilton' },
    { id: '4', name: 'Katherine Johnson' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneAvatarGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneAvatarGroupComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('caps visible avatars at max and reports the overflow count', () => {
    fixture.componentRef.setInput('avatars', people);
    fixture.componentRef.setInput('max', 3);
    fixture.detectChanges();
    expect(fixture.componentInstance.visible().length).toBe(3);
    expect(fixture.componentInstance.overflowCount()).toBe(1);
  });

  it('derives two-letter initials from a full name', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.initials('Ada Lovelace')).toBe('AL');
    expect(fixture.componentInstance.initials('Cher')).toBe('CH');
    expect(fixture.componentInstance.initials('')).toBe('?');
  });
});
