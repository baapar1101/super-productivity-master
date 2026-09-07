import { ChangeDetectionStrategy, Component } from '@angular/core';

// Structural two-slot layout: `<plane-header><div left>…</div><div right>…</div></plane-header>`.
// No inputs — purely arranges projected content, mirroring Plane's
// `<Header><Header.LeftItem/><Header.RightItem/></Header>` layout primitive.
@Component({
  selector: 'plane-header',
  standalone: true,
  templateUrl: './plane-header.component.html',
  styleUrls: ['./plane-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneHeaderComponent {}
