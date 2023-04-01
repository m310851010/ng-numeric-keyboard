import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector
} from '@angular/core';
import { KeyboardOptions, NumericKeyboardComponent } from './keyboard.component';
import { fromEvent, map, Subscription, timer } from 'rxjs';
import { ENTER } from '../utils/keys';
import { animate } from '../utils/utils';
import * as Keys from '../utils/keys';

export class KeyboardRef {
  private _activeInputElement!: HTMLInputElement | HTMLTextAreaElement | null;
  private keyboardElement!: HTMLDivElement;
  private keyboard: ComponentRef<NumericKeyboardComponent>;
  private touchend$: Subscription | null = null;

  constructor(
    private input: InputElement,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this._activeInputElement =
      (input as ElementRef<HTMLInputElement | HTMLTextAreaElement>).nativeElement ||
      (input as HTMLInputElement | HTMLTextAreaElement);
  }

  /**
   * Focus to input
   *
   * @private
   */
  private _focusActiveInput(): void {
    this._activeInputElement?.focus();
  }

  private handleButtonClicked(button: string): void {
    switch (button) {
      case Keys.BLANK:
        return;
      case Keys.ESC:
        this.closeKeyboard();
        return;
      case Keys.ENTER:
        this.closeKeyboard();
        return;
      case Keys.DEL:
        this.deleteChar(this._activeInputElement);
        break;
      default:
        this.insertChar(this._activeInputElement, button);
        break;
    }
  }

  private insertChar(input, text: string) {
    if (input) {
      this._focusActiveInput();
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      const oldValue = input.value;
      input.value = oldValue.substring(0, startPos) + text + oldValue.substring(endPos);
      input.setSelectionRange(startPos + 1, startPos + 1);
    }
  }

  private deleteChar(input) {
    this._focusActiveInput();
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    if (startPos == endPos && startPos > 0) {
      const oldValue = input.value;
      input.value = oldValue.substring(0, startPos - 1) + oldValue.substring(endPos);
      input.setSelectionRange(startPos - 1, startPos - 1);
    } else {
      input.value = input.value.substring(0, startPos) + input.value.substring(endPos);
      input.setSelectionRange(startPos, startPos);
    }
  }

  private createKeyboard(el, events?: Events, options?: KeyboardOptions): ComponentRef<NumericKeyboardComponent> {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(NumericKeyboardComponent)
      .create(this.injector);

    if (options) {
      Object.assign(componentRef.instance, options);
    }

    componentRef.instance.ngOnInit();

    for (const event in events || {}) {
      componentRef.instance[event].subscribe(events[event].bind(this));
    }

    this.appRef.attachView(componentRef.hostView);
    const element = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    el.appendChild(element);

    return componentRef;
  }

  openKeyboard(options?: KeyboardOptions) {
    if (this.keyboard) {
      return;
    }

    const elContainer = document.createElement('div');
    const elShadow = document.createElement('div');
    const elKeyboard = document.createElement('div');
    elContainer.className = 'numeric-keyboard-actionsheet';
    elContainer.appendChild(elShadow);
    elContainer.appendChild(elKeyboard);
    document.body.appendChild(elContainer);

    this.keyboardElement = elKeyboard;
    const inputHandler = this.handleButtonClicked.bind(this);
    let timer$: Subscription | null = null;
    this.keyboard = this.createKeyboard(
      elKeyboard,
      {
        press: inputHandler,
        longPress: key => {
          if (key === ENTER) {
            this.handleButtonClicked(key);
            return;
          }

          timer$ = timer(0, 100)
            .pipe(map(v => key))
            .subscribe(inputHandler);
        },
        longPressEnd(key: string) {
          if (timer$) {
            timer$.unsubscribe();
            timer$ = null;
          }
        }
      },
      options
    );

    animate(
      (timestamp, frame, frames) => {
        elKeyboard.style.position = 'fixed';
        elKeyboard.style.bottom = '0';
        elKeyboard.style.left = '0';
        elKeyboard.style.transform = `translateY(${((frames - frame) / frames) * 100}%)`;
      },
      () => this.register(),
      10
    );
  }

  closeKeyboard() {
    if (!this.keyboard) {
      return;
    }

    const keyboard = this.keyboard;
    const elKeyboard = this.keyboardElement;

    animate(
      (timestamp, frame, frames) => {
        elKeyboard.style.transform = `translateY(${(frame / frames) * 100}%)`;
      },
      () => {
        setTimeout(() => {
          this.destroyKeyboard(elKeyboard, keyboard);
          document.body.removeChild(elKeyboard.parentNode);
        }, 50);
      },
      10
    );

    this.keyboard = null;
    this.keyboardElement = null;
  }

  private destroyKeyboard(el, keyboard) {
    keyboard.destroy();
    this.appRef.detachView(keyboard.hostView);
  }

  private register() {
    this.touchend$ = fromEvent(document, 'touchend').subscribe(evt => this.unregister(evt));
  }

  private unregister(e?: any) {
    if (
      e &&
      this.keyboardElement &&
      (this._activeInputElement.contains(e.target) ||
        this.keyboardElement === e.target ||
        this.keyboardElement.contains(e.target))
    ) {
      return;
    }

    if (this.touchend$) {
      this.touchend$.unsubscribe();
      this.touchend$ = null;
    }

    if (e) {
      this.closeKeyboard();
    }
  }
}

export interface Events {
  enterpress?(): void;
  press?(key: string): void;
  longEnterpress?(): void;
  longPress?(key: string): void;
  longEnterpressEnd?(): void;
  longPressEnd?(key: string): void;
}

export type InputElement = HTMLInputElement | HTMLTextAreaElement | ElementRef<HTMLInputElement | HTMLTextAreaElement>;
