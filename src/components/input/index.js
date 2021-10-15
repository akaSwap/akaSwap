import { React, useState, useEffect } from 'react'
import styles from './styles.module.scss'
import './styles.css';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';

export const Input = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  label,
  onChange = () => null,
  onFocus = () => null,
  disabled,
  value,
  autoComplete = 'off',
  step = 1
}) => (
  <div className={styles.container}>
    <label className={styles.field}>
      <input
        className={styles.field__input}
        type={type}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        maxLength={maxlength}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        step={step}
        onFocus={onFocus}
      />
      <span className={styles.field__label_wrap}>
        <span className={styles.field__label}>
          {label}
        </span>
      </span>
    </label>
  </div>
)

export const Textarea = ({
  id,
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  maxlength = 3000,
  label,
  onChange = () => null,
  onFocus = () => null,
  disabled,
  value,
  autoComplete = 'off',
  step = 1
}) => (
  <div className={styles.container}>
    <label className={styles.field}>
      <textarea
        id={id}
        className={styles.textarea}
        placeholder={placeholder}
        multiline="true"
        name={name}
        maxLength={maxlength}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        step={step}
        onFocus={onFocus}
        rows={4}
        cols={50}
        value={value}>
      </textarea>
      <span className={styles.field__label_wrap}>
        <span className={styles.field__label}>
          {label}
        </span>
      </span>
    </label>
  </div>
)

export const WideNumber = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  step = 1,
  maxlength = 3000,
  label,
  onFocus = () => null,
  onChange = () => null,
  disabled,
  value,
  autoComplete = 'off'
}) => (
  <div className={styles.container}>
    <label className={styles.widefield}>
      <input
        className={styles.field__input}
        placeholder={placeholder}
        type={type}
        name={name}
        min={min}
        max={max}
        step={step}
        maxLength={maxlength}
        defaultValue={value}
        onFocus={onFocus}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <span className={styles.field__label_wrap}>
        <span className={styles.field__label}>
          {label}
        </span>
      </span>
    </label>
  </div>
)

export const CheckBox = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  label,
  onChange = () => null,
  disabled,
  value,
  checked = false
}) => (
  <div className={styles.container}>
    <label className={styles.toggle}>
      {label}
      <input
        type={type}
        className={styles.toggle__input}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        maxLength={maxlength}
        defaultValue={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.toggle_track}>
        <span className={styles.toggle_indicator}>
          <span className={styles.checkMark}>
            <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
              <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
            </svg>
          </span>
        </span>
      </span>
    </label>
  </div>
)

export const Color = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  label,
  onChange = () => null,
  disabled,
  value,
}) => (
  <div className={styles.container}>
    <label className={styles.field}>
      <input
        className={styles.color__input}
        type={type}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        maxLength={maxlength}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.color__label_wrap}>
        <span className={styles.field__label}>
          {label}
        </span>
      </span>
    </label>
  </div>
)

export const Slider = ({
  type = 'range',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  step,
  label = ["", "", ""],
  onChange = () => null,
  disabled,
  value = 1,
}) => (
  <div className={styles.container}>

    <input
      className={styles.range__input}
      type={type}
      placeholder={placeholder}
      name={name}
      min={min}
      max={max}
      step={step}
      defaultValue={value}
      onChange={onChange}
      disabled={disabled}
    />
    <label className={styles.range__label}>{label[value - 1]}</label>
  </div>
)
export const DatetimePicker = ({
  to = null,
  href = null,
  onClick = () => null,
  onMouseLeave = () => null,
  onMouseEnter = () => null,
  children,
  disabled,
  fit,
  value,
  target = "_blank",
  onChanged = (value) => null,
  customClass,
  maxRange = 30
}) => {

  const [minDate, setMinDate] = useState()
  const [maxDate, setMaxDate] = useState()

  // const setDateRange = () => {
  //   let nd = new Date()
  //   let min = addMin(modulo(nd, 30), 30)
  //   let max = addDay(min, 30)
  //   setMinDate(min)
  //   setMaxDate(max)
  // }


  useEffect(() => {
    //setDateRange()
    let nd = new Date()
    let min = addMin(modulo(nd, 30), 30)
    let max = addDay(min, 30)
    setMinDate(min)
    setMaxDate(max)
  }, [])

  function addMin(minDate, minute) {
    var dt = new Date()
    dt.setTime(minDate.getTime() + (minute * 60 * 1000))
    return dt
  }

  function modulo(minDate, minute) {
    var dt = new Date()
    dt.setTime(minDate.getTime() - (dt.getTime() % (minute * 60 * 1000)))
    return (dt)
  }

  function addDay(minDate, days) {
    var dt = new Date()
    dt.setDate(minDate.getDate() + days)
    return dt
  }

  return (
    <div className={customClass + ' ' + styles.datetimePicker}>
      <DateTimePickerComponent
        change={({ value }) => onChanged(value)}
        step={30}
        value={minDate}
        min={minDate}
        max={maxDate}
      />
    </div>
  )
}
