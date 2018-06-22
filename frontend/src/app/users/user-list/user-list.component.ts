import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../../authentication.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: []
})
export class UserListComponent implements OnInit {
  userList : UserListComponent
  search : {}
  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    const req_vars = {  query: {},
                        fields: { email_id: 1, first_name: 1, last_name: 1, contact_number: 1 },
                        offset: 0,
                        order: { first_name: 1}
                      }
    this.getUserList(req_vars)
  }

  getUserList = (req_vars) => {

    this.auth.userList(req_vars).subscribe(userList => {
      this.userList = userList
    }, (err) => {
      console.error(err)
    })
  }
}
