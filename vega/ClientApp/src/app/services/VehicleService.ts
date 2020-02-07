import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SaveVehicle } from '../models/SaveVehicle';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    private readonly vehicleEndpoint = '/api/vehicles';

    constructor(private http: Http, private httpClient: HttpClient) {
    }

    getFeatures() {
        return this.http.get('/api/features')
            .map(res => res.json());
    }

    getMakes() {
        return this.http.get('/api/makes')
            .map(res => res.json());
    }

    create(vehicle) {
        return this.httpClient.post(this.vehicleEndpoint, vehicle);
    }

    update(vehicle: SaveVehicle) {
        return this.httpClient.put(`${this.vehicleEndpoint}/${vehicle.id}`, vehicle);
    }

    deleteVehicle(id) {
        return this.httpClient.delete(`${this.vehicleEndpoint}/${id}`);
    }

    getVehicle(id) {
        return this.http.get(`${this.vehicleEndpoint}/${id}`)
            .map(res => res.json());
    }

    getVehicles(filter) {
        return this.http
            .get(`${this.vehicleEndpoint}?${this.toQueryString(filter)}`)
            .map(res => res.json());
    }

    toQueryString(obj) {
        var parts = [];
        for (var property in obj) {
            var value = obj[property];
            if (value != null && value != undefined) {
                parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
            }
        }

        return parts.join('&');
    }
}
