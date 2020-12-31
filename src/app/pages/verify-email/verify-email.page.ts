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

  images: ApiImage[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  img1: any;
  url: any;
  form: FormGroup;
  showLoader: boolean;
  public imgProps: any = [];
  public authUser: any;

  postData = {
    user_id: '',
    token: ''
  };
  thumbnail: any = [];
// test


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
      this.feedData();
      
    });

  }

  feedData() {
    console.log(this.authUser.jwtToken);
    this.postData.user_id = this.authUser.user_id;
    this.postData.token = this.authUser.jwtToken;
    if (this.postData.user_id && this.postData.token) {
     // tslint:disable-next-line: no-unused-expression
     (error: any) => {
        this.toastService.presentToast('Network Issue.');
        };
    }
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



test(){
  this.auth.data$.subscribe((res: any) => {
    this.authUser = res;
    this.feedData();
     this.verifyEmail();
  });
}

  verifyEmail() {

   
    this.showProgressBar();
    
      // verify user email
      this.http.post('http://127.0.0.1:8000/api/email/resend',this.getHeaders()).subscribe(
          // check errors
        (response: any) => {
          this.toastService.presentToast('Check your Email to proceed.');
          this.router.navigate(['login']);
          this.hideProgressBar();
     
        },
        (error: any) => {
          this.toastService.presentToast('Email does not exist on our server.');
          console.log(error);
          // Hide Progress
         
          this.hideProgressBar();
        }
  
  
      );
  
   
  
  
    }



}
