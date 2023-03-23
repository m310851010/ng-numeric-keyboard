<h1 align="center">ng-numeric-keyboard</h1>

<p align="center">Number keyboard for mobile browsers For Angular</p>

<p align="center">
  <a aria-label="build status" href="https://npmjs.com/package/@xmagic/ng-numeric-keyboard">
    <img alt="" src="https://img.shields.io/npm/v/@xmagic/ng-numeric-keyboard/latest.svg">
  </a>
  <a aria-label="last commit" href="https://www.github.com/angular/angular">
    <img alt="" src="https://img.shields.io/badge/Build%20with-Angular%20CLI-red?logo=angular">
  </a>

  <a aria-label="license" href="https://m310851010.github.io/ng-numeric-keyboard/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="">
  </a>
</p>

> This project was forked in [numeric-keyboard](https://github.com/viclm/numeric-keyboard)

## Demo

[Online Demo](https://m310851010.github.io/ng-numeric-keyboard)

![Alt Text](https://github.com/m310851010/ng-numeric-keyboard/raw/master/static/demo.gif)

## Usage

### 1. Install

```
npm install @xmagic/ng-numeric-keyboard --save
```

import `NgNumericKeyboardModule`。

```typescript
import { NgNumericKeyboardModule } from '@xmagic/ng-numeric-keyboard';

@NgModule({
  imports: [ BrowserModule, NgNumericKeyboardModule ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Template

```html
<ng-numeric-input layout="number"
                  entertext="Next"
                  placeholder="This is placeholder"
                  [disabled]="false"
                  [(ngModel)]="data"
                  (enterpress)="onEnter()"
                  (ngModelChange)="onChange()"
                  (focus)="onInputFocus()"
                  (blur)="onInputBlur()">
</ng-numeric-input>

```

## API

Frequently used API is below. See the [link](https://github.com/viclm/numeric-keyboard#optionsprops) for more information

### Inputs
|  Name                      | Type      | Default      | Description     |
| -------------------------- |---------- | ------------ | --------------- |
| `layout`                   | string    | `number`     | keyboard layout. Possible layouts are `number`, `tel` and `phone` |
| `entertext`                | string    | `Enter`      | the label of keyboard enter key |
| `placeholder`              | string    |              | the input component's placeholder |
| `disabled`                 | boolean   | false        | disable the input component |

### Outputs
| Name                    | Type              | Description |
| ----------------------- | ----------------- | ----------- |
| `ngModelChange()`       | number            | Emits when the enter key of keyboard is pressed |
| `enterpress()`          | void              | Emits when the input's value changes            |
| `focus()`               | void              | Emits when called on focusing                   |
| `blur()`                | void              | Emits when the input loses the focus            |

### Layouts

There are three built-in layouts called `number`, `tel` and `phone` which can be used as a replacement of system keyboard.

##### number layout
![number layout](https://github.com/m310851010/ng-numeric-keyboard/raw/master/static/number.png)

##### tel layout
![tel layout](https://github.com/m310851010/ng-numeric-keyboard/raw/master/static/tel.png)

##### phone layout
![phone layout](https://github.com/m310851010/ng-numeric-keyboard/raw/master/static/phone.png)

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/m310851010/ng-numeric-keyboard/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/m310851010/ng-numeric-keyboard/blob/master/LICENSE) file for the full text)
