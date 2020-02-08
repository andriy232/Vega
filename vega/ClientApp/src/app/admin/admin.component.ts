import { ChartModule, ChartComponent } from 'angular2-chartjs';
import { VehicleService } from './../services/VehicleService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild(ChartComponent, { static: true }) chart: ChartComponent;
  data = {
    labels: ['BMW', 'Audi', 'Mazda'],
    datasets: [{
      data: [5, 3, 1],
      backgroundColor: [
        "#ff6384",
        "#36a2eb",
        "#ffce56",
        "#bb44ac"
      ]
    }]
  };

  private readonly defaultQuery = { pageSize: 1000 };

  constructor(vehicleService: VehicleService) {

    var sources = [
      vehicleService.getVehicles(this.defaultQuery),
      vehicleService.getMakes()
    ];

    Observable.forkJoin(sources)
      .subscribe(results => {

        var vehicles = results[0];
        var makes = <any[]>(results[1]);

        this.populateChart(vehicles, makes);
      },
        err => {
          console.log('error during loading: ' + err);
        }
      );
  }

  private populateChart(vehicles: any, makes: any[]) {
    var resultDictionary = new Dictionary<number>();

    vehicles.items.forEach(element => {
      var name = element.make.name;
      if (resultDictionary.containsKey(name)) {
        var value = resultDictionary[name];
        resultDictionary.remove(name);
        resultDictionary.add(name, value + 1);
      }
      else
        resultDictionary.add(name, 1);
    });

    makes.forEach(element => {
      if (!resultDictionary.containsKey(element.name))
        resultDictionary.add(element.name, 0);
    });

    this.data.labels = resultDictionary._keys;
    this.data.datasets[0].data = resultDictionary._values;

    this.forceChartRefresh();
  }

  forceChartRefresh() {
    setTimeout(() => {
      this.chart.chart.update();
    }, 10);
  }

  ngOnInit() {
  }
}

interface IDictionary<T> {
  add(key: string, value: T): void;
  remove(key: string): void;
  containsKey(key: string): boolean;
  keys(): string[];
  values(): T[];
}

class Dictionary<T> implements IDictionary<T> {

  _keys: string[] = [];
  _values: T[] = [];

  constructor(init?: { key: string; value: T; }[]) {
    if (init) {
      for (var x = 0; x < init.length; x++) {
        this[init[x].key] = init[x].value;
        this._keys.push(init[x].key);
        this._values.push(init[x].value);
      }
    }
  }

  add(key: string, value: T) {
    this[key] = value;
    this._keys.push(key);
    this._values.push(value);
  }

  remove(key: string) {
    var index = this._keys.indexOf(key, 0);
    this._keys.splice(index, 1);
    this._values.splice(index, 1);

    delete this[key];
  }

  keys(): string[] {
    return this._keys;
  }

  values(): T[] {
    return this._values;
  }

  containsKey(key: string) {
    if (typeof this[key] === "undefined") {
      return false;
    }

    return true;
  }

  toLookup(): IDictionary<T> {
    return this;
  }
}