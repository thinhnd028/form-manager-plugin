import contentApi from "./content-api";
import admin from "./admin";
import salesforceForm from "./salesforce-form";
import formSubmission from "./form-submission";

export default {
  "content-api": {
    type: "content-api",
    routes: [...contentApi, ...salesforceForm, ...formSubmission],
  },
  admin: {
    type: "admin",
    routes: [...admin],
  },
};