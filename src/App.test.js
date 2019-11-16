import * as intel from "./intel";

intel.fill({
  name: "torvalds",
  platformName: "gitlab",
  server: "gitlab.htl-villach.at"
}).then(() => {
  console.log(intel.user());
  console.log(intel.repos());
  console.log(intel.orgs());
  console.log(intel.languages());
  console.log(intel.calendar());
});

