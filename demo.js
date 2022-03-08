import { LitElement, html, css } from "lit";
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

      pre {
        margin: 20px;
        padding: 20px 20px 0 20px;
        border: 1px solid black;
        height: 200px;
        width: 300px;
        overflow: auto;
      }

      .maps-demo {
        display: flex;
        flex-direction: row;
      }
    `;
  }

  constructor() {
    super();
    this.countries = [];
  }

  render() {
    return html`
      <div class="maps-demo">
        <mv-maps
          .selected="${this.countries}"
          @update-countries="${this.updateCountries}"
        ></mv-maps>
        ${this.countries && this.countries.length > 0
          ? html`
              <div>
                <h2>Countries selected:</h2>
                <pre>${JSON.stringify(this.countries, null, 2)}</pre>
              </div>
            `
          : html``}
      </div>
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
