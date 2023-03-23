import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-numeric-keyboard-demo';
  data = '12345';

    public PasswordLayout = 'number'
    public password: string = ''

    press(key) {

    }

  onEnter() {}

  onChange() {}

  onInputFocus() {}

  onInputBlur() {}
}
