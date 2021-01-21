/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 * 
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 * 
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AdminPageContainerComponent } from './pages/admin-page-container/admin-page-container.component';
import { EntriesLibraryComponent } from './components/entries/entries-library/entries-library.component';
import { EntriesListComponent } from './components/entries/entries-list/entries-list.component';
import { EntriesListDragAndDropComponent } from './components/entries/entries-list-drag-and-drop/entries-list-drag-and-drop.component';
import { EntriesListSelectComponent } from './components/entries/entries-list-select/entries-list-select.component';
import { ModelEntryPageComponent } from './pages/Configuration/model-entry-page/model-entry-page.component';
import { BasicinfoComponent } from './components/entry/basicinfo/basicinfo.component';
import { ProcessingComponent } from './components/entry/processing/processing.component';
import { ConditionsComponent } from './components/entry/conditions/conditions.component';
import { EntryEditorDialogComponent } from './components/entry/entry-editor-dialog/entry-editor-dialog.component';
import { EntryInfoComponent } from './components/entry/entry-info/entry-info.component';
import { EntryCardComponent } from './components/entry/entry-card/entry-card.component';
import { ThemeComponent } from './components/entry/theme/theme.component';
import { CollectFormCreatorPageComponent } from './pages/Integration/collect-form-creator-page/collect-form-creator-page.component';
import { ThemesPageComponent } from './pages/Configuration/model-library-pages/themes-page.component';
import { FormUrlDialogComponent } from './components/form-url-dialog/form-url-dialog.component';
import { EmailsPageComponent } from './pages/Configuration/model-library-pages/emails-page.component';
import { EmailComponent } from './components/entry/email/email.component';
import { EntryPreviewComponent } from './components/entry/entry-preview/entry-preview.component';
import { PreferenceComponent } from './components/entry/preference/preference.component';
import { PreferencesPageComponent } from './pages/Configuration/model-library-pages/preferences-page.component';
import { DashboardPageComponent } from './pages/Home/dashboard-page/dashboard-page.component';
import { ConditionsPageComponent } from './pages/Configuration/model-library-pages/conditions-page.component';
import { BasicinfoPageComponent } from './pages/Configuration/model-library-pages/basicinfo-page.component';
import { ProcessingPageComponent } from './pages/Configuration/model-library-pages/processing-page.component';
import { GeneratedKeyDialogComponent, AccessKeysPageComponent } from './pages/Integration/access-keys-page/access-keys-page.component';
import { SubjectRecordEditorDialogComponent } from './components/operator/subject-record-editor-dialog/subject-record-editor-dialog.component';
import { SubjectRecordApplyChangesDialogComponent } from './components/operator/subject-record-apply-changes-dialog/subject-record-apply-changes-dialog.component';
import { CoreModule } from '../../core/core.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ChartsModule } from 'ng2-charts';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AdminRoutingModule } from './admin-routing.module';
import { OperatorProcessingComponent } from './components/operator/operator-processing/operator-processing.component';
import { OperatorConditionsComponent } from './components/operator/operator-conditions/operator-conditions.component';
import { OperatorPreferencesComponent } from './components/operator/operator-preferences/operator-preferences.component';
import { OperatorSubjectPageComponent } from './pages/Subject/operator-subject-page/operator-subject-page.component';
import { SubjectRecordsHistoryComponent } from './components/operator/subject-records-history/subject-records-history.component';
import { SubjectInfosEditorDialogComponent } from './components/operator/subject-infos-editor-dialog/subject-infos-editor-dialog.component';
import { GettingStartedPageComponent } from './pages/getting-started-page/getting-started-page.component';
import { InterrogatePageComponent } from './pages/Integration/interrogate-page/interrogate-page.component';
import { DashboardChartComponent } from './components/dashboard/dashboard-chart/dashboard-chart.component';
import { DashboardTopTableComponent } from './components/dashboard/dashboard-top-table/dashboard-top-table.component';
import { DashboardNumbersComponent } from './components/dashboard/dashboard-numbers/dashboard-numbers.component';

@NgModule({
  declarations: [
    SideNavComponent,
    AdminPageContainerComponent,
    EntriesLibraryComponent,
    EntriesListComponent,
    EntriesListDragAndDropComponent,
    EntriesListSelectComponent,
    ModelEntryPageComponent,
    BasicinfoComponent,
    ProcessingComponent,
    ConditionsComponent,
    EntryEditorDialogComponent,
    EntryInfoComponent,
    EntryCardComponent,
    ThemeComponent,
    CollectFormCreatorPageComponent,
    ThemesPageComponent,
    FormUrlDialogComponent,
    EmailsPageComponent,
    EmailComponent,
    EntryPreviewComponent,
    PreferenceComponent,
    PreferencesPageComponent,
    DashboardPageComponent,
    ConditionsPageComponent,
    BasicinfoPageComponent,
    ProcessingPageComponent,
    AccessKeysPageComponent,
    GeneratedKeyDialogComponent,
    SubjectRecordEditorDialogComponent,
    SubjectRecordApplyChangesDialogComponent,
    OperatorProcessingComponent,
    OperatorConditionsComponent,
    OperatorPreferencesComponent,
    OperatorSubjectPageComponent,
    SubjectRecordsHistoryComponent,
    SubjectInfosEditorDialogComponent,
    GettingStartedPageComponent,
    InterrogatePageComponent,
    DashboardChartComponent,
    DashboardTopTableComponent,
    DashboardNumbersComponent
  ],
  imports: [
    AdminRoutingModule,
    CoreModule,
    SharedModule,
    ClipboardModule,
    ChartsModule,
    CodemirrorModule
  ]
})
export class AdminModule { }
