import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictosComponent } from './pictos.component';

describe('PictosComponent', () => {
  let component: PictosComponent;
  let fixture: ComponentFixture<PictosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
