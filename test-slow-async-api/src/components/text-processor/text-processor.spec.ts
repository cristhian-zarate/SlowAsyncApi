import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextProcessor } from './text-processor';

describe('TextProcessor', () => {
  let component: TextProcessor;
  let fixture: ComponentFixture<TextProcessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextProcessor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextProcessor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
