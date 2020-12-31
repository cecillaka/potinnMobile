import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { StorageService } from './../../services/storage.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {
  public authUser: any;

  postData = {
    user_id: '',
    token: '',
    email_verified_at1:''
  };
  userInfo: any;
  constructor(
    private auth: AuthService,
    private feedSerive: FeedService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router,
    public http: HttpClient,
  ) {}

  ngOnInit() {
    this.auth.data$.subscribe((res: any) => {
      this.authUser = res;
      this.feedData();  
       this.verify();
    });
 
  }

  feedData() {
    console.log(this.authUser);
    this.postData.user_id = this.authUser.user_id;
    this.postData.token = this.authUser.token;
    // this.postData. email_verified_at1= this.aemail_verified_at
    // console.log(this.authUser.user.email_verified_at)
  
    if (this.postData.user_id && this.postData.token) {
      this.feedSerive.feedData(this.postData).subscribe(
        (res: any) => {
          this.feedSerive.changeFeedData(res.feedData);
          
        },
        (error: any) => {
          this.toastService.presentToast('Network Issue.');
        }
      );
     
    }
   
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
 



  verify() {

    this.http.get('http://127.0.0.1:8000/api/auth/user', this.getHeaders()).subscribe((data) => {

      this.userInfo = data;
     //  this.imageData$ = data;
 
      console.log(this.userInfo);
      if (this.userInfo.email_verified_at !=='null'||this.userInfo.email_verified_at ==='') {
         
         this.toastService.presentToast('Please verify your email.');
         this.router.navigate(['verify-email']);
      }
 
     
    });


 
  }



}
