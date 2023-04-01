import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { KeyboardService } from '@xmagic/ng-numeric-keyboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  link = 'https://github.com/m310851010/ng-numeric-keyboard';
  title = 'ng-numeric-keyboard-demo';
  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;
  constructor(private keyboardService: KeyboardService) {}

  ngOnInit(): void {
    this.keyboardService.registerInput(this.input.nativeElement, {
      layout: 'number'
    });
  }

  onInput(evt) {
    // console.log(evt);
  }
}
