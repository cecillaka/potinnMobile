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
  public postData1 = {
    first_name: '',
 
  };

  public postData2 = {
    last_name: '',
  
  };

  public postData3 = {
   phone_number: '',
  
  };
  postData = {
    user_id: '',
    token: '',
    email_verified_at1:''
  };
  first_name: any;
  last_name: any;
  phone_number: any;
  userInfo: any;
  bytes:any;
  newbytes:any;
  progressbarColor:any;
  tickColor1:any;
  tickColor2:any;
  tickColor3:any;
  verified:boolean;
  
  progressbarValue:any;
  gig:any;
  mb:any;
  constructor(
    private auth: AuthService,
    private feedSerive: FeedService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router,
    public http: HttpClient,
  ) {
    this.verified = true;
  }

  ngOnInit() {
    this.auth.data$.subscribe((res: any) => {
      this.authUser = res;
      // this.feedData();  
       this.verify();
    });
    
;
  }

  feedData() {
    // console.log(this.authUser);
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
// update first name
         updateFname() {  
          //  this.verify();
          if(this.postData1.first_name !=="")
          {
          this.tickColor1="primary"
          this.http.post('http://127.0.0.1:8000/api/account/name' , this.postData1, this.getHeaders()  ).subscribe(
            // check errors
          (res: any) => {
            this.tickColor1="success"
            this.toastService.presentToast('first name Updated successfully.');
            console.log(res);
            this.verify();
    
          },
          (error: any) => {
            this.tickColor1="danger"
            this.toastService.presentToast('Network Issue.please try again');
            console.log(error);
            console.log(error.message);
            
          }
        
    
        );
          }
          else{
            this.toastService.presentToast('please fill up your first name, before updating');
          }
         }
         
      // update last name
      updateLname() {  
        // this.verify();
        if(this.postData2.last_name !=="")
        {
        this.tickColor2="primary"
       this.http.post('http://127.0.0.1:8000/api/account/surname' , this.postData2, this.getHeaders()  ).subscribe(
         // check errors
       (res: any) => {
         this.tickColor2="success"
         this.toastService.presentToast('Last name Updated successfully.');
         console.log(res);
         this.verify();
         
 
       },
       (error: any) => {
         this.tickColor2="danger"
         this.toastService.presentToast('Network Issue.please try again');
         console.log(error);
         
       }
 
 
     );
      }
      else{
        this.toastService.presentToast('please fill up your Last name, before updating');
      }
      }
      
      
       // update cell number
       updateTel() {
        if(this.postData3.phone_number !=="")
        {  
        this.tickColor3="primary"
       this.http.post('http://127.0.0.1:8000/api/account/phone' , this.postData3, this.getHeaders()  ).subscribe(
         // check errors
       (res: any) => {
         this.tickColor3="success"
         this.toastService.presentToast('Cell phone Updated successfully.');
         this.verify();
         console.log(res);
         
 
       },
       (error: any) => {
         this.tickColor3="danger"
         this.toastService.presentToast('Network Issue.please try again');
         console.log(error);
         
       }
 
 
     );
      }
      else{
        this.toastService.presentToast('please fill up your cell number, before updating');
      }
      }
      




 public verify() {

    this.http.get('http://127.0.0.1:8000/api/auth/user', this.getHeaders()).subscribe((data) => {

      this.userInfo = data;
    ; 
       
      this.first_name=this.userInfo.first_name;
      this.last_name=this.userInfo.last_name;
      this.phone_number=this.userInfo.phone_number;

      console.log(this.userInfo);
      this.bytes=this.userInfo.size/(1024*1024);
      this.gig=this.userInfo.size/(1024*1024*1024);

       this.newbytes=Math.round(this.bytes)+" "+"MB"
this.progressbarValue=(this.userInfo.size/(1024*1024))/500
console.log(this.progressbarValue);



if(this.progressbarValue<0.5 ){
  this.progressbarColor="warning"
}
if(this.progressbarValue>0.5){
  this.progressbarColor="primary"
}
if(this.progressbarValue<0.25){
  this.progressbarColor="danger"
  this.toastService.presentToast('Storage almost full,please delete some items.');
}



      if (this.userInfo.email_verified_at ) {
       
        // return this.toastService.presentToast(' email verified.');
        //  this.router.navigate(['verify-email']);

       
      }
 
      else{
        this.toastService.presentToast('Please verify your email.');
        // return  this.router.navigate(['verify-email']);
        this.router.navigate(['verify-email']);
      }
    });


 
  }









}
