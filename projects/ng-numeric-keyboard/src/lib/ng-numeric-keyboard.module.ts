import { NgModule } from '@angular/core';
import { NumericInputModule } from './numeric-input.module';
import { KeyboardDirective } from './keyboard/keyboard.directive';
import { KeyboardService } from './keyboard/keyboard.service';

@NgModule({
  exports: [NumericInputModule, KeyboardDirective],
  declarations: [KeyboardDirective],
  providers: [KeyboardService]
})
export class NgNumericKeyboardModule {}
