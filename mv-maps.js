import { LitElement, html, css } from "lit";
import Highcharts from "./js/es-modules/masters/highmaps.src.js";
import { WORLD_MAP } from "./js/world-map.js";
import { COUNTRIES } from "./js/countries.js";

export class MvMaps extends LitElement {
  static get properties() {
    return {
      map: { type: Object, attribute: false, reflect: true },
      selected: { type: Array, attribute: true, reflect: true },
      resizeWidth: { type: Number, attribute: "resize-width", reflect: true },
      resizeDelay: { type: Number, attribute: "resize-delay", reflect: true },
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
    this.resizeWidth = 1;
    this.resizeDelay = 160;
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
        buttonOptions: {
          alignTo: "spacingBox",
          verticalAlign: "bottom",
        },
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
          animation: false,
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
      this.toggleCountries(this.selected, true);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("page-resize", this.triggerResize);
    window.addEventListener("resize", this.triggerResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("page-resize", this.triggerResize);
    window.removeEventListener("resize", this.triggerResize);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "selected") {
      const previousCountries = JSON.parse(oldValue);
      const currentCountries = JSON.parse(newValue);
      const deselectedCountries = !!oldValue
        ? previousCountries.filter(
            (value) =>
              currentCountries.findIndex(
                (selected) => selected.id === value.id
              ) < 0
          )
        : [];
      this.toggleCountries(currentCountries, true);
      this.toggleCountries(deselectedCountries, false);
    }
  }

  toggleCountry = (event) => {
    const country = event.point;
    const selected = !country.selected;
    const { id, name } = country;

    if (selected) {
      this.selected = [...this.selected, { id, name }];
    } else {
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

  toggleCountries = (countries, isSelected) => {
    if (!!this.map) {
      countries.forEach((country) => {
        this.map.get(country.id).select(isSelected, true);
      });
    }
  };

  triggerResize = () => {
    this.map.setSize(this.resizeWidth);
    setTimeout(() => {
      this.map.setSize(null);
    }, this.resizeDelay);
  };
}

customElements.define("mv-maps", MvMaps);
