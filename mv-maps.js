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
    this.resizeEvent = null;
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
    this.resizeEvent = document.createEvent("HTMLEvents");
    this.resizeEvent.initEvent("resize", true, false);
    document.addEventListener("page-resize", this.triggerResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("page-resize", this.triggerResize);
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
    setTimeout(() => {
      document.dispatchEvent(this.resizeEvent);
    }, 200);
  };
}

customElements.define("mv-maps", MvMaps);
