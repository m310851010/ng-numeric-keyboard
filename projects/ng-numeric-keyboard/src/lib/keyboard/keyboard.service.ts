import { ApplicationRef, ComponentFactoryResolver, ElementRef, Injectable, Injector } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { InputElement, KeyboardRef } from './keyboard-ref';
import { KeyboardOptions } from './keyboard.component';

@Injectable()
export class KeyboardService {
  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  /**
   * 注册输入框
   * @param input
   * @param options
   */
  registerInput(
    input: InputElement,
    options?: KeyboardOptions & {
      /**
       * 是否绑定事件,用来自动触发弹起键盘, false不注册事件, 需要用户自己控制
       */
      bindEvent?: boolean;
    }
  ): KeyboardRef {
    const _activeInputElement =
      (input as ElementRef<HTMLInputElement | HTMLTextAreaElement>).nativeElement ||
      (input as HTMLInputElement | HTMLTextAreaElement);

    const keyboardRef = new KeyboardRef(input, this.appRef, this.componentFactoryResolver, this.injector);

    if (options?.bindEvent !== false) {
      merge(fromEvent(_activeInputElement, 'focus'), fromEvent(_activeInputElement, 'touchend')).subscribe(() =>
        keyboardRef.openKeyboard(options)
      );
    }
    return keyboardRef;
  }
}
