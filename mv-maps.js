import { LitElement, html, css } from "lit-element";
import Highcharts from "./js/es-modules/masters/highmaps.src.js";
import { WORLD_MAP } from "./js/world-map.js";
import { COUNTRIES } from "./js/countries.js";

export class MvMaps extends LitElement {
  static get properties() {
    return {
      map: { type: Object, attribute: false, reflect: true },
      selected: { type: Array, attribute: true, reflect: true },
    };
  }

  static get styles() {
    return css`
      .mv-maps {
        width: var(--mv-maps-width, auto);
        height: var(--mv-maps-height, auto);
      }
    `;
  }

  constructor() {
    super();
    this.map = null;
    this.selected = [];
  }

  render() {
    return html`<div class="mv-maps"></div>`;
  }

  firstUpdated() {
    Highcharts.maps["custom/world"] = WORLD_MAP;
    const mapData = Highcharts.geojson(Highcharts.maps["custom/world"]);
    const mapContainer = this.shadowRoot.querySelector(".mv-maps");
    this.map = Highcharts.mapChart(mapContainer, {
      title: null,
      legend: {
        enabled: false,
      },
      mapNavigation: {
        enabled: true,
      },
      colors: ["#eaebf0"],
      tooltip: {
        headerFormat: "",
        pointFormat: "{point.name}",
      },
      mapNavigation: {
        enabled: true,
        enableDoubleClickZoom: false,
      },
      series: [
        {
          id: "countries",
          type: "map",
          data: COUNTRIES,
          mapData,
          joinBy: ["hc-key", "id"],
          cursor: "pointer",
          point: {
            events: {
              click: this.toggleCountry,
            },
          },
          states: {
            hover: {
              color: "#99D2E7",
              borderColor: "#80828c",
            },
            select: {
              color: "#7cb5ec",
              borderColor: "#80828c",
            },
          },
          borderWidth: 0.5,
        },
      ],
    });
    if (this.selected.length > 0) {
      this.selectCountries();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "selected") {
      this.selectCountries();
    }
  }

  toggleCountry = (event) => {
    const country = event.point;
    const selected = !country.selected;
    const { id, name } = country;

    if (selected) {
      this.selected = [...this.selected, { id, name }];
    } else {
      this.map.get(country.id).select(selected, true);
      const selectedIndex = this.selected.findIndex(
        (selectedCountry) => selectedCountry.id === id
      );
      this.selected = [
        ...this.selected.slice(0, selectedIndex),
        ...this.selected.slice(selectedIndex + 1),
      ];
    }
    this.dispatchEvent(
      new CustomEvent("update-countries", {
        detail: { countries: this.selected },
      })
    );
  };

  selectCountries = () => {
    this.selected.forEach((country) => {
      this.map.get(country.id).select(true, true);
    });
  };
}

customElements.define("mv-maps", MvMaps);