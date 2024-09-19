import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiSalonComponent } from './mi-salon.component';

describe('MiSalonComponent', () => {
  let component: MiSalonComponent;
  let fixture: ComponentFixture<MiSalonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiSalonComponent]
    });
    fixture = TestBed.createComponent(MiSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
