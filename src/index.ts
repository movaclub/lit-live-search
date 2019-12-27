import {customElement, html, LitElement} from "lit-element";
import cities from "../datum";
import { fromEvent } from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";

// @ts-ignore
@customElement('cj-root')
// @ts-ignore
export class CjRoot extends LitElement {

  public cities: string[];
  public lookup: string[];

  constructor(
  ) {
    super();
    this.cities = cities.ua;
    this.lookup = [];
    // console.log('cities: ', this.cities);
  }

  static get properties() {
    return {
      lookup: Array
    }
  }

  txtInput(e: Event): void {
    console.log('txtINPUT: ', e);
    fromEvent(document.getElementById('city'), 'keyup')
      .pipe(
        map( str => str.target.value),
        filter( str => str.length > 2 ),
        debounceTime(750),
        distinctUntilChanged()
      )
      .subscribe(
        str => {
          this.lookup = [];
          console.log(str);
          for ( const ci of this.cities ) {
            ci.toLowerCase().includes(str.toLowerCase()) ? this.lookup.push(ci) : null;
          }

          console.log('LOOKUP: ', this.lookup);
        }
      )
  }

  protected render() { //<!-- "щонайменше 3 літери" -> min 3 letters input -->
    return html`
        <h4>Інтерактивний пошук міст</h4>
        <input
        id="city"
        placeholder="щонайменше 3 літери" 
        type="text" 
        @keyup="${ (e: Event) => this.txtInput(e) }" />
        
        <pre>
         ${this.lookup.join(', ')}
        </pre>
    `;
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

}
