# mv-maps

MvMaps is a map component (based on lit-element) that renders a map with selectable countries.  It makes use of [Highcharts Maps](https://www.highcharts.com/products/maps/) to render the map

## Quick Start

To experiment with the MvMaps component.

1. Clone this repo.

2. Serve the project from the root directory with some http server (best served with meveo itself)

3. Update the maps demo component in demo.js file

## Sample usage

```html
<mv-maps
  .selected="${this.countries}"               // an array of countries with id and name properties
  @update-countries="${this.updateCountries}" // a custom event that returns a list of countries that 
                                              // have been selected
></mv-maps>
```

You can also check this [demo](https://maps.meveo.org/)

## Acknowledgements

* MvMaps uses [Highcharts Maps](https://www.highcharts.com/products/maps/).