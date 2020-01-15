import { Component, OnInit } from '@angular/core';
import { VehicleService } from "../services/VehicleService";
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import { SaveVehicle } from '../models/SaveVehicle';
import { Vehicle } from "../models/Vehicle";
import * as _ from 'underscore';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {
  vehicle: any;
  vehcileId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private vehicleService: VehicleService) {

    route.params.subscribe(p => {
      this.vehcileId = +p['id'];
      if (isNaN(this.vehcileId) || this.vehcileId <= 0) {
        router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.vehcileId)
      .subscribe(v => this.vehicle = v, err => {
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
}
