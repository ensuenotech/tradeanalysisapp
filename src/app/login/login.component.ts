import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import Swal from "sweetalert2";
import { LocalStorageService } from "../services/localStorage.service";

import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Services } from "../services.service";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginForm!: FormGroup;
  // loginForm = new FormGroup({
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', [Validators.required])
  // })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }
  submit() {
    if (this.loginForm.invalid) {
      Swal.fire({
        title: "Required",
        text: "Please fill in the required details",
        icon: "warning",
      });
    }
     else 
     {
      this.authService.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
      .subscribe((res: any) => {
      let encryptedMessage = CryptoJS.AES.encrypt((res.message).toString(), 'bmsInfo').toString();
      this.localStorage.set('userStatus', encryptedMessage)
      if (res.result) {
        // this.router.navigateByUrl('/contact-admin');
        this.localStorage.set('userToken', res.token);
        const userId = this.authService.getUserId()
        if (userId) {
          // this.userService.getUserDetails(userId).subscribe((res: any) => {
          //   this.localStorage.set("userdata", this.encService.encrypt(JSON.stringify(res)))
          // })
        }
        this.router.navigateByUrl('/dashboard');
      }
    })
    
      // this.authService
      //   .login({
      //     email: this.loginForm.controls["email"].value,
      //     password: this.loginForm.controls["password"].value,
      //   })
      //   .subscribe(
      //     (res: any) => {
      //       this.localStorage.set("userToken", res.token);
      //       this.router.navigateByUrl('/trade/dashboard');
      //       // this.router.navigateByUrl("/tradeAnalysis");
      //     },
      //     (error: any) => {
      //       Swal.fire({
      //         title: "Login Error",
      //         text: error.error,
      //         icon: "error",
      //       });
      //     }
      //   );
    }
  }
}
