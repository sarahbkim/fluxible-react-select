import React from 'react';
import { render, findDOMNode } from 'react-dom'
import { buildLoading, buildArrow, buildClearBtn, buildSelected,  buildMenuOuter, buildInput, buildHiddenInputElem } from './Subcomponents'

const FluxibleReactSelect = React.createClass({
  displayName: 'FluxibleReactSelect',

  getInitialState: function() {
    return {
      clickedOutside: false,
      inputValue: null,
      isFocused: false,
      focusedOption: null
    }
  },
  getDefaultProps: function() {
    return {
      labelKey: 'label',
      valueKey: 'value'
    }
  },
  componentWillMount: function() {
    this.buildMenuOuter = buildMenuOuter.bind(this)
    this.buildLoading = buildLoading.bind(this)
    this.buildArrow = buildArrow.bind(this)
    this.buildClearBtn = buildClearBtn.bind(this)
    this.buildSelected = buildSelected.bind(this)
    this.buildInput = buildInput.bind(this)
    this.buildHiddenInputElem = buildHiddenInputElem.bind(this)
  },
  _clickedOutside: function(event) {
    let menuElem = findDOMNode(this.refs.menuElement)
    let controlElem = findDOMNode(this.refs.selectControlElement)

    // if it exists, it means it is open
    if (menuElem) {
      let eventOutsideMenu = this._clickedOutsideElement(menuElem, event)
      let eventOutsideControl = this._clickedOutsideElement(controlElem, event)
      if (eventOutsideControl && eventOutsideMenu) {
        this.setState({isOpen: false})
      }
    } 
  },
  _listenForClickedOutside: function (cb) {
    if (!document.addEventListener && document.attachEvent) {
      document.attachEvent('onclick', this._clickedOutside)
    } else {
      document.addEventListener('click', this._clickedOutside)
    }
  },
  _unbindListenerForClickedOutside: function(cb) {
    if (!document.removeEventListener && document.detachEvent) {
      document.detachEvent('onclick', this._clickedOutside) 
    } else {
      document.removeEventListener('click', this._clickedOutside)
    }
  },
  componentDidMount: function() {
    this._listenForClickedOutside();
  },
  componentWillUnmount: function() {
    this._unbindListenerForClickedOutside();
    this.setState({isOpen: false});
  },
  _clickedOutsideElement: function (element, event) {
    let eventTarget = event.target ? event.target : evetn.srcElement
    while (eventTarget != null) {
      if (eventTarget == element) return false
      eventTarget = eventTarget.offsetParent
    }
    return true
  },
  componentWillReceiveProps: function(newProps) {
    //FIXME: not sure if i need state here? 
    this.setState({isFetching: newProps.options.isFetching})
    this.setState({isSuccess: newProps.options.isSuccess})
  },
  renderLabel: function(op) {
    return op[this.props.labelKey]
  },
  onRemove: function(value) {
    this.props.removeSelect(value)
  },
  onOptionLabelClick: function(obj, e) {
    let selected = this._sanitizeObj(obj);
    this.props.addSelect(selected);
    this.setState({inputValue: null})
  },
  filterSelectedFromOptions: function(selected, options) {
    let key = this.props.labelKey 
    let selectedKeys = selected.reduce((prev, curr) => {
      prev.push(curr[key])
      return prev
    }, [])
    return options.filter((op) => {
      return (selectedKeys.indexOf(op[key]) > -1) ? false : true
    })
  },
  buildSelectControlElem: function() {
    return React.createElement('div', { 
      className: 'Select-control', 
      ref: 'selectControlElement',
      onKeyDown: this._handleKeyDown, 
      onMouseDown: this._handleMouseDown,
      onTouchEnd: this._handleMouseDown 
    },
      this.buildSelected(),
      this.buildInput(),
      this.buildLoading(),
      this.buildClearBtn(),
      this.buildArrow()
    )
  },
	_handleKeyDown: function (event) {
		switch (event.keyCode) {
			case 8:
				// backspace
				if (!this.state.inputValue) {
					event.preventDefault();
					this.props.popSelect();
				}
				return;
//			case 9:
//				// tab
//				if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
//					return;
//				}
//				this.selectFocusedOption();
//				break;
			case 13:
				// enter
				if (!this.state.isOpen) return;
				this._selectFocusedOption();
				break;
//			case 27:
//				// escape
//				if (this.state.isOpen) {
//					this.resetValue();
//				} else if (this.props.clearable) {
//					this.clearValue(event);
//				}
//				break;
			case 38:
				// up
				this._focusPreviousOption();
				break;
			case 40:
				// down
				this._focusNextOption();
				break;
			default:
				return;
		}
		event.preventDefault();
	},
  _getIndexOfOptionByLabel(queryOption) {
    for(let i=0;i<this.props.options.data.length;i++) {
      let opt = this.props.options.data[i]
      if (opt[this.props.labelKey] === queryOption[this.props.labelKey]) {
        return i;
      }
    }
    return null;
  },
  _selectFocusedOption(idx=null) {
    let next;
    if (!idx) {
      if (this.props.options.data.length > 0) {
        next = this.props.options.data[0]
      } 
    } else {
      if (idx >=0 && idx <= this.props.options.data.length) {
        next = this.props.options.data[idx]
      } else if (idx < 0 ){
        // reset from bottom
        next = this.props.options.data[this.props.options.data.length]
      } else if (idx > this.props.options.data.length) {
        // reset from top 
        next = this.props.options.data[0]
      }
    }
    this.setState({focusedOption: next})
  },
  _focusPreviousOption() {
    let curr = this.state.focusedOption
    let idx
    if (curr == null) {
      idx = this.props.options.data.length - 1
      this._selectFocusedOption(idx)
    } else {
      idx = this._getIndexOfOptionByLabel(curr)
      this._selectFocusedOption(idx-1)
    }
  },
  _focusNextOption() {
    let curr = this.state.focusedOption
    if (curr == null) {
      this._selectFocusedOption() 
    } else {
      let idx = this._getIndexOfOptionByLabel(curr)
      this._selectFocusedOption(idx+1)
    }
  },
  _handleInputChange: function(e) {
    //TODO: loading state, should make a call to function from props
    let input = e.target.value
    this.setState({inputValue: input})
    this.props.loadOptions(input)
  },
  _handleInputBlur: function(e) {
    this.setState({isFocused: true, isOpen: true})  
  },
  _handleInputFocus: function(e) {
    this.setState({isFocused: true, isOpen: true})  
  },
  _createStringFromHash: function(obj) {
    let arr = Object.keys(obj).reduce((prev, curr) => {
      if (obj[curr]) {
        prev.push(curr)
      }
      return prev
    }, [])
    return arr.join(' ')
  },
  _isFocused: function() {
    return this.state.isFocused;
  },
  _isFetching: function() {
    return (this.props.options.isFetching != null && this.props.options.isFetching == true) ? true : false
  },
  _sanitizeObj: function(obj) {
    if(!obj.label) {
      obj.label = obj[this.props.labelKey]
    }
    if(!obj.value) {
      obj.value = obj[this.props.valueKey]
    }
    return obj
  },
  _preventBubbles: function(e) {
		e.stopPropagation();
		e.preventDefault();
  },
  _handleMouseDown: function(e) {
    this._preventBubbles(e)
    this.setState({isOpen: true});
    this._focusInput()
  },
  _focusInput: function() {
    let input = this.refs.input
    input.focus()
  },
  _handleMouseEnter: function(option, e) {
    this.setState({focusedOption: option})
  },
  _handleMouseLeave: function(e) {
    this.setState({focusedOption: null})
  },
  _handleMouseDownOnArrow: function(e) {
  },
  render: function() {
    return React.createElement(
      'div',
      {ref: 'wrapper', className: this.props.className},
      React.createElement(
        'div',
        {className: 'Select', ref: 'select'},
        this.buildHiddenInputElem(),
        this.buildSelectControlElem(),
        this.buildMenuOuter() 
    )
  );
  }
});

FluxibleReactSelect.propTypes = {
  // required data props 
  options: React.PropTypes.object,
  values: React.PropTypes.array,
  // require functions
  loadOptions: React.PropTypes.func.isRequired,
  addSelect: React.PropTypes.func.isRequired,
  popSelect: React.PropTypes.func.isRequired,
  removeSelect: React.PropTypes.func.isRequired,
  removeAllSelected: React.PropTypes.func.isRequired,
  // optional props for customization
  placeholder: React.PropTypes.string,
  labelKey: React.PropTypes.string,
  valueKey: React.PropTypes.string,
  valueRenderer: React.PropTypes.func,
  optionRenderer: React.PropTypes.func,
  onOptionLabelClick: React.PropTypes.func
}
export default FluxibleReactSelect;
