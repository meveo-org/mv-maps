import { LitElement, html, css } from "lit-element";
import "./mv-maps.js";

export class MvMapsDemo extends LitElement {
  static get properties() {
    return {
      countries: { type: Array, attribute: false, reflect: true },
    };
  }

  static get styles() {
    return css`
      mv-maps {
        --mv-maps-width: 900px;
        --mv-maps-height: 600px;
      }
    `;
  }

  constructor() {
    super();
    this.countries = [];
  }

  render() {
    return html`
      <mv-maps
        .selected="${this.countries}"
        @update-countries="${this.updateCountries}"
      ></mv-maps>
    `;
  }

  updateCountries = (event) => {
    const {
      detail: { countries },
    } = event;
    this.countries = countries;
  };
}

customElements.define("mv-maps-demo", MvMapsDemo);
