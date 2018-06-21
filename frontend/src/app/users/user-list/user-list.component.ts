import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../../authentication.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: []
})
export class UserListComponent implements OnInit {
  userList: UserListComponent
  search: any
  filtered: any

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    this.search = ""
    this.auth.userList().subscribe(userList => {
      this.userList = userList
    }, (err) => {
      console.error(err)
    })
  }

}
