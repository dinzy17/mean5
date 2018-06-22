import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html'
})
export class UserViewComponent implements OnInit {
  userDetails : {}
  userId: String
  constructor(private auth: AuthenticationService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userDetails = {}
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

}
