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

const { Camera } = Plugins;





@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {
  public authUser: any;
  imgProps:  any;
  constructor(
    private api: ApiService,
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
              public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.auth.data$.subscribe((res: any) => {
      this.authUser = res;
      
      
    });


  }

  
getHeaders() {
  // storing token inside a variable t
  const t = this.authUser.jwtToken;
console.log(t);
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

       logoutAction() {
        this.authService.logout();
      }

      test(){
        this.auth.data$.subscribe((res: any) => {
          this.authUser = res;
          
          this.verifyMyEmail();
        });
      }


       verifyMyEmail() {

       
        // my posting image to backend
        this.http.get('http://api.princesolutions.co.za/api/email/resend', this.getHeaders()).subscribe((data) => {
       
            this.imgProps = data;
            console.log(this.imgProps);
           //  this.thumbnail = JSON.stringify (this.imgProps);
           if(this.imgProps){
            this.toastService.presentToast("check your email");
           }

           else{
            this.toastService.presentToast("something went wrong");
           }
          
          });
       
          }






}
