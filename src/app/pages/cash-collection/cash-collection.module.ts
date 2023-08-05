import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxEchartsModule } from "ngx-echarts";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { MatSelectModule } from "@angular/material/select";
import { NavTitleService } from "src/app/shared/services/nav-title.service";
import { NumberAcceptModule } from "src/app/shared/validation-directives/validation.module";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "src/app/shared/shared.module";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CashCollectionRoutingModule } from "./cash-collection-routing.module";
import { CashCollectionComponent } from "./cash-collection/cash-collection.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    SelectDropDownModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    MatSelectModule,
    NumberAcceptModule,
    // MoneyTransferRoutingModule,
    CashCollectionRoutingModule,
    MatTableModule,
    MatIconModule,
    SharedModule,
    MatPaginatorModule,
    ScrollingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatAutocompleteModule
  ],
  exports: [SelectDropDownModule],
  declarations: [
    CashCollectionComponent
  ],
  providers: [
    NavTitleService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: "always" },
    },
  ],
})
export class CashCollectionModule {}
