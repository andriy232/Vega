import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProgressService {

    private uploadProgress: Subject<any>;

    startTracking() {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress) {
        this.uploadProgress.next(progress);
    }

    endTracking() {
        this.uploadProgress.complete();
    }
}
