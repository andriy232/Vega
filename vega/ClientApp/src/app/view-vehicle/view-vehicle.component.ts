import { AuthService } from './../services/AuthService';
import { ProgressService } from './../services/ProgressService';
import { PhotoService } from './../services/PhotoService';
import { Component, OnInit, ElementRef, ViewChildren, QueryList, NgZone } from '@angular/core';
import { VehicleService } from "../services/VehicleService";
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';
import { BrowserXhr } from '@angular/http';
import { BrowserXhrWithProgress } from '../services/BrowserXhrWithProgress';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css'],
  providers: [
    { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    ProgressService
  ]
})
export class ViewVehicleComponent implements OnInit {

  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>;

  vehicle: any;
  vehicleId: number;
  photos: any[];
  progress: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
    private vehicleService: VehicleService,
    private progressService: ProgressService,
    private photoService: PhotoService,
    private auth: AuthService,
    private zone: NgZone) {

    route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(v => this.photos = v);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(v => {
        this.vehicle = v;
      }, err => {
        if (err.status == 404) {
          this.router.navigate(['/vehicles']);
          return;
        }
      });
  }

  delete() {
    if (confirm("Are you sure to delete that vehicle?")) {
      this.vehicleService.deleteVehicle(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/']);
        });
    }
  }

  uploadPhoto() {

    this.progressService.startTracking()
      .subscribe(progress => {
        this.zone.run(() => {
          this.progress = progress;
        });
      },
        null,
        () => {
          this.progress = null;
        }
      );

    var nativeElement: HTMLInputElement = this.fileInput.first.nativeElement;
    var file = nativeElement.files[0];
    nativeElement.value = '';

    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => {
        console.log("photo", photo);
        this.photos.push(photo);

      }, err => {
        this.toastyService.error({
          title: 'Error',
          msg: err.text(),
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
      }
      );
  }
}
