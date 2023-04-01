import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ENTER, DEL, ESC } from '../utils/keys';
import { Layout, LayoutItem, Layouts, LayoutsType } from '../utils/layouts';
import { filter, fromEvent, map, merge, of, Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'ng-numeric-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class NumericKeyboardComponent implements OnInit, OnDestroy {
  @Input() layout: KeyboardOptions['layout'] = 'number';
  @Input() entertext: string = 'Enter';

  @Output() press = new EventEmitter<string>();
  @Output() enterpress = new EventEmitter();
  /**
   * 长按
   */
  @Output() longPress = new EventEmitter<string>();
  /**
   * 长按
   */
  @Output() longEnterpress = new EventEmitter();

  /**
   * 长按结束
   */
  @Output() longPressEnd = new EventEmitter<string>();
  /**
   * 长按结束
   */
  @Output() longEnterpressEnd = new EventEmitter();

  touchStart?: TouchEvent;
  destroy$ = new Subject<void>();

  _keyItem?: LayoutItem;
  public kp: KeyboardOptions;
  public ks: { resolvedLayout: Layout };
  public ENTER = ENTER;
  public DEL = DEL;
  public ESC = ESC;

  touchEnd$ = new Subject<LayoutItem>();
  touchMove$ = fromEvent(document, 'touchmove').pipe(takeUntil(this.destroy$));

  constructor() {}

  ngOnInit() {
    const options = { layout: this.layout, entertext: this.entertext };
    this.init(options);
  }

  stopEvent(event: TouchEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onTouchStart(event: TouchEvent, item: LayoutItem) {
    this._keyItem = item;
    this.touchStart = event;
    timer(500)
      .pipe(map(() => item))
      .pipe(takeUntil(merge(this.touchEnd$, this.touchMove$)))
      .subscribe(value => {
        // 超过500ms为长按
        this.touchStart = undefined;
        this.longPress.emit(value.key);
        if (value.key === ENTER) {
          this.longEnterpress.emit();
        }
      });
  }
  onTouchEnd(event: TouchEvent, item: LayoutItem) {
    this._keyItem = undefined;
    this.touchEnd$.next(item);

    // 长按结束
    if (!this.touchStart) {
      this.longPressEnd.emit(item.key);
      if (item.key === ENTER) {
        this.longEnterpressEnd.emit(item.key);
      }
    }

    of(item)
      .pipe(
        filter(() => this.touchStart !== undefined),
        takeUntil(this.touchMove$)
      )
      .subscribe(value => {
        this.press.emit(value.key);
        if (value.key === ENTER) {
          this.enterpress.emit();
        }
      });
  }

  private init(options: KeyboardOptions) {
    const { layout } = options;

    let resolvedLayout: Layout;
    if (typeof layout === 'string') {
      resolvedLayout = Layouts[layout];
      if (!Array.isArray(resolvedLayout)) {
        throw new Error(`${layout} is not a build-in layout.`);
      }
    } else {
      resolvedLayout = layout;
      if (!Array.isArray(resolvedLayout) || !resolvedLayout.every(i => Array.isArray(i))) {
        throw new Error(`custom layout must be a two-dimensional array.`);
      }
    }

    this.kp = options;
    this.ks = { resolvedLayout };
  }

  ngOnDestroy() {
    this.destroy$.next(); // 发出一个值，通知所有订阅了 destroy$ 的可观察对象停止向下传递值
    this.destroy$.complete(); // 停止 destroy$ 的传播，释放资源
  }
}

export interface KeyboardOptions {
  layout?: keyof LayoutsType | Layout;
  entertext?: string;
}
