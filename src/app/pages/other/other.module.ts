import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { OtherPage } from './other.page';

const routes: Routes = [
  {
    path: '',
    component: OtherPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtherPage]
})
export class OtherPageModule {}
