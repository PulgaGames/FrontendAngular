import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuglobalComponent } from './menuglobal.component';

describe('MenuglobalComponent', () => {
  let component: MenuglobalComponent;
  let fixture: ComponentFixture<MenuglobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuglobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuglobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
