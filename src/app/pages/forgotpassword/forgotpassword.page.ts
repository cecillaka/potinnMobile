import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  postData = {
  
    email: '',
    
  };


  constructor(
    private toastService: ToastService,
    public http: HttpClient,
  ) { 

    
  }

  ngOnInit() {
  }

// submit email for forget password


forgotPassword() {



if ( this.postData.email !== ' ' ) {
  // sent email t
  this.http.post('http://127.0.0.1:8000/api/password/email',this.postData  ).subscribe(
      // check errors
    (response: any) => {  
      this.toastService.presentToast('request sent successfully. please check your email!');
      
    },
    (error: any) => {
      this.toastService.presentToast('Email do not Exist in our server.');
      // Hide Progress
      // this.getImages();
      console.log(error);
      console.log(this.postData);
     
    }


  );

} 
else{

  this.toastService.presentToast('Enter Email.');
}


}




}
