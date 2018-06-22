import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html'
})
export class UserUpdateComponent implements OnInit {
  userDetails : {}
  userId: String
  userTypes: [{}]

  constructor(private auth: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userDetails = {}
    this.userTypes = [{ name: "Admin", value: "Admin"}, { name: "Student", value: "Student"}]
    this.route.params.subscribe(params => {
      this.userId = params['id']
    })
    const req_vars = { query: { _id: this.userId } , fields: { salt: 0, hash: 0 } }
    this.auth.userView(req_vars).subscribe(userDetails => {
      this.userDetails = userDetails
    }, (err) => {
      console.error(err)
    })
  }
  updateUser = () => {
    const req_vars = this.userDetails
    this.auth.userUpdate(req_vars).subscribe(userDetails => {

      console.log("User has been Updated")
      //this.router.navigate(['/userList'])
    }, (err) => {
      console.error(err)
    })
  }
}
