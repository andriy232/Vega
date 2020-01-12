import { PaginationModule } from 'ng2-bootstrap/pagination';
import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../models/Vehicle';
import { VehicleService } from '../services/VehicleService';
import { KeyValuePair } from '../models/KeyValuePair';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  private readonly PAGE_SIZE = 3;

  vehicles: Vehicle[];
  makes: KeyValuePair[];
  filter: any = {};

  queryResult: any = {};
  query: any = {
    pageSize: this.PAGE_SIZE
  };
  columns = [
    { title: 'Id' },
    { title: 'Contact Name', key: 'contactName', isSortable: true },
    { title: 'Make', key: 'make', isSortable: true },
    { title: 'Model', key: 'model', isSortable: true },
    {}
  ];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.filter)
      .subscribe(result => this.vehicles = result);
  }

  onFilterChange() {
    // client side filtering

    //var filteredVehicles = this.allVehicles;
    //if (this.filter.makeId)
    //  filteredVehicles = filteredVehicles.filter(v => v.make.id == this.filter.makeId);
    //
    //if (this.filter.modelId)
    //  filteredVehicles = filteredVehicles.filter(v => v.model.id == this.filter.modelId);
    
    //this.vehicles = filteredVehicles;
    //this.query.page = 1;
    this.populateVehicles();
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();

    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    //this.populateVehicles();
  }

  sortBy(columnName) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }

  onPageChange(page) {
    this.query.page = page;
    this.populateVehicles();
  }
}
