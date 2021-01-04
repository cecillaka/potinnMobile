import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from './../../config/auth-constants';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  postData = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    gender: '',
    email: '',
    password: ''
  };
  showLoader: boolean;
  public imgProps: any = [];
  public authUser: any;

  postData1 = {
    user_id: '',
    token: ''
  };


  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router,
    private auth: AuthService,
    public http: HttpClient,
  ) {}

  ngOnInit() {

    this.auth.data$.subscribe((res: any) => {
      this.authUser = res;
      this.feedData();
      // this.getMusic();
    });


  }

  validateInputs() {
    let first_name = this.postData.first_name.trim();
    let last_name = this.postData.last_name.trim();
    let phone_number = this.postData.phone_number.trim();
    let gender = this.postData.gender.trim();
    let date_of_birth = this.postData.date_of_birth.trim();
    let password = this.postData.password.trim();
    let email = this.postData.email.trim();
   
    return (

      this.postData.first_name &&
      this.postData.last_name &&
      this.postData.phone_number &&
      this.postData.gender &&
      this.postData.date_of_birth &&
      this.postData.password &&
      this.postData.email &&
      email.length > 0 &&
      first_name.length > 0 &&
      email.length > 0 &&
      last_name.length > 0 &&
      phone_number.length > 0 &&
      gender.length > 0 &&
      date_of_birth.length > 0 &&
      password.length > 0
    );
  }

  feedData() {
    console.log(this.authUser.jwtToken);
    this.postData1.user_id = this.authUser.user_id;
    this.postData1.token = this.authUser.jwtToken;
    if (this.postData1.user_id && this.postData1.token) {
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




         verifyEmail() {

        
        this.showProgressBar();
        
          // verify user email
          this.http.post('http://127.0.0.1:8000/api/email/resend' , this.getHeaders()  ).subscribe(
              // check errors
            (response: any) => {
              this.toastService.presentToast('Check your Email to proceed.');
              this.hideProgressBar();
         
            },
            (error: any) => {
              this.toastService.presentToast('Email does not exist on our server.');
              // Hide Progress
              // this.getImages();
              this.hideProgressBar();
            }
      
      
          );
      
       
      
      
        }
      
      




  signupAction() {
    if (this.validateInputs()) {
      this.authService.signup(this.postData).subscribe(
        (res: any) => {
          if (res.data) {
            // Storing the User data.
            this.storageService
              .store(AuthConstants.AUTH, res.data)
              .then(res => {
                // this.router.navigate(['home']);
                this.router.navigate(['home/feed']);
              });
          } else {
            this.toastService.presentToast(
              'Data alreay exists, please enter new details.'
            );
          }
        },
        (error: any) => {
          this.toastService.presentToast('Network Issue.');
        }
      );
    } else {
      this.toastService.presentToast(
        'Please enter  first name, last name, gender,date of birth,email, username or password.'
      );
    }
  }
}
