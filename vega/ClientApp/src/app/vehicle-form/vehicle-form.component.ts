import { Component, OnInit } from '@angular/core';
import { VehicleService } from "../services/VehicleService";
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import { SaveVehicle } from '../models/SaveVehicle';
import { Vehicle } from "../models/Vehicle";
import * as _ from 'underscore';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];

  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      email: '',
      phone: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastyService: ToastyService) {

    route.params.subscribe(p => {
      this.vehicle.id = +p['id'] || 0;
    });
  }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()

    ];
    if (this.vehicle.id) {
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));
    }

    Observable.forkJoin(sources)
      .subscribe(data => {

        this.makes = data[0];
        this.features = data[1];

        if (this.vehicle.id)
          this.setVehicle(data[2]);

        this.populateModels();
      }, err => {
        if (err.status == 404) {
          console.log('not found vehicle with such id: ' + this.vehicle.id);
          this.router.navigate(['/']);
        }
      });
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId, $event) {
    if ($event.target.checked) {
      this.vehicle.features.push(featureId);
    }
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    var result$ = this.vehicle.id ?
      this.vehicleService.update(this.vehicle) :
      this.vehicleService.create(this.vehicle);

    result$.subscribe(x => {

      this.toastyService.success({
        title: 'Success',
        msg: 'Data was successfully saved.',
        theme: 'bootstrap',
        showClose: true,
        timeout: 5000
      });

      this.router.navigate(['/vehicles/', this.vehicle.id]);
    });
  }
}
