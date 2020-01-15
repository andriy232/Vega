import { PhotoService } from './../services/PhotoService';
import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { VehicleService } from "../services/VehicleService";
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {

  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>;

  vehicle: any;
  vehicleId: number;
  photos: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private vehicleService: VehicleService,
    private photoService: PhotoService) {

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
    var nativeElement: HTMLInputElement = this.fileInput.first.nativeElement;
    this.photoService.upload(this.vehicleId, nativeElement.files[0])
      .subscribe(photo => {
        console.log(photo);
        this.photos.push(photo);
      }
      );
  }
}
