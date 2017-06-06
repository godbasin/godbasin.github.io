import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'shared/shared.module';

import { HomeRoutes } from './home.routes';
import { HomeComponent } from './home.component';

import { PageHandbookComponent } from './page-handbook/main.component';
import { PageRebuildComponent } from './page-rebuild/main.component';

import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HomeComponent,
    PageRebuildComponent,
    PageHandbookComponent,
    SidebarComponent,
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