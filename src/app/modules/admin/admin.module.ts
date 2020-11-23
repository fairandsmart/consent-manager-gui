import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { EntriesLibraryComponent } from './components/entries/entries-library/entries-library.component';
import { EntriesListComponent } from './components/entries/entries-list/entries-list.component';
import { EntriesListDragAndDropComponent } from './components/entries/entries-list-drag-and-drop/entries-list-drag-and-drop.component';
import { EntriesListSelectComponent } from './components/entries/entries-list-select/entries-list-select.component';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { BasicinfoComponent } from './components/entry/basicinfo/basicinfo.component';
import { ProcessingComponent } from './components/entry/processing/processing.component';
import { ConditionsComponent } from './components/entry/conditions/conditions.component';
import { EntryEditorDialogComponent } from './components/entry/entry-editor-dialog/entry-editor-dialog.component';
import { EntryInfoComponent } from './components/entry/entry-info/entry-info.component';
import { EntryCardComponent } from './components/entry/entry-card/entry-card.component';
import { ThemeComponent } from './components/entry/theme/theme.component';
import { FormCreatorComponent } from './pages/form-creator/form-creator.component';
import { ThemesPageComponent } from './pages/entries-page/themes-page.component';
import { FormUrlDialogComponent } from './components/form-url-dialog/form-url-dialog.component';
import { EmailsPageComponent } from './pages/entries-page/emails-page.component';
import { EmailComponent } from './components/entry/email/email.component';
import { EntryPreviewComponent } from './components/entry/entry-preview/entry-preview.component';
import { PreferenceComponent } from './components/entry/preference/preference.component';
import { PreferencesPageComponent } from './pages/entries-page/preferences-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConditionsPageComponent } from './pages/entries-page/conditions-page.component';
import { BasicinfoPageComponent } from './pages/entries-page/basicinfo-page.component';
import { ProcessingPageComponent } from './pages/entries-page/processing-page.component';
import { GeneratedKeyDialogComponent, KeysComponent } from './pages/keys/keys.component';
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
import { OperatorSubjectPageComponent } from './pages/operator-subject-page/operator-subject-page.component';
import { SubjectRecordsHistoryComponent } from './components/operator/subject-records-history/subject-records-history.component';
import { SubjectInfosEditorDialogComponent } from './components/operator/subject-infos-editor-dialog/subject-infos-editor-dialog.component';
import { GettingStartedPageComponent } from './pages/getting-started-page/getting-started-page.component';

@NgModule({
  declarations: [
    SideNavComponent,
    AdminPageComponent,
    EntriesLibraryComponent,
    EntriesListComponent,
    EntriesListDragAndDropComponent,
    EntriesListSelectComponent,
    EntryPageComponent,
    BasicinfoComponent,
    ProcessingComponent,
    ConditionsComponent,
    EntryEditorDialogComponent,
    EntryInfoComponent,
    EntryCardComponent,
    ThemeComponent,
    FormCreatorComponent,
    ThemesPageComponent,
    FormUrlDialogComponent,
    EmailsPageComponent,
    EmailComponent,
    EntryPreviewComponent,
    PreferenceComponent,
    PreferencesPageComponent,
    DashboardComponent,
    ConditionsPageComponent,
    BasicinfoPageComponent,
    ProcessingPageComponent,
    KeysComponent,
    GeneratedKeyDialogComponent,
    SubjectRecordEditorDialogComponent,
    SubjectRecordApplyChangesDialogComponent,
    OperatorProcessingComponent,
    OperatorConditionsComponent,
    OperatorPreferencesComponent,
    OperatorSubjectPageComponent,
    SubjectRecordsHistoryComponent,
    SubjectInfosEditorDialogComponent,
    GettingStartedPageComponent
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
