import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {  ViewChild, ElementRef } from '@angular/core';
import { ApiService, ApiImage } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from './../../services/toast.service';
import { StorageService } from './../../services/storage.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import { FileEntry } from '@ionic-native/file';
import {NgForm} from '@angular/forms';
import { FeedService } from 'src/app/services/feed.service';
import { BehaviorSubject } from 'rxjs';
import {  AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  showLoader: boolean;

  public authUser: any;

  constructor( private api: ApiService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    public http: HttpClient,
    public fb: FormBuilder,
    private auth: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private authService: AuthService,
    private apis: HttpService,
    private sanitizer: DomSanitizer,
    private feedSerive: FeedService,
    private router: Router,
    public alertController: AlertController,) { }

  ngOnInit() {
    this.auth.data$.subscribe((res: any) => {
      this.authUser = res;
      
      
    });

  }


  showProgressBar() {
    this.showLoader = true;
  }

  hideProgressBar() {
    this.showLoader = false;
  }
 
getHeaders() {
  // storing token inside a variable t
  const t = this.authUser.jwtToken;

  // declaring headers for passing token data
  // tslint:disable-next-line: variable-name
  const headers_object = new HttpHeaders({

    Accept: 'application/json',
    Authorization: 'Bearer ' + t

    });
  const httpOptions = {
          headers: headers_object
        };
  return httpOptions;
       }



// test(){
//   this.auth.data$.subscribe((res: any) => {
//     this.authUser = res;
    
//      this.verifyEmail();
//   });
// }


logoutAction() {
  this.authService.logout();
}
 
verifyEmail() {

    this.showProgressBar();

    
      this.http.get('http://api.princesolutions.co.za/api/email/resend',this.getHeaders()).subscribe(
          // check errors and response
        (response: any) => {
          if(response){
          this.toastService.presentToast(response.message);
         console.log(response);
          this.hideProgressBar();
         return  this.logoutAction();
        }

        else{
          
          console.log(response);
           this.hideProgressBar();
        
         return this.toastService.presentToast(response.message);
        }

     
        },
        (error: any) => {
          this.hideProgressBar();
          console.log(error);
          this.toastService.presentToast('something went wrong, try again after 10 min');
          return this.logoutAction();
        
          
        }
  
  
      );
  
    }





}
