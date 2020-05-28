import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreationComponent } from './token-creation.component';

describe('TokenCreationComponent', () => {
  let component: TokenCreationComponent;
  let fixture: ComponentFixture<TokenCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
