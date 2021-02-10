import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {  ViewChild, ElementRef } from '@angular/core';
import { ApiService, ApiImage } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from './../../services/toast.service';
import { StorageService } from './../../services/storage.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import { FileEntry } from '@ionic-native/file';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {
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
    // private previewAnyFile: PreviewAnyFile,
    private sanitizer: DomSanitizer,
    // private videoPlayer: VideoPlayer,
    public alertController: AlertController,

  ) {
    this.form = this.fb.group({
      name: [''],
      files: ['']
    });
  }

  ngOnInit() {


    this.auth.data$.subscribe((res: any) => {
      this.authUser = res;
      this.feedData();
      this.getMusic();
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

uploadFile(event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({
    files: file
  });
  this.form.get('files').updateValueAndValidity();

}
// test function



// --------------------------

  fileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event: any) => {
        this.img1 = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);  // to trigger onload
    }
    const fileList: FileList = event.target.files;
    const file: File = fileList[0];
    console.log(file);
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


 submitForm() {

    // tslint:disable-next-line: prefer-const
  let formData: any = new FormData();
  formData.append('files', this.form.get('files').value);

  this.showProgressBar();
  if ( this.form.get('files').value !== ' ' ) {
    // my posting image to backend
    this.http.post('http://api.princesolutions.co.za/api/file/audio' , formData, this.getHeaders()  ).subscribe(
        // check errors
      (response: any) => {
        this.toastService.presentToast('Music Uploaded successfully.');
        this.hideProgressBar();
        this.getMusic();
      },
      (error: any) => {
        this.toastService.presentToast('Network Issue.');
        // Hide Progress
        // this.getImages();
        this.hideProgressBar();
      }


    );

  } else if (this.form.get('files').value === ' ') {
    this.toastService.presentToast('Nothing to Upload !');
    // Hide Progress
    // this.getImages();
    this.hideProgressBar();
  }


  }


  getMusic() {


    // my posting image to backend
    this.http.get('http://api.princesolutions.co.za/api/file/audio', this.getHeaders()   ).subscribe((apart: any) => {
        this.imgProps = apart;
        console.log(this.imgProps);

        // this.thumbnail = this.sanitizer.bypassSecurityTrustUrl( this.imgProps);
       //  this.thumbnail = JSON.stringify (this.imgProps);

      });
  }


// test

deleteMusic(i) {


  this.http.delete('http://api.princesolutions.co.za/api/file' + '/' + i  , this.getHeaders()  ).subscribe(
    // check errors
  (res: any) => {
    this.toastService.presentToast('Track deleted successfully.');
    this.hideProgressBar();
    this.getMusic();

  },
  (error: any) => {
    this.toastService.presentToast('Network Issue try again.');

    this.hideProgressBar();

    });

    }


async AlertDeleteMusic(i) {
  const alert = await this.alertController.create({
    header: 'Are you sure You want to Delete this Track?',


    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Confirm',
        handler: () => {
          console.log('Confirm Submit');
          this.deleteMusic(i);
        }
      }
    ]
  });

  await alert.present();
}
// end of delete function


// download video function

downloadMusic(i) {


  this.http.post('http://api.princesolutions.co.za/api/file/download' + '/' + i , this.getHeaders()  ).subscribe(
    // check errors and response
  (res: any) => {
    this.toastService.presentToast('Track downloaded successfully.');
    this.hideProgressBar();


  },
  (error: any) => {
    this.toastService.presentToast('Network Issue try again.');
    // Hide Progress
    // this.getImages()

    this.hideProgressBar();

    });

    }


async AlertDownloadMusic(i) {
  const alert = await this.alertController.create({
    header: 'Are you sure You want to Download this track?',


    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Confirm',
        handler: () => {
          console.log('Confirm Submit');
          this.downloadMusic(i);

        }
      }
    ]
  });

  await alert.present();
}
// end of delete and alert function










}
