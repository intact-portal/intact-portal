import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailsDashboardComponent} from './details-dashboard.component';
import {DetailsTabsComponent} from './details-tabs/details-tabs.component';
import {InteractionDetailsComponent} from './details-tabs/details/interaction-details.component';
import {ExternalXrefsComponent} from './details-tabs/details/external-xrefs/external-xrefs.component';
import {CurationAnnotationsComponent} from './details-tabs/details/curation-annotations/curation-annotations.component';
import {DetailsViewerComponent} from './details-viewer/details-viewer.component';
import {ExperimentalConditionsComponent} from './details-tabs/details/experimental-conditions/experimental-conditions.component';
import {ParametersComponent} from './details-tabs/details/parameters/parameters.component';
import {ConfidencesComponent} from './details-tabs/details/confidences/confidences.component';
import {InteractionDetailsRoutingModule} from './interaction-details-routing.module';
import {ExperimentComponent} from './details-tabs/details/experiment/experiment.component';
import {PublicationComponent} from './details-tabs/details/publication/publication.component';
import {ParticipantTableComponent} from './details-tabs/details/participant-table/participant-table.component';
import {FeaturesTableComponent} from './details-tabs/details/features-table/features-table.component';
import {CvTermComponent} from './details-tabs/details/cv-term/cv-term.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { CvToUrlPipe } from './details-tabs/details/cv-term/cv-to-url.pipe';
import { OrganismPipe } from './details-tabs/details/organism/organism.pipe';
import {TableFactoryService} from "../shared/service/table-factory.service";
import {InteractionParticipantsService} from "./shared/service/interaction-participants.service";
import {ComponentsModule} from "../../shared/components/components.module";


@NgModule({
  imports: [
    CommonModule,
    InteractionDetailsRoutingModule,
    MatTooltipModule,
    ComponentsModule
  ],
  exports: [],
  declarations: [
    DetailsDashboardComponent,
    DetailsViewerComponent,
    DetailsTabsComponent,
    InteractionDetailsComponent,
    ExternalXrefsComponent,
    ParametersComponent,
    ExperimentalConditionsComponent,
    CurationAnnotationsComponent,
    ConfidencesComponent,
    ExperimentComponent,
    PublicationComponent,
    ParticipantTableComponent,
    FeaturesTableComponent,
    CvTermComponent,
    CvToUrlPipe,
    OrganismPipe
  ],
  providers: [
    TableFactoryService,
    InteractionParticipantsService
  ]
})
export class InteractionDetailsModule {
}
