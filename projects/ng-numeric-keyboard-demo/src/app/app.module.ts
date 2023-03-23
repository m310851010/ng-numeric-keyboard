import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgNumericKeyboardModule } from '@xmagic/ng-numeric-keyboard';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgNumericKeyboardModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
