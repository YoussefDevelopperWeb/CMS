import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContentComponent } from './home-main.component';

describe('DashboardComponent', () => {
  let component: HomeContentComponent;
  let fixture: ComponentFixture<HomeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
