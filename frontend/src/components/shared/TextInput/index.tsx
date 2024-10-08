import { useEffect, useState } from "react";
import InputMask from "react-input-mask";

import { InputWrapper, FloatingLabel, AlertLabel, Input, CharCount } from "./styles";

// Interface
interface ITextInputProps {
  type?: string;
  label: string;
  value: string;
  handleValue: (e) => any;
  maxLength?: number;
  mask?: any;
  maskChar?: string | null;
  formatChars?: any;
  required?: boolean;
  validate?: (e) => boolean;
  alert?: string;
  obligatoryAlert?: string;
  displayAlert?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  showCharCount?: boolean;
  children?: React.ReactNode;
  [x: string]: any;
};

export default function TextInput({
  type = "text",
  label,
  value,
  handleValue,
  maxLength = -1,
  mask = null,
  maskChar = null,
  formatChars = null,
  required = false,
  validate = (e) => {
    return true;
  },
  alert = "",
  obligatoryAlert = "Obrigatório",
  displayAlert = !!(alert.length != 0 || required),
  onFocus = () => { },
  onBlur = () => { },
  showCharCount = false,
  children,
  ...props
}: ITextInputProps) {
  const [focused, setFocused] = useState(value && value.length != 0);
  const [verified, setVerified] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [valid, setValid] = useState(false);
  const [charCount, setCharCount] = useState<number>(0);

  function handleAndValidate(e) {
    setVerified(true);

    let valueTemp = e.target.value;
    handleValue(valueTemp);
    setCharCount(valueTemp.length);

    let emptyTemp = valueTemp.length == 0;
    setEmpty(emptyTemp);
    setValid(required ? !emptyTemp && validate(valueTemp) : validate(value));
  }

  // Prevent undefined behaviour
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);

    if (value) {
      let emptyTemp = value.length == 0;
      setEmpty(emptyTemp);
      setValid(required ? !emptyTemp && validate(value) : validate(value));
      setCharCount(value.length);
    } else {
      setEmpty(true);
      setValid(required ? false && validate(value) : validate(value));
    }
  }, [value]);

  return (
    loaded
      ? <InputWrapper
        verified={
          displayAlert
            ? true
            : required
              ? !empty
              : verified
        }
        valid={valid}
        empty={empty}
        focused={focused || !empty}>
        {mask === null
          ? (
            <Input
              type={type}
              value={value}
              onChange={(e) => handleAndValidate(e)}
              onFocus={() => {
                setFocused(true);
                onFocus();
              }}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              maxLength={maxLength}
              {...props} />
          ) : (
            <InputMask
              value={value}
              onChange={(e) => handleAndValidate(e)}
              mask={mask}
              maskChar={maskChar}
              formatChars={formatChars}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...props}>
              {(inputProps) => (
                <Input
                  type={type}
                  {...inputProps}
                />
              )}
            </InputMask>
          )
        }

        <FloatingLabel>{label}</FloatingLabel>
        {showCharCount && maxLength !== -1 && (
          <CharCount>{charCount}/{maxLength}</CharCount>
        )}

        <AlertLabel>
          {displayAlert
            ? required && empty
              ? obligatoryAlert
              : !valid
                ? alert
                : ""
            : ""}
        </AlertLabel>

        {children}
      </InputWrapper>
      : null
  );
}
