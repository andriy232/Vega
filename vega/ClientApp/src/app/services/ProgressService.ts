import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProgressService {

    private uploadProgress: Subject<any>;

    startTracking(): Subject<any> {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress) {
        if (this.uploadProgress)
            this.uploadProgress.next(progress);
    }

    endTracking() {
        if (this.uploadProgress)
            this.uploadProgress.complete();
    }
}
