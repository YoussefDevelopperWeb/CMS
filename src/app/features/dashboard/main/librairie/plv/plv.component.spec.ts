import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlvComponent } from './plv.component';

describe('PlvComponent', () => {
  let component: PlvComponent;
  let fixture: ComponentFixture<PlvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
