import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsViewerComponent} from './details-viewer.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {InteractionsDetailsService} from "../../shared/service/interactions-details.service";
import {InteractionParticipantsService} from "../shared/service/interaction-participants.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DetailsViewerComponent', () => {
  let component: DetailsViewerComponent;
  let fixture: ComponentFixture<DetailsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsViewerComponent ],
      providers: [InteractionsDetailsService, InteractionParticipantsService],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
