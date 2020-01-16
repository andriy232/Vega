import { ProgressService } from './ProgressService';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';
import { BrowserXhr } from '@angular/http';

@Injectable({
    providedIn: 'root'
})
export class BrowserXhrWithProgress extends BrowserXhr {
  
    constructor(private service: ProgressService) {
        super();
    }

    build(): XMLHttpRequest {

        var xhr: XMLHttpRequest = super.build();

        xhr.upload.onprogress = (event) => {
            this.service.notify(this.createProgress(event));
        }

        xhr.upload.onloadend = () => {
            this.service.endTracking();
        };

        return xhr;
    }

    private createProgress(event) {
        return {
            total: event.total,
            percentage: Math.round(event.loaded / event.total * 100)
        };
    }
}
