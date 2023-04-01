import {
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import { KeyboardRef } from './keyboard-ref';
import { Layout, LayoutsType } from '../utils/layouts';

@Directive({
  selector: 'input[ngKeyboard],textarea[ngKeyboard]'
})
export class KeyboardDirective implements OnInit {
  @Input() layout: keyof LayoutsType | Layout = 'number';
  @Input() entertext: string = 'Enter';

  private keyboardRef: KeyboardRef;
  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>
  ) {}

  ngOnInit(): void {
    this.keyboardRef = new KeyboardRef(this.elementRef, this.appRef, this.componentFactoryResolver, this.injector);
  }

  @HostListener('focus', ['$event'])
  handleFocus(event: MouseEvent): void {
    this.keyboardRef.openKeyboard({ layout: this.layout, entertext: this.entertext });
  }

  @HostListener('touchend', ['$event'])
  handleTouchend(event: MouseEvent): void {
    this.handleFocus(event);
  }
}
