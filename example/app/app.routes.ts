import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {FormComponent} from './pages/form/form.component';
import {GuideComponent} from './pages/guide/guide.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {TermsOfUseComponent} from './pages/terms-of-use/terms-of-use.component';
import {ReportComponent} from './pages/report/report.component';

export const routes: Routes = [
  {
    path: '',
    component: FormComponent
  },
  {
    path: 'edit/:id',
    component: FormComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
  {
    path: 'terms-of-use',
    component: TermsOfUseComponent
  },
  {
    path: ':id',
    component: GuideComponent
  },
];
