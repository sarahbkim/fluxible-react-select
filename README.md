# Fluxible-React-Select
[more info](https://github.com/sarahbkim/fluxible-react-select)

# How to install
run `npm install --save-dev fluxible-react-select`

# How to use
The react component requires a handful of props:
### required props:
-  options: React.PropTypes.object,
-  values: React.PropTypes.array,
-  loadOptions: React.PropTypes.func.isRequired,
-  addSelect: React.PropTypes.func.isRequired,
-  popSelect: React.PropTypes.func.isRequired,
-  removeSelect: React.PropTypes.func.isRequired,
-  removeAllSelected: React.PropTypes.func.isRequired,

### optional props for customization
-  placeholder: React.PropTypes.string,
-  labelKey: React.PropTypes.string,
-  valueKey: React.PropTypes.string,
-  valueRenderer: React.PropTypes.func,
-  optionRenderer: React.PropTypes.func,
-  onOptionLabelClick: React.PropTypes.func

# Credits, etc.
Fluxible React Select uses [Jed Watson's react-select](https://github.com/JedWatson/react-select) components like Option, Value, and re-uses parts of his Select component as well. The main difference there is that this "fluxible" version removes handling it's own state. This is instead managed via props, which the user passes in. This allows a more flexible interface if you want to use a flux-like library along with a React multi-select component.


