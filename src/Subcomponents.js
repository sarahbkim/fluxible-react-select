import React from 'react';
import { render, findDOMNode } from 'react-dom'
import Input from 'react-input-autosize'
import Value from 'react-select/lib/Value' 
import Option from 'react-select/lib/Option' 

export function buildLoading() {
  // TODO: this isFetching shouldn't really be from props... 
  return this._isFetching() ? React.createElement(
    'span',
    { className: 'Select-loading-zone', 'aria-hidden': 'true', ref: 'loading' },
    React.createElement('span', { className: 'Select-loading' })
  ) : null;
}

export function buildArrow() {
  return React.createElement('span', { 
    className: 'Select-arrow-zone', 
    ref: 'arrow',
    onMouseDown: this._handleMouseDownOnArrow },
      React.createElement('span', { 
        className: 'Select-arrow', 
        onMouseDown: this._handleMouseDownOnArrow 
      }));
}

export function buildClearBtn() {
  // TODO: this isFetching shouldn't really be from props... 
  if (this.props.values.length > 0 && this._isFetching()) {
    return React.createElement(
      'span',
      { className: 'Select-clear-zone', 
        ref: 'clear-btn',
        title: this.props.clearAllText, 
        'aria-label': this.props.clearAllText,
        onMouseDown: this.props.removeAllSelected,
        onTouchEnd: this.props.removeAllSelected,
        onClick: this.props.removeAllSelected},
      React.createElement('span', { 
        className: 'Select-clear', 
        dangerouslySetInnerHTML: { __html: '&times;' } 
      })
    )
  } else {
    return React.createElement(
      'span'
    )
  }
}

export function buildSelected() {
  let selected = []
  this.props.values.map((val, i) => {
    let valueRenderer = this.props.valueRenderer || this.renderLabel,
        onOptionLabelClick = this.props.onOptionLabelClick.bind(this, val),
        onRemove = this.onRemove.bind(this, val);

    selected.push(React.createElement(Value, {
      key: 'value-' + val[this.props.valueKey] + i,
      option: val, 
      renderer: valueRenderer,
      onRemove: onRemove,
      onOptionLabelClick: onOptionLabelClick,
      optionLabelClick: !!this.props.onOptionLabelClick
    }));
  });
  return selected;
}

export function buildHiddenInputElem() {
  return React.createElement('input', { 
    type: 'hidden',
    ref: 'value', 
    name: 'name', 
    value: 'value',
    disabled: this.props.disabled 
  })
}

export function buildInput() {
  let placeholder = this.props.values.length > 0 ? '' : this.props.placeholder
  let inputProps = {
    ref: 'input',
    className: 'Select-input',
    onFocus: this._handleInputFocus,
    minWidth: '5',
    onBlur: this._handleInputBlur,
    placeholder: placeholder, 
    tabIndex: 0
  }
  // TODO: should be searchable and not disabled
  return React.createElement(Input, $.extend({}, {
    value: this.state.inputValue,
    onChange: this._handleInputChange,
    minWidth: '5'}, inputProps)
  )
}

export function buildMenuOuter() {
  this.buildMenuList = buildMenuList.bind(this)
  if (this.state.isOpen) {
    return React.createElement('div',
    {className: 'Select-menu-outer', 
    ref: 'menuElement'},
    React.createElement('div', { 
      className: 'Select-menu' },
      this.buildMenuList())
    )
  } else {
    return null;
  }
}

function buildMenuList() {
  let valueRenderer = this.props.optionRenderer || this.renderLabel,
      filteredOpts = this.filterSelectedFromOptions(this.props.values, this.props.options.data),
      focused = this.state.focusedOption ? this.state.focusedOption[this.props.valueKey] : null;

  let opts = filteredOpts.map((op) => {

    let isFocused = focused ? focused === op[this.props.valueKey] : false
    let optClassState = {
      'Select-option': true,
      'is-focused': isFocused
    }
    let classNames = this._createStringFromHash(optClassState);
    let onOptionLabelClick = this.onOptionLabelClick.bind(this, op)
    let onMouseEnter = this._handleMouseEnter.bind(this, op)
    let onMouseLeave = this._handleMouseLeave.bind(this, op)

    return React.createElement(this.props.optionComponent, {
      key: 'option-' + op.label,
      className: classNames, 
      renderFunc: valueRenderer,
      ref: 'option',
      option: op,
      mouseEnter: onMouseEnter,
      mouseDown: onOptionLabelClick,
      mouseLeave: onMouseLeave
    }); 
  });
  return opts;
}

