import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitoService } from '../../services/cognito.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-account-details.component.html',
  styleUrl: './edit-account-details.component.scss'
})
export class EditAccountDetailsComponent {
  nickname: string = '';

  constructor(private cognitoService: CognitoService, private http: HttpClient, private router: Router) {
  }
  
  async registerInternally(): Promise<any> {
    const cognitoId: string | null = await this.cognitoService.getCognitoUserId();
    if (!cognitoId) {
      console.log("Cognito ID is null!");
      return;
    }
    const headers = await this.cognitoService.getHttpHeaders();
    this.http.post(`${environment.apiUrl}/account/register`, 
      {name: this.nickname},
      {headers: headers}).subscribe((res: any) => {
        console.log("response from create user:");
        console.log(res);
        this.router.navigate(['/home']);
    });
  }
}
