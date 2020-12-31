import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  postData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  validateInputs() {
    console.log(this.postData);
    const email = this.postData.email.trim();
    const password = this.postData.password.trim();
    return (
      this.postData.email &&
      this.postData.password &&
      email.length > 0 &&
      password.length > 0
    );
  }

  loginAction() {
    if (this.validateInputs()) {
      this.authService.login(this.postData).subscribe(
        (res: any) => {
          if (res.data) {
            // Storing the User data.
            this.storageService
              .store(AuthConstants.AUTH, res.data)
              .then(res => {
                this.router.navigate(['home/feed']);
              });
          } else {
            this.toastService.presentToast('Network issue');
            
          }
        },
        (error: any) => {
          this.toastService.presentToast('Incorrect username and password.');
        }
      );
    } else {
      this.toastService.presentToast(
        'Please enter email/username or password.'
      );
    }
  }
}
