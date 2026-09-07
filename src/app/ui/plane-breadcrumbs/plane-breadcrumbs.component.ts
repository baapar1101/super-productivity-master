import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface PlaneBreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'plane-breadcrumbs',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './plane-breadcrumbs.component.html',
  styleUrls: ['./plane-breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneBreadcrumbsComponent {
  readonly items = input<readonly PlaneBreadcrumbItem[]>([]);
}
