import { Component ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inner',
  templateUrl: './inner.component.html',
  styleUrl: './inner.component.css',
  // schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class InnerComponent {

}
