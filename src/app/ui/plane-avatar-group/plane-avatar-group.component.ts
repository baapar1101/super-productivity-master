import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface PlaneAvatarPerson {
  id: string;
  name: string;
  imgUrl?: string;
}

@Component({
  selector: 'plane-avatar-group',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './plane-avatar-group.component.html',
  styleUrls: ['./plane-avatar-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneAvatarGroupComponent {
  readonly avatars = input<readonly PlaneAvatarPerson[]>([]);
  readonly max = input<number>(3);

  readonly visible = computed(() => this.avatars().slice(0, this.max()));
  readonly overflowCount = computed(() =>
    Math.max(0, this.avatars().length - this.max()),
  );

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
