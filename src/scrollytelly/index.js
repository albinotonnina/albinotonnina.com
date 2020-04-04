import scrollytelly from "./scrollytelly";

import scrollytellystylesheets from "./scrollytelly.stylesheets";

export default function () {
  const instance = scrollytelly();

  scrollytellystylesheets(instance);

  return instance;
}
