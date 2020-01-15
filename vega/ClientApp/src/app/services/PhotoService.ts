import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    private readonly endpoint = '/api/vehicles';

    constructor(private http: Http) {
    }

    upload(vehicleId, photo) {
        var formData = new FormData();
        formData.append('file', photo);

        return this.http.post(`${this.endpoint}/${vehicleId}/photos`, formData)
            .map(res => res.json());
    }

    getPhotos(vehicleId) {
        return this.http.get(`${this.endpoint}/${vehicleId}/photos`)
            .map(res => res.json());
    }
}
