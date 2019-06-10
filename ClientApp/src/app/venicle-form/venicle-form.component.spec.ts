import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenicleFormComponent } from './venicle-form.component';

describe('VenicleFormComponent', () => {
  let component: VenicleFormComponent;
  let fixture: ComponentFixture<VenicleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenicleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenicleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
