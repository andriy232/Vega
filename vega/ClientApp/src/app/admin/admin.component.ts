import { VehicleService } from './../services/VehicleService';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  data = {
    labels: ['BMW', 'Audi', 'Mazda'],
    datasets: [{
      data: [5, 3, 1],
      backgroundColor: [
        "#ff6384",
        "#36a2eb",
        "#ffce56"]
    }]
  };

  constructor(private vehicleService: VehicleService) {
    vehicleService.getVehicles(null).subscribe(r => {
      console.log(r);
    });
  }

  ngOnInit() {
  }
}
