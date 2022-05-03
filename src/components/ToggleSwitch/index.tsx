import classnames from "classnames";
import isBoolean from "lodash/isBoolean";
import isFunction from "lodash/isFunction";
import isString from "lodash/isString";
import React, { useCallback, useState } from "react";
import "./index.css";

function ToggleSwitch({
  enabled: initialEnabled,
  indeterminate: initialIndeterminate,
  onClick,
  onStateChanged,
  theme,
  className,
  ...restProps
}: {
  enabled: boolean | (() => boolean);
  indeterminate?: boolean | (() => boolean);
  onClick?: () => void;
  onStateChanged: ({ enabled }: { enabled: boolean }) => void;
  theme: string;
  className: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const booleanFromProps = useCallback((bool: boolean | (() => boolean)) => {
    // let { enabled } = this.props;

    // If enabled is a function, invoke the function
    bool = isFunction(bool) ? bool() : bool;

    // Return enabled if it is a boolean, otherwise false
    return isBoolean(bool) && bool;
  }, []);

  const [enabled, setEnabled] = useState<boolean>(
    booleanFromProps(initialEnabled)
  );
  const [indeterminate, setIndeterminate] = useState<boolean | undefined>(
    !!initialIndeterminate && booleanFromProps(initialIndeterminate)
  );

  // isEnabled = () => this.state.enabled;

  // isIndeterminate = () => this.state.indeterminate;

  const toggleSwitch = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.persist();
    evt.preventDefault();

    // const { onClick, onStateChanged } = this.props;

    setEnabled(!enabled);
    setIndeterminate(undefined);

    // Augument the event object with SWITCH_STATE
    const switchEvent = Object.assign(evt, { SWITCH_STATE: enabled });

    // Execute the callback functions
    isFunction(onClick) && onClick(switchEvent);
    isFunction(onStateChanged) && onStateChanged(enabled);
  };

  // Use default as a fallback theme if valid theme is not passed
  const switchTheme = theme && isString(theme) ? theme : "default";

  const switchClasses = classnames(`switch switch--${switchTheme}`, className);

  let togglerClasses;
  if (!indeterminate) {
    togglerClasses = classnames(
      "switch-toggle",
      `switch-toggle--${enabled ? "on" : "off"}`
    );
  } else {
    togglerClasses = indeterminate
      ? classnames("switch-toggle", "switch-toggle--indeterminate")
      : classnames("switch-toggle");
  }

  return (
    <div className={switchClasses} onClick={toggleSwitch} {...restProps}>
      <div className={togglerClasses}></div>
    </div>
  );
}

export default ToggleSwitch;
