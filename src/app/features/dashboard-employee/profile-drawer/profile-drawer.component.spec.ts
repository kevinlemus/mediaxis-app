import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDrawerComponent } from './profile-drawer.component';

describe('ProfileDrawerComponent', () => {
  let component: ProfileDrawerComponent;
  let fixture: ComponentFixture<ProfileDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
