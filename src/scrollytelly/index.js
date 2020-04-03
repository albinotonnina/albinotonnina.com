import scrollytelly from "./scrollytelly";
import scrollytellymenu from "./scrollytelly.menu";
import scrollytellystylesheets from "./scrollytelly.stylesheets";

export default function () {
  const instance = scrollytelly();

  scrollytellystylesheets(instance);

  scrollytellymenu(instance);

  return instance;
}
