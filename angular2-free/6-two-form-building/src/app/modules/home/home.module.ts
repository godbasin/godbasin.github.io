import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'shared/shared.module';

import { HomeRoutes } from './home.routes';
import { HomeComponent } from './home.component';

import { PageHandbookComponent } from './page-handbook/main.component';
import { PageRebuildComponent } from './page-rebuild/main.component';

import { PageSettingComponent } from './page-setting/main.component';
import { TemplateDrivenFormComponent } from './page-setting/template-driven/template-driven.component';
import { ReactiveFormComponent } from './page-setting/reactive/reactive.component';

import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HomeComponent,
    PageSettingComponent,
    PageRebuildComponent,
    PageHandbookComponent,
    SidebarComponent,
    TemplateDrivenFormComponent,
    ReactiveFormComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(HomeRoutes)
  ],
  providers: []
})
export class HomeModule { }