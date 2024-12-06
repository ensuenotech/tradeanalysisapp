import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../services/localStorage.service';
// import * as CryptoJS from 'cry';
import * as CryptoJS from 'crypto-js';
import { UsersService } from '../services/users.service';
import { EncService } from '../services/enc.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Services } from '../services.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  // loginForm = new FormGroup({
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', [Validators.required])
  // })

constructor(
  private fb: FormBuilder,
  private encService:EncService,
  private router: Router,
  private route: ActivatedRoute,
  private authService: AuthService,
  private userService: UserService,
  private services: Services,
  private localStorage: LocalStorageService
){
  
}

ngOnInit(): void {

  this.loginForm = this.fb.group({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
}
  submit(){
    if (this.loginForm.invalid) {
      Swal.fire({
        title: 'Required',
        text: 'Please fill in the required details',
        icon: 'warning',
      });
    } else {
      this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .subscribe((res: any) => {
        let encryptedMessage = CryptoJS.AES.encrypt((res.message).toString(), 'bmsInfo').toString();
        this.localStorage.set('userStatus', encryptedMessage)
        if (res.result) {
          // this.router.navigateByUrl('/contact-admin');
          this.localStorage.set('userToken', res.token);
          const userId = this.authService.getUserId()
          if (userId) {
            this.userService.getUserDetails(userId).subscribe((res: any) => {
              this.localStorage.set("userdata", this.encService.encrypt(JSON.stringify(res)))
            })
          }
          this.router.navigateByUrl('/dashboard');

        }
        else if (res.result == false && res.message == "reset_password") {
          Swal.fire('Due to system upgrade, you have to setup a new password. Please follow the steps on the next page.').then(() => {
            this.router.navigateByUrl('/forget-password?u=' + this.services.encryptData(res.id))

          })
        }
        else if (res.result == false && res.message == "mobile_not_verified") {
          Swal.fire('Your mobile number is not verified with us. Please contact admin.').then(() => {
          })
          return;
        }
        else if (res.result == false && res.message == "email_not_verified") {
          Swal.fire('Your email id is not verified with us. Please contact admin.').then(() => {
          })
          return;
        }
        else if (res.result == false && res.message == "incorrect_password") {
          Swal.fire('Password is incorrect').then(() => {
          })
          return;
        }
        else if (res.result == false && res.message == "no_user") {
          Swal.fire('Please check Email Id. It is not registered.').then(() => {
          })
          return;
        }
        else {
          Swal.fire({
            title: 'Login Error',
            text: res.message || 'Please check the details',
            icon: 'error',
          });
        }
      },
        (err) => {
          // Swal.fire({
          //   title: err.statusText,
          //   text: err.statusText,
          //   icon: 'error',
          // });
        }
      );









    }
  }
}


