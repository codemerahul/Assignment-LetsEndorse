import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import io from 'socket.io-client';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  socket: io;
  public userService2: UserService;
  public router2: Router;
  constructor(private userService: UserService, private router: Router) {
    this.connect()
  }
  connect() {
    this.socket = io('http://localhost:3000');
    this.socket.on('serverlog', function (res) {
      var userMail = localStorage.getItem('email');
      var response = res;
      if (res == userMail) {
        if (localStorage.getItem('email')) {
          localStorage.removeItem('email');
        }
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
        location.reload();
      }
    })

  }
  ngOnInit() {

    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        localStorage.setItem('email', JSON.stringify(this.userDetails.email));
      },
      err => {
        console.log(err);
      }
    );
  }

  onLogout() {
    if (localStorage.getItem('token')){
      this.socket.emit('logout', localStorage.getItem('email'));
      this.userService.deleteToken();
      this.router.navigate(['/login']);
    }
  }
}
