import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFeatureComponent } from './request-feature.component';

describe('RequestFeatureComponent', () => {
  let component: RequestFeatureComponent;
  let fixture: ComponentFixture<RequestFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestFeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
